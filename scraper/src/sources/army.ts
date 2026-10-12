// Bangladesh Army recruitment site (join.army.mil.bd): AFNS nursing-officer commissions are
// published here as DSSC courses. Each circular card lists courses with start/end dates.

import * as cheerio from "cheerio";
import { getText } from "../lib/http";
import type { ScrapedItem } from "../lib/store";
import { cleanText, parseDate } from "../lib/text";
import type { Source } from "./types";

const URL = "https://join.army.mil.bd/";
const NURSING_COURSE_RE = /AFNS|nursing|নার্স/i;

export const army: Source = {
  id: "army",
  name: "বাংলাদেশ সেনাবাহিনী (join.army.mil.bd)",
  async run({ now }) {
    const $ = cheerio.load(await getText(URL));
    const items: ScrapedItem[] = [];
    const seen = new Set<string>();

    $(".card-header h4").each((_, h4) => {
      const circularTitle = cleanText($(h4).text());
      const card = $(h4).closest(".card");
      // The "CURRENT CIRCULARS" wrapper is itself a card containing the real circular cards.
      if (card.find(".card").length > 0) return;
      const publish = parseDate(cleanText(card.find("p:contains('Publish Date')").first().text()));
      const circularUrl = card.find("a[download]").attr("href") ?? null;

      card.find("tr td h6").each((_, h6) => {
        const course = cleanText($(h6).text());
        if (!NURSING_COURSE_RE.test(`${circularTitle} ${course}`) || seen.has(course)) return;
        seen.add(course);
        const cell = $(h6).parent();
        const start = parseDate(cleanText(cell.find(".text-success").text()));
        const end = parseDate(cleanText(cell.find(".text-danger").text()));
        items.push({
          sourceId: "army",
          sourceKey: course.toLowerCase().replace(/\W+/g, "-"),
          kind: "job",
          section: "defence",
          title: course,
          titleBn: null,
          organization: "Bangladesh Army — Armed Forces Nursing Service",
          organizationBn: "বাংলাদেশ সেনাবাহিনী — আর্মড ফোর্সেস নার্সিং সার্ভিস",
          posts: [{ name: course, count: null, qualification: null, salary: null, ageLimit: null, bscEligible: "yes" }],
          totalVacancies: null,
          location: null,
          publishedAt: publish,
          applicationStart: start,
          deadline: end,
          examDate: null,
          applyUrl: "https://join.army.mil.bd/home/page/how-to-apply",
          detailUrl: URL,
          circularUrl,
          salary: null,
          ageLimit: null,
          applicationFee: null,
          experience: null,
          gender: null,
          bscEligible: "yes",
          trust: "A1",
          warning: null,
          aiExtracted: false,
          needsReview: false,
          events: [{ type: "circular", title: circularTitle, date: publish, url: circularUrl, seenAt: now }],
        });
      });
    });
    return items;
  },
};
