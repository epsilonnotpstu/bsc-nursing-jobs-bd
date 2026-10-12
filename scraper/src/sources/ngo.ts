// NGO / UN / research employers with plain HTML vacancy lists (verified 2026-10-12).
// BRAC and most INGOs also post on bdjobs; UNjobs is behind a Cloudflare bot check, so it is not scraped.

import * as cheerio from "cheerio";
import { getText, mapLimit } from "../lib/http";
import type { ScrapedItem } from "../lib/store";
import { bscEligibility, cleanText, isNursingText, parseDate } from "../lib/text";
import type { Source } from "./types";

interface ListConfig {
  id: string;
  name: string;
  organizationBn: string;
  url: string;
  /** Vacancy detail links look like this. */
  hrefRe: RegExp;
}

const LISTS: ListConfig[] = [
  { id: "icddrb", name: "icddr,b", organizationBn: "আইসিডিডিআর,বি", url: "https://career.icddrb.org/", hrefRe: /vacancy-preview\/\d+/ },
  { id: "unfpa-bd", name: "UNFPA Bangladesh", organizationBn: "ইউএনএফপিএ বাংলাদেশ", url: "https://bangladesh.unfpa.org/en/vacancies", hrefRe: /\/en\/vacancies\/[a-z0-9-]+/ },
  { id: "who-bd", name: "WHO Bangladesh", organizationBn: "বিশ্ব স্বাস্থ্য সংস্থা বাংলাদেশ", url: "https://www.who.int/bangladesh/about-us/employment", hrefRe: /\/bangladesh\/news\/articles-detail\// },
];

const DEADLINE_RE = /(deadline|closing date|last date|apply by|application deadline)[^0-9A-Za-z]{0,20}([0-9]{1,2}[\s/-][A-Za-z0-9]{1,9}[\s/,-]+[0-9]{2,4}|[A-Za-z]{3,9}\.? [0-9]{1,2},? [0-9]{4})/i;

function listSource(cfg: ListConfig): Source {
  return {
    id: cfg.id,
    name: cfg.name,
    async run() {
      const $ = cheerio.load(await getText(cfg.url));
      const links = new Map<string, string>();
      $("a[href]").each((_, a) => {
        const href = $(a).attr("href")!;
        const title = cleanText($(a).text());
        if (cfg.hrefRe.test(href) && title.length > 8 && !/read more/i.test(title)) links.set(new URL(href, cfg.url).toString(), title);
      });
      const nursing = [...links].filter(([, t]) => isNursingText(t));
      return mapLimit(nursing, 2, async ([href, title]): Promise<ScrapedItem> => {
        const text = cleanText(cheerio.load(await getText(href))("main, article, body").first().text());
        const deadline = parseDate(text.match(DEADLINE_RE)?.[2]);
        const qualification = text.match(/(Education|Qualification|Requirements?)[\s:]*([\s\S]{0,400})/i)?.[2] ?? "";
        const eligibility = bscEligibility(qualification, title);
        return {
          sourceId: cfg.id,
          sourceKey: href.split("/").filter(Boolean).pop()!,
          kind: "job",
          section: "ngo-un",
          title,
          titleBn: null,
          organization: cfg.name,
          organizationBn: cfg.organizationBn,
          posts: [{ name: title, count: null, qualification: qualification ? cleanText(qualification).slice(0, 300) : null, bscEligible: eligibility, salary: null, ageLimit: null }],
          totalVacancies: null,
          location: null,
          publishedAt: null,
          applicationStart: null,
          deadline,
          examDate: null,
          applyUrl: href,
          detailUrl: href,
          circularUrl: null,
          salary: null,
          ageLimit: null,
          applicationFee: null,
          experience: null,
          gender: null,
          bscEligible: eligibility,
          trust: "A2",
          warning: null,
          aiExtracted: false,
          needsReview: eligibility === "unknown",
          events: [],
        };
      });
    },
  };
}

export const ngoSources: Source[] = LISTS.map(listSource);
