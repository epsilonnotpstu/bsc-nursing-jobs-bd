// Career pages of major hospitals (verified 2026-10-12). Each site has its own small parser.
// Most of these hospitals also post on bdjobs; these direct sources give official (A2) links.

import type { OpportunityKind, SectionSlug } from "@bsc-nursing/shared";
import * as cheerio from "cheerio";
import { extractCircular } from "../extract/circular";
import { getText, mapLimit } from "../lib/http";
import type { ScrapedItem } from "../lib/store";
import { bscEligibility, cleanText, isNursingText, parseDate } from "../lib/text";
import type { Source } from "./types";

type Base = Pick<ScrapedItem, "sourceId" | "organization" | "organizationBn" | "section">;

function job(base: Base, f: {
  key: string; title: string; detailUrl: string; applyUrl?: string | null; deadline?: string | null;
  publishedAt?: string | null; qualification?: string | null; location?: string | null; kind?: OpportunityKind;
  section?: SectionSlug; circularUrl?: string | null;
}): ScrapedItem {
  const eligibility = f.qualification ? bscEligibility(f.qualification, f.title) : "unknown";
  const gender = /\bmale only\b/i.test(f.title) ? "male" : /female only/i.test(f.title) ? "female" : null;
  return {
    ...base,
    section: f.section ?? base.section,
    sourceKey: f.key,
    kind: f.kind ?? "job",
    title: f.title,
    titleBn: null,
    posts: [{ name: f.title, count: null, qualification: f.qualification ?? null, bscEligible: eligibility, salary: null, ageLimit: null }],
    totalVacancies: null,
    location: f.location ?? null,
    publishedAt: f.publishedAt ?? null,
    applicationStart: f.publishedAt ?? null,
    deadline: f.deadline ?? null,
    examDate: null,
    applyUrl: f.applyUrl ?? f.detailUrl,
    detailUrl: f.detailUrl,
    circularUrl: f.circularUrl ?? null,
    salary: null,
    ageLimit: null,
    applicationFee: null,
    experience: null,
    gender,
    bscEligible: eligibility,
    trust: "A2",
    warning: null,
    aiExtracted: false,
    needsReview: eligibility === "unknown",
    events: [],
  };
}

/** Text of the "Education"/"Qualification" part of a job detail page. */
function qualificationFrom(text: string): string | null {
  const m = text.match(/(Education|Educational Requirements?|Qualification|Academic)[\s:]*([\s\S]{0,400})/i);
  return m ? cleanText(m[2]) : null;
}

function evercare(city: "dhaka" | "chattogram"): Source {
  const base: Base = {
    sourceId: `evercare-${city}`,
    organization: `Evercare Hospital ${city === "dhaka" ? "Dhaka" : "Chattogram"}`,
    organizationBn: `এভারকেয়ার হাসপাতাল ${city === "dhaka" ? "ঢাকা" : "চট্টগ্রাম"}`,
    section: "private-hospital",
  };
  return {
    id: base.sourceId,
    name: base.organization,
    async run() {
      const listUrl = `https://www.evercarebd.com/en/${city}/careers`;
      const $ = cheerio.load(await getText(listUrl));
      const jobs = new Map<string, string>();
      $(`a[href*="/en/${city}/careers/"]`).each((_, a) => {
        const title = cleanText($(a).text());
        const href = new URL($(a).attr("href")!, listUrl).toString();
        if (title && !/apply now/i.test(title)) jobs.set(href, title);
      });
      const nursing = [...jobs].filter(([, t]) => isNursingText(t));
      return mapLimit(nursing, 2, async ([href, title]) => {
        const text = cleanText(cheerio.load(await getText(href))("main, body").text());
        const deadline = parseDate(text.match(/Deadline\s*:?\s*([A-Za-z0-9 ,/-]{6,20})/i)?.[1]);
        return job(base, { key: href.split("/").pop()!, title, detailUrl: href, deadline, qualification: qualificationFrom(text) });
      });
    },
  };
}

