// Text rules: nursing relevance, BSc eligibility, dates, section classification.

import type { BscEligibility, SectionSlug } from "@bsc-nursing/shared";

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export function bnToEnDigits(s: string): string {
  return s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

export function cleanText(s: string | null | undefined): string {
  return (s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------- Relevance ----------

/** Title-level signal that the item is a nursing post/notice. */
const NURSING_RE =
  /\bnurs(e|es|ing)\b|\bmidwi(fe|ves|fery)\b|\bBSN\b|নার্স|নার্সিং|মিডওয়াইফ|মিডওয়াইফ|ধাত্রী|সেবিকা|সেবক/i;

/** Titles that contain "nurse"-like words but are not jobs for registered nurses. */
const NOT_NURSING_RE = /\bnursery\b|নার্সারি|নার্সারী|nursing attendant|নার্সিং এ্যাটেনডেন্ট|নার্সিং অ্যাটেনডেন্ট|নার্সিং এটেনডেন্ট/i;

export function isNursingText(s: string): boolean {
  return NURSING_RE.test(s) && !NOT_NURSING_RE.test(s);
}

// ---------- BSc eligibility ----------

const BSC_RE =
  /\bB\.?\s?Sc\.?\b|\bBSN\b|bachelor|বিএসসি|বি\.?\s?এসসি|স্নাতক|post\s*basic|পোস্ট\s*বেসিক|\bM\.?\s?Sc\b.*nurs|MSN/i;
const DIPLOMA_RE = /diploma|ডিপ্লোমা|\bGNM\b/i;
const NURSING_QUAL_RE = /nurs|নার্স/i;
const MIDWIFERY_ONLY_HINT = /midwi|মিডওয়াইফ/i;
const CAREGIVER_RE = /care\s*giver|caregiving|কেয়ার\s*গিভার|\bHSC\b/i;

/**
 * Decide whether a BSc Nursing graduate fits, from a qualification text
 * (bdjobs eduRec, PDF-extracted qualification, etc.).
 */
/** Council names mention "Nursing" but say nothing about the degree. */
const COUNCIL_RE = /(bangladesh\s+)?nursing\s*(and|&)?\s*midwifery\s+council|nursing\s+council|\bBNMC\b|নার্সিং\s*ও\s*মিডওয়াইফারি\s*কাউন্সিল/gi;

export function bscEligibility(qualification: string, title = ""): BscEligibility {
  const q = cleanText(qualification).replace(COUNCIL_RE, " ");
  if (!q) return "unknown";
  const mentionsNursing = NURSING_QUAL_RE.test(q);
  // A nurse title (not a midwife/caregiver title) lets a generic "BSc" count as BSc Nursing.
  const nurseTitle = /nurs|নার্স/i.test(title) && !/care\s*giver|care worker/i.test(title);
  if (BSC_RE.test(q) && (mentionsNursing || nurseTitle)) return "yes";
  if (DIPLOMA_RE.test(q) && mentionsNursing) return "diploma_min";
  if (MIDWIFERY_ONLY_HINT.test(q) || CAREGIVER_RE.test(q)) return "no";
  return "unknown";
}

// ---------- Dates ----------

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

const pad = (n: number) => String(n).padStart(2, "0");

export function isoDate(y: number, m: number, d: number): string | null {
  if (!y || !m || !d || m > 12 || d > 31 || y < 2000 || y > 2100) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** Parse "Nov 10, 2026", "10-Oct-2026", "10/4/2026" (M/D/Y), "2026-10-12", "১২-১০-২০২৬" (D-M-Y). */
export function parseDate(input: string | null | undefined, slashOrder: "MDY" | "DMY" = "MDY"): string | null {
  if (!input) return null;
  const s = bnToEnDigits(input).trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return isoDate(+m[1], +m[2], +m[3]);
  m = s.match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/);
  if (m && MONTHS[m[1].toLowerCase()]) return isoDate(+m[3], MONTHS[m[1].toLowerCase()], +m[2]);
  m = s.match(/(\d{1,2})[\s-]+([A-Za-z]{3})[a-z]*[\s,-]+(\d{4})/);
  if (m && MONTHS[m[2].toLowerCase()]) return isoDate(+m[3], MONTHS[m[2].toLowerCase()], +m[1]);
  m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return slashOrder === "MDY" ? isoDate(+m[3], +m[1], +m[2]) : isoDate(+m[3], +m[2], +m[1]);
  m = s.match(/(\d{1,2})[-.](\d{1,2})[-.](\d{4})/);
  if (m) return isoDate(+m[3], +m[2], +m[1]);
  return null;
}

/** Calendar date in Asia/Dhaka for an ISO timestamp. */
export function dhakaDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(d);
}

export function todayDhaka(): string {
  return dhakaDate(new Date().toISOString())!;
}

// ---------- Section classification (private-market listings) ----------

const MAJOR_HOSPITALS =
  /evercare|square hospital|continental|united hospital|bangladesh specialized|ibn sina|labaid|popular|apollo|imperial|birdem|brb hospital|unico|amz hospital|asgar ali|max hospital|parkview|national heart foundation|green life|medical college/i;
const NGO_RE =
  /brac|msf|medecins|doctors without|friendship|save the children|unicef|unfpa|unhcr|\bwho\b|iom|undp|unv|united nations|icddr|rtm international|partners in health|humanity|handicap|\birc\b|rescue committee|care bangladesh|world vision|plan international|jhpiego|fhi 360|ipas|foundation|samity|samiti|society|ngo|kendra|mission|relief|action against|terre des|concern/i;
const TEACHING_TITLE_RE = /instructor|lecturer|professor|teacher|trainer|tutor|educator|principal|শিক্ষক|প্রভাষক|ইন্সট্রাক্টর/i;
const CORPORATE_RE = /apparel|garment|textile|knit|fashion|epz|limited|ltd|group|industries|pharma|company|factory|tex\b|holdings/i;
const DIAGNOSTIC_RE = /diagnostic|ডায়াগনস্টিক|lab\b|laboratory|imaging|pathology/i;
const CLINIC_RE = /hospital|clinic|nursing home|medical|health ?care|হাসপাতাল|ক্লিনিক|মেডিকেল|specialized|trauma|maternity|chamber|aesthetic|dental|physio/i;
const HOMECARE_RE = /posted by|home ?care|care ?giver|caregiver|হোম কেয়ার/i;

const BD_PLACE_HINT = /bangladesh|dhaka|chattogram|chittagong|sylhet|khulna|rajshahi|barishal|barisal|rangpur|mymensingh|gazipur|narayanganj|cox|anywhere/i;

export const ABROAD_RE =
  /\b(japan|singapore|saudi|ksa|kuwait|qatar|uae|dubai|abu dhabi|oman|bahrain|maldives|uk|united kingdom|england|canada|australia|new zealand|germany|ireland|malaysia|brunei|usa)\b|জাপান|সিঙ্গাপুর|সৌদি|কুয়েত|মালদ্বীপ/i;

export function classifyPrivateSection(title: string, company: string, location: string): SectionSlug {
  const all = `${title} ${company}`;
  if (!BD_PLACE_HINT.test(location) && ABROAD_RE.test(`${location} ${title}`)) return "abroad-jobs";
  if (TEACHING_TITLE_RE.test(title)) return "teaching";
  if (HOMECARE_RE.test(all)) return "homecare-other";
  if (NGO_RE.test(company) && !/hospital|medical college/i.test(company)) return "ngo-un";
  if (MAJOR_HOSPITALS.test(company)) return "private-hospital";
  if (DIAGNOSTIC_RE.test(company) && !/hospital/i.test(company)) return "diagnostic";
  if (CLINIC_RE.test(company)) return "clinic";
  if (CORPORATE_RE.test(company)) return "corporate";
  return "homecare-other";
}
