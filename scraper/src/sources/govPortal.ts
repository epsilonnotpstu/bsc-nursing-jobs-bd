// Generic scraper for Bangladesh National Portal offices (`https://<office>.gov.bd/pages/notices`).
// All gov.bd sites share this platform, so one parser covers DGNM, BNMC, BPSC, BSHI, BOESL, etc.

import type { OpportunityKind, SectionSlug } from "@bsc-nursing/shared";
import * as cheerio from "cheerio";
import { createHash } from "node:crypto";
import { extractCircular } from "../extract/circular";
import { getText } from "../lib/http";
import type { ScrapedItem } from "../lib/store";
import { cleanText, isNursingText, parseDate } from "../lib/text";
import type { Source } from "./types";

interface OfficeConfig {
  id: string;
  domain: string;
  name: string;
  nameBn: string;
  /** Every notice is nursing-related (DGNM, BNMC): keep all except admin noise. */
  nursingDomain: boolean;
  /** Section for recruitment notices from this office. */
  jobSection: SectionSlug;
  /** Notice-board path (default `/pages/notices`). Orders live under `/pages/go-ultimates`. */
  path?: string;
  /** Extra filter: keep only titles matching this (used for the huge, transfer-heavy order list). */
  includeRe?: RegExp;
}

export const OFFICES: OfficeConfig[] = [
  { id: "dgnm", domain: "dgnm.gov.bd", name: "Directorate General of Nursing and Midwifery", nameBn: "নার্সিং ও মিডওয়াইফারি অধিদপ্তর", nursingDomain: true, jobSection: "govt-health" },
  {
    id: "dgnm-orders", domain: "dgnm.gov.bd", path: "/pages/go-ultimates", name: "DGNM (Orders)", nameBn: "নার্সিং ও মিডওয়াইফারি অধিদপ্তর (আদেশ)",
    nursingDomain: true, jobSection: "special",
    includeRe: /হজ|hajj|প্রশিক্ষণ|training|বৃত্তি|scholarship|উচ্চশিক্ষা|higher stud|ফেলোশিপ|fellowship|কোর্স|course|ভর্তি|নিয়োগ|মনোনয়ন|নির্বাচিত|PGCNET/i,
  },
  { id: "bnmc", domain: "bnmc.gov.bd", name: "Bangladesh Nursing and Midwifery Council", nameBn: "বাংলাদেশ নার্সিং ও মিডওয়াইফারি কাউন্সিল", nursingDomain: true, jobSection: "govt-health" },
  { id: "bpsc", domain: "bpsc.gov.bd", name: "Bangladesh Public Service Commission", nameBn: "বাংলাদেশ সরকারি কর্ম কমিশন", nursingDomain: false, jobSection: "govt-health" },
  { id: "dghs", domain: "dghs.gov.bd", name: "Directorate General of Health Services", nameBn: "স্বাস্থ্য অধিদপ্তর", nursingDomain: false, jobSection: "govt-health" },
  { id: "hsd", domain: "hsd.gov.bd", name: "Health Services Division", nameBn: "স্বাস্থ্য সেবা বিভাগ", nursingDomain: false, jobSection: "govt-health" },
  { id: "mefwd", domain: "mefwd.gov.bd", name: "Medical Education & Family Welfare Division", nameBn: "স্বাস্থ্য শিক্ষা ও পরিবার কল্যাণ বিভাগ", nursingDomain: false, jobSection: "teaching" },
  { id: "dgfp", domain: "dgfp.gov.bd", name: "Directorate General of Family Planning", nameBn: "পরিবার পরিকল্পনা অধিদপ্তর", nursingDomain: false, jobSection: "govt-health" },
  { id: "bshi", domain: "bshi.gov.bd", name: "Bangladesh Shishu Hospital & Institute", nameBn: "বাংলাদেশ শিশু হাসপাতাল ও ইনস্টিটিউট", nursingDomain: false, jobSection: "govt-other" },
  { id: "moha", domain: "moha.gov.bd", name: "Ministry of Home Affairs", nameBn: "স্বরাষ্ট্র মন্ত্রণালয়", nursingDomain: false, jobSection: "govt-other" },
  { id: "railway", domain: "railway.gov.bd", name: "Bangladesh Railway", nameBn: "বাংলাদেশ রেলওয়ে", nursingDomain: false, jobSection: "govt-other" },
  { id: "prison", domain: "prison.gov.bd", name: "Department of Prisons", nameBn: "কারা অধিদপ্তর", nursingDomain: false, jobSection: "govt-other" },
  { id: "bgb", domain: "bgb.gov.bd", name: "Border Guard Bangladesh", nameBn: "বর্ডার গার্ড বাংলাদেশ", nursingDomain: false, jobSection: "govt-other" },
  { id: "caab", domain: "caab.gov.bd", name: "Civil Aviation Authority of Bangladesh", nameBn: "বেসামরিক বিমান চলাচল কর্তৃপক্ষ", nursingDomain: false, jobSection: "govt-other" },
  { id: "boesl", domain: "boesl.gov.bd", name: "BOESL", nameBn: "বোয়েসেল", nursingDomain: false, jobSection: "abroad-jobs" },
  { id: "bmet", domain: "bmet.gov.bd", name: "BMET", nameBn: "জনশক্তি, কর্মসংস্থান ও প্রশিক্ষণ ব্যুরো", nursingDomain: false, jobSection: "abroad-jobs" },
];