const ibnSina: Source = {
  id: "ibnsina",
  name: "The Ibn Sina Trust (e-Recruitment)",
  async run() {
    const base: Base = { sourceId: "ibnsina", organization: "The Ibn Sina Trust", organizationBn: "ইবনে সিনা ট্রাস্ট", section: "private-hospital" };
    const listUrl = "https://career.ibnsinatrust.com/ist/r/ist/e-recruitment/available-circular";
    // Slow from outside Bangladesh (GitHub runners), so allow more time.
    const $ = cheerio.load(await getText(listUrl, { timeoutMs: 90_000 }));
    const items: ScrapedItem[] = [];
    $("table tr").each((_, tr) => {
      const td = $(tr).find("td");
      if (td.length < 6) return;
      const title = cleanText(td.eq(1).text());
      if (!isNursingText(title)) return;
      const details = td.find('a[href*="job-details"]').attr("href") ?? "";
      const jobId = details.match(/p39_job_id=(\d+)/)?.[1] ?? title;
      items.push(
        job(base, {
          key: jobId,
          title,
          // Detail/apply links carry a session token, so link to the stable circular list.
          detailUrl: listUrl,
          location: cleanText(td.eq(3).text()),
          publishedAt: parseDate(cleanText(td.eq(4).text())),
          deadline: parseDate(cleanText(td.eq(5).text())),
        }),
      );
    });
    return items;
  },
};

const birdem: Source = {
  id: "birdem",
  name: "BIRDEM (Diabetic Association)",
  async run({ cache, now }) {
    const base: Base = { sourceId: "birdem", organization: "BIRDEM General Hospital", organizationBn: "বারডেম জেনারেল হাসপাতাল", section: "private-hospital" };
    const listUrl = "https://www.birdembd.org/career";
    const $ = cheerio.load(await getText(listUrl));
    const notices: { title: string; href: string; published: string | null }[] = [];
    $(".post-title").each((_, el) => {
      const title = cleanText($(el).find("h5").text());
      const href = $(el).find("a[href]").attr("href");
      const published = parseDate(cleanText($(el).parent().find(".post-meta li").eq(1).text()));
      if (title && href) notices.push({ title, href, published });
    });

    const items: ScrapedItem[] = [];
    for (const n of notices.slice(0, 8)) {
      const recruitment = /employment|recruit|vacanc|নিয়োগ/i.test(n.title);
      const nursingTitle = isNursingText(n.title);
      if (!recruitment && !nursingTitle) continue;
      const pdf = cheerio.load(await getText(n.href))("embed[src], iframe[src]").attr("src") ?? null;
      const ex = pdf ? await extractCircular(pdf, cache, now, { forceAi: nursingTitle }) : null;
      // Generic "Employment Notice" circulars are kept only if the PDF has nurse posts.
      if (!nursingTitle && ex?.status !== "nursing") continue;
      const admission = /admission|ভর্তি/i.test(n.title);
      const item = job(base, {
        key: n.href.split("/").pop()!,
        title: ex?.nursePosts.map((p) => p.name).join(", ") || n.title,
        detailUrl: n.href,
        circularUrl: pdf,
        publishedAt: n.published,
        deadline: ex?.deadline ?? null,
        kind: admission ? "admission" : "job",
        section: admission ? "higher-study" : "private-hospital",
      });
      if (ex?.nursePosts.length) {
        item.posts = ex.nursePosts;
        item.bscEligible = ex.nursePosts.some((p) => p.bscEligible === "yes") ? "yes" : ex.nursePosts[0].bscEligible;
        item.totalVacancies = ex.nursePosts.reduce((s, p) => s + (p.count ?? 0), 0) || null;
        item.aiExtracted = true;
        item.needsReview = item.bscEligible === "unknown";
      }
      item.titleBn = n.title;
      item.trust = "A1";
      items.push(item);
    }
    return items;
  },
};

const brb: Source = {
  id: "brb",
  name: "BRB Hospitals",
  async run() {
    const base: Base = { sourceId: "brb", organization: "BRB Hospitals", organizationBn: "বিআরবি হাসপাতাল", section: "private-hospital" };
    const listUrl = "https://brbhospital.com/career";
    const $ = cheerio.load(await getText(listUrl));
    const items: ScrapedItem[] = [];
    $('h3 a[href*="job-apply/"]').each((_, a) => {
      const title = cleanText($(a).text());
      if (!isNursingText(title)) return;
      const href = new URL($(a).attr("href")!, listUrl).toString();
      const block = cleanText($(a).closest(".service-part").text());
      const deadline = parseDate(block.match(/(Deadline|Last Date)[^0-9A-Za-z]*([0-9A-Za-z ,/-]{6,20})/i)?.[2]);
      items.push(job(base, { key: href.split("/").pop()!, title, detailUrl: href, deadline, qualification: qualificationFrom(block) }));
    });
    return items;
  },
};

export const hospitalSources: Source[] = [evercare("dhaka"), evercare("chattogram"), ibnSina, birdem, brb];
