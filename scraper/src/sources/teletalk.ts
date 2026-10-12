// Teletalk AllJobs public API (verified 2026-10-12): every government circular with PDF,
// deadline and admit-card/result flags. The list shows only the first post, so the PDF
// is read to find nursing posts hidden inside multi-post circulars.

import type { LifecycleEvent, SectionSlug } from "@bsc-nursing/shared";
import { extractCircular } from "../extract/circular";
import { getJson, mapLimit } from "../lib/http";
import type { ScrapedItem } from "../lib/store";
import { dhakaDate, isNursingText } from "../lib/text";
import type { Source } from "./types";

const BASE = "https://alljobs.teletalk.com.bd";

interface Org {
  name: string;
  name_bn: string | null;
  short_name: string | null;
  website: string | null;
}

interface ListJob {
  id: number;
  job_title: string;
  job_title_bn: string | null;
}

interface Details extends ListJob {
  vacancy: string | null;
  min_age: number | null;
  max_age: number | null;
  application_site: string | null;
  advertisement_file: string | null;
  published_date: string | null;
  deadline_date: string | null;
  admit_card: boolean;
  is_result: boolean;
  is_notice: boolean;
  admit_card_upload: string | null;
  download_url: string | null;
  result_upload: string | null;
  notice_upload: string | null;
  notice_download_url: string | null;
  notice_text: string | null;
  job_utilities_govtorganization: Org;
}

const media = (path: string | null) => (path ? `${BASE}/media/${path.replace(/^\//, "")}` : null);

export function govtSection(orgName: string): SectionSlug {
  if (/army|navy|air force|defence|cantonment|cmh|armed forces|সেনা|নৌ|বিমান বাহিনী|প্রতিরক্ষা/i.test(orgName)) return "defence";
  if (/nursing|dgnm|dghs|health|civil surgeon|medical college|hospital|family planning|dgfp|স্বাস্থ্য|নার্সিং|সিভিল সার্জন|হাসপাতাল/i.test(orgName)) return "govt-health";
  return "govt-other";
}

export const teletalk: Source = {
  id: "teletalk",
  name: "Teletalk AllJobs (সরকারি)",
  async run({ cache, now, log }) {
    const list: ListJob[] = [];
    for (let page = 1; page <= 30; page++) {
      const res = await getJson<{ govtJobs: ListJob[] }>(`${BASE}/api/v1/govt-jobs/list?page=${page}&limit=20`);
      list.push(...res.govtJobs);
      if (res.govtJobs.length < 20) break;
    }
    log(`teletalk: ${list.length} active circulars`);

    const details = await mapLimit(list, 4, async (j) => {
      try {
        return (await getJson<{ details: Details }>(`${BASE}/api/v1/govt-jobs/public-details?id=${j.id}`)).details;
      } catch {
        return null;
      }
    });

    const items: ScrapedItem[] = [];
    let aiSkipped = 0;
    for (const d of details) {
      if (!d) continue;
      const org = d.job_utilities_govtorganization;
      const titleIsNursing = isNursingText(`${d.job_title} ${d.job_title_bn ?? ""}`);
      const pdfUrl = media(d.advertisement_file);
      const ex = pdfUrl ? await extractCircular(pdfUrl, cache, now, { forceAi: titleIsNursing }) : null;
      if (ex === null && pdfUrl) aiSkipped++;
      const nursing = titleIsNursing || ex?.status === "nursing";
      if (!nursing) continue;

      const events: LifecycleEvent[] = [
        { type: "circular", title: "নিয়োগ বিজ্ঞপ্তি প্রকাশ", date: dhakaDate(d.published_date), url: pdfUrl, seenAt: now },
      ];
      if (d.admit_card)
        events.push({ type: "admit_card", title: "প্রবেশপত্র ডাউনলোড চালু", date: null, url: d.download_url ?? media(d.admit_card_upload), seenAt: now });
      if (d.is_notice)
        events.push({ type: "notice", title: d.notice_text?.slice(0, 120) || "নতুন নোটিশ", date: null, url: d.notice_download_url ?? media(d.notice_upload), seenAt: now });
      if (d.is_result)
        events.push({ type: "final_result", title: "ফলাফল প্রকাশ", date: null, url: media(d.result_upload), seenAt: now });

      const posts = ex?.nursePosts.length
        ? ex.nursePosts
        : [{ name: d.job_title_bn || d.job_title, count: parseInt(d.vacancy ?? "", 10) || null, qualification: null, salary: null, ageLimit: null, bscEligible: "unknown" as const }];
      const eligibility = posts.some((p) => p.bscEligible === "yes")
        ? "yes"
        : posts.some((p) => p.bscEligible === "diploma_min")
          ? "diploma_min"
          : posts.every((p) => p.bscEligible === "no")
            ? "no"
            : "unknown";
      const ageLimit = d.max_age ? `${d.min_age ?? 18}–${d.max_age} বছর` : (posts[0]?.ageLimit ?? null);
      const totalVacancies = posts.reduce((n, p) => n + (p.count ?? 0), 0) || null;

      items.push({
        sourceId: "teletalk",
        sourceKey: String(d.id),
        kind: "job",
        section: govtSection(`${org.name} ${org.name_bn ?? ""}`),
        title: posts.map((p) => p.name).join(", "),
        titleBn: ex?.title ?? d.job_title_bn,
        organization: org.name.replace(/\s*\([A-Z0-9]+\)\s*$/, ""),
        organizationBn: org.name_bn,
        posts,
        totalVacancies,
        location: null,
        publishedAt: dhakaDate(d.published_date),
        applicationStart: ex?.applicationStart ?? dhakaDate(d.published_date),
        deadline: dhakaDate(d.deadline_date) ?? ex?.deadline ?? null,
        examDate: ex?.examDate ?? null,
        applyUrl: d.application_site,
        detailUrl: `${BASE}/jobs/government/${d.id}`,
        circularUrl: pdfUrl,
        salary: posts.find((p) => p.salary)?.salary ?? null,
        ageLimit,
        applicationFee: ex?.applicationFee ?? null,
        experience: null,
        gender: null,
        bscEligible: eligibility,
        trust: "A1",
        warning: null,
        aiExtracted: ex?.method === "gemini",
        needsReview: eligibility === "unknown",
        events,
      });
    }
    if (aiSkipped) log(`teletalk: ${aiSkipped} PDFs waiting for AI (budget/key) — will retry next run`);
    return items;
  },
};