/** Administrative notices that are not opportunities for job seekers. */
const NOISE_RE =
  /শোক|বদলি|বদলী|পদায়ন|সংযুক্তি|সম্পদ বিবরণী|ছুটি|দরপত্র|টেন্ডার|tender|কোটেশন|quotation|নিলাম|সভার|মিটিং|শুদ্ধাচার|এপিএ|APA|তথ্য অধিকার|অভিযোগ|অবসর|পেনশন|জ্যেষ্ঠতা|গ্রেডেশন|পদোন্নতি|উচ্চতর গ্রেড|বার্ষিক|ড্রেস কোড|অফিস আদেশ|office order|সতর্কবার্তা/i;

export function classifyNotice(title: string, jobSection: SectionSlug): { kind: OpportunityKind; section: SectionSlug } {
  const t = title;
  if (/হজ|hajj/i.test(t)) return { kind: "notice", section: "special" };
  if (/প্রবেশপত্র|admit/i.test(t)) return { kind: "admit_card", section: "exams-results" };
  if (/ফলাফল|ফল প্রকাশ|result|উত্তীর্ণ|অপেক্ষমান|অপেক্ষমাণ|চূড়ান্ত|merit|মেধা তালিকা|নির্বাচিত/i.test(t)) return { kind: "result", section: "exams-results" };
  if (/সময়সূচি|সময়সূচী|পরীক্ষার তারিখ|আসন বিন্যাস|seat plan|schedule|মৌখিক পরীক্ষা|viva|লিখিত পরীক্ষা/i.test(t)) return { kind: "exam_schedule", section: "exams-results" };
  if (/লাইসেন্স|license|licensing|রেজিস্ট্রেশন|registration|নিবন্ধন/i.test(t)) return { kind: "notice", section: "exams-results" };
  if (/ভর্তি|admission/i.test(t)) return { kind: "admission", section: "higher-study" };
  if (/প্রশিক্ষণ|training|কোর্স|course|PGCNET|certificate in nursing education|ফেলোশিপ|fellowship|বৃত্তি|scholarship/i.test(t)) return { kind: "training", section: "special" };
  if (/নিয়োগ|niyog|recruit|circular|বিজ্ঞপ্তি|আবেদন আহবান|আবেদন আহ্বান|vacanc|চাকুরী|চাকরি/i.test(t)) return { kind: "job", section: jobSection };
  return { kind: "notice", section: jobSection === "abroad-jobs" ? "abroad-jobs" : "exams-results" };
}

