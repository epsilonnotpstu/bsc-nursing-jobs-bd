// Bdjobs public search API (verified 2026-10-12). `isPro=0` is required or `data` is empty.

import { getJson, sleep } from "../lib/http";
import { bscEligibility, classifyPrivateSection, cleanText, dhakaDate, isNursingText, parseDate } from "../lib/text";
import type { ScrapedItem } from "../lib/store";
import type { Source } from "./types";

const API = "https://api.bdjobs.com/Jobs/api/JobSearch/GetJobSearch";
const KEYWORDS = ["nurse", "nursing", "midwife", "নার্স", "নার্সিং"];

interface BdjobsJob {
  Jobid: string;
  jobTitle: string;
  JobTitleBng: string | null;
  companyName: string;
  deadline: string;
  publishDate: string;
  eduRec: string | null;
  experience: string | null;
  location: string;
  Salary: string | null;
  Vacancies?: string | number | null;
}

interface BdjobsResponse {
  data: BdjobsJob[];
  premiumData: BdjobsJob[];
  common: { totalpages: number };
}

function vacancies(v: BdjobsJob["Vacancies"]): number | null {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function gender(title: string): "male" | "female" | null {
  if (/\bmale\b|brother|পুরুষ/i.test(title) && !/female/i.test(title)) return "male";
  if (/female|sister|মহিলা/i.test(title)) return "female";
  return null;
}

export const bdjobs: Source = {
  id: "bdjobs",
  name: "Bdjobs",
  async run({ log }) {
    const jobs = new Map<string, BdjobsJob>();
    for (const keyword of KEYWORDS) {
      for (let pg = 1; pg <= 10; pg++) {
        const url = `${API}?${new URLSearchParams({ keyword, pg: String(pg), rpp: "50", isPro: "0" })}`;
        const res = await getJson<BdjobsResponse>(url);
        for (const j of [...res.data, ...res.premiumData]) jobs.set(j.Jobid, j);
        if (pg >= res.common.totalpages || res.data.length === 0) break;
        await sleep(800);
      }
    }
    log(`bdjobs: ${jobs.size} keyword hits`);

    const items: ScrapedItem[] = [];
    for (const j of jobs.values()) {
      const title = cleanText(j.jobTitle);
      if (!isNursingText(`${title} ${j.JobTitleBng ?? ""}`)) continue;
      const company = cleanText(j.companyName);
      const location = cleanText(j.location);
      const qualification = cleanText(j.eduRec);
      const eligibility = bscEligibility(qualification, title);
      const personal = /^posted by/i.test(company);
      const careRole = /care\s*giver|care worker|nursing assistant/i.test(title);
      const salary = j.Salary && j.Salary !== "--" ? cleanText(j.Salary) : null;
      const detailUrl = `https://bdjobs.com/h/details/${j.Jobid}`;
      items.push({
        sourceId: "bdjobs",
        sourceKey: j.Jobid,
        kind: "job",
        section: classifyPrivateSection(title, company, location),
        title,
        titleBn: j.JobTitleBng && j.JobTitleBng !== j.jobTitle ? cleanText(j.JobTitleBng) : null,
        organization: company,
        organizationBn: null,
        posts: [
          {
            name: title,
            count: vacancies(j.Vacancies),
            qualification: qualification || null,
            bscEligible: eligibility,
            salary,
            ageLimit: null,
          },
        ],
        totalVacancies: vacancies(j.Vacancies),
        location,
        publishedAt: dhakaDate(j.publishDate),
        applicationStart: dhakaDate(j.publishDate),
        deadline: parseDate(j.deadline),
        examDate: null,
        applyUrl: detailUrl,
        detailUrl,
        circularUrl: null,
        salary,
        ageLimit: null,
        applicationFee: null,
        experience: j.experience ? cleanText(j.experience) : null,
        gender: gender(title),
        bscEligible: eligibility,
        trust: personal ? "D" : "C",
        warning: personal
          ? "ব্যক্তিগত/বেনামি পোস্ট — প্রতিষ্ঠানের পরিচয় যাচাই করে আবেদন করুন"
          : careRole
            ? "কেয়ার-ওয়ার্কার পদ — এটি রেজিস্টার্ড নার্স পদ নয়"
            : null,
        aiExtracted: false,
        needsReview: eligibility === "unknown",
        events: [],
      });
    }
    return items;
  },
};