interface NoticeRow {
  title: string;
  pdfUrls: string[];
  publishedAt: string | null;
  detailUrl: string | null;
}

export function parseNoticeTable(html: string, baseUrl: string): NoticeRow[] {
  const $ = cheerio.load(html);
  const rows: NoticeRow[] = [];
  $("tr.table-tr").each((_, tr) => {
    const row = $(tr);
    const title = cleanText(row.find('td[data-column="title"]').text());
    if (!title) return;
    const pdfUrls = row
      .find('td[data-column="files"] a[href]')
      .map((_, a) => $(a).attr("href")!)
      .get();
    const date = cleanText(row.find('td[data-column="publish_date"]').text());
    const href = row.find('a[href*="/pages/"]').last().attr("href");
    rows.push({
      title,
      pdfUrls,
      publishedAt: parseDate(date, "DMY"),
      detailUrl: href ? new URL(href, baseUrl).toString() : null,
    });
  });
  return rows;
}

const hash = (s: string) => createHash("sha1").update(s).digest("hex").slice(0, 16);

function govPortalSource(office: OfficeConfig): Source {
  return {
    id: `gov-${office.id}`,
    name: office.nameBn,
    async run({ cache, now }) {
      const base = `https://${office.domain}${office.path ?? "/pages/notices"}`;
      const rows = parseNoticeTable(await getText(base), base);
      if (rows.length === 0) throw new Error("no notice rows parsed (page layout changed?)");

      const items: ScrapedItem[] = [];
      for (const r of rows) {
        if (NOISE_RE.test(r.title)) continue;
        if (office.includeRe && !office.includeRe.test(r.title)) continue;
        if (!office.nursingDomain && !isNursingText(r.title)) continue;
        const { kind, section } = classifyNotice(r.title, office.jobSection);
        const pdfUrl = r.pdfUrls[0] ?? null;

        // Recruitment/admission circulars: read the PDF for posts and dates.
        const ex = pdfUrl && (kind === "job" || kind === "admission") ? await extractCircular(pdfUrl, cache, now, { forceAi: true }) : null;
        const posts = ex?.nursePosts ?? [];
        const eligibility = posts.some((p) => p.bscEligible === "yes")
          ? "yes"
          : posts.some((p) => p.bscEligible === "diploma_min")
            ? "diploma_min"
            : "unknown";

        items.push({
          sourceId: `gov-${office.id}`,
          sourceKey: hash(r.detailUrl ?? r.title),
          kind,
          section,
          title: r.title,
          titleBn: r.title,
          organization: office.name,
          organizationBn: office.nameBn,
          posts,
          totalVacancies: posts.reduce((n, p) => n + (p.count ?? 0), 0) || null,
          location: null,
          publishedAt: r.publishedAt,
          applicationStart: ex?.applicationStart ?? null,
          deadline: ex?.deadline ?? null,
          examDate: ex?.examDate ?? null,
          applyUrl: null,
          detailUrl: r.detailUrl,
          circularUrl: pdfUrl,
          salary: posts.find((p) => p.salary)?.salary ?? null,
          ageLimit: posts.find((p) => p.ageLimit)?.ageLimit ?? null,
          applicationFee: ex?.applicationFee ?? null,
          experience: null,
          gender: null,
          bscEligible: eligibility,
          trust: "A1",
          warning: null,
          aiExtracted: ex?.method === "gemini",
          needsReview: kind === "job" && eligibility === "unknown",
          events: [{ type: "notice", title: r.title, date: r.publishedAt, url: pdfUrl ?? r.detailUrl, seenAt: now }],
        });
      }
      return items;
    },
  };
}

export const govPortalSources: Source[] = OFFICES.map(govPortalSource);
