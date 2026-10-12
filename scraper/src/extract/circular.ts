// Reads a circular PDF and extracts nursing posts + dates.
// 1) Text PDFs without any nursing keyword are skipped (no AI call).
// 2) Image-only PDFs and text PDFs with a nursing keyword go to Gemini (one call per PDF).
// Results are cached by PDF URL in data/cache/extractions.json so each PDF is read once.

import type { BscEligibility } from "@bsc-nursing/shared";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { geminiJson, hasGeminiKey, pdfPart } from "../lib/gemini";
import { getBytes } from "../lib/http";
import { isPdf, splitPdf } from "../lib/pdf";
import { readJson, writeJson } from "../lib/store";
import { parseDate } from "../lib/text";

export type NoticeType =
  | "recruitment"
  | "admit_card"
  | "exam_schedule"
  | "written_result"
  | "viva"
  | "final_result"
  | "waiting_list"
  | "admission"
  | "training"
  | "other";

export interface ExtractedPost {
  name: string;
  count: number | null;
  qualification: string | null;
  salary: string | null;
  ageLimit: string | null;
  bscEligible: BscEligibility;
}

export interface CircularExtraction {
  /** pending_ai: needs an AI read that has not happened yet (no key or budget used up). */
  status: "nursing" | "not_nursing" | "error" | "pending_ai";
  method: "text_prefilter" | "gemini";
  error?: string;
  attempts: number;
  extractedAt: string;
  title: string | null;
  organization: string | null;
  noticeType: NoticeType;
  nursePosts: ExtractedPost[];
  applicationStart: string | null;
  deadline: string | null;
  examDate: string | null;
  applicationFee: string | null;
}

export type ExtractionCache = Record<string, CircularExtraction>;

const CACHE_FILE = "cache/extractions.json";
const MAX_ATTEMPTS = 3;
/** Inline request limit is ~20MB; stay well under and cap pages for huge scans. */
const MAX_INLINE_BYTES = 12 * 1024 * 1024;

export function loadCache(): ExtractionCache {
  return readJson<ExtractionCache>(CACHE_FILE, {});
}

export function saveCache(cache: ExtractionCache) {
  writeJson(CACHE_FILE, cache);
}

// Unicode + English + legacy Bijoy (SutonnyMJ) spellings: নার্স=bvm©, নার্সিং=bvwm©s, মিডওয়াইফ=wgWIqvBd
const NURSING_PDF_RE = /nurs|midwi|নার্স|মিডওয়াইফ|ধাত্রী|bvm©|bvwm©|wgWIqvBd/i;

async function pdfText(bytes: Uint8Array, maxPages = 10): Promise<string> {
  const doc = await getDocument({ data: bytes.slice(), useSystemFonts: false, verbosity: 0 }).promise;
  let out = "";
  for (let i = 1; i <= Math.min(doc.numPages, maxPages); i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
  }
  await doc.cleanup();
  return out;
}

const PROMPT = `You read Bangladeshi job/exam notices (Bangla or English; may be scanned).
Return ONLY JSON with this shape:
{
 "title": string,                       // notice title, Bangla unicode if the notice is Bangla
 "organization": string,
 "noticeType": "recruitment"|"admit_card"|"exam_schedule"|"written_result"|"viva"|"final_result"|"waiting_list"|"admission"|"training"|"other",
 "nursePosts": [                        // ONLY posts for nurses/nursing (staff nurse, senior staff nurse, nursing officer, nursing instructor/lecturer, nursing supervisor, midwife). Empty array if none.
   {"name": string, "count": number|null, "qualification": string|null, "salary": string|null, "ageLimit": string|null,
    "bscEligible": "yes"|"diploma_min"|"no"|"unknown"}
 ],
 "applicationStart": "YYYY-MM-DD"|null,
 "deadline": "YYYY-MM-DD"|null,         // last date to apply
 "examDate": "YYYY-MM-DD"|null,
 "applicationFee": string|null
}
bscEligible rules: "yes" if BSc/B.Sc in Nursing (or Bachelor in nursing, Post-basic BSc) is accepted; "diploma_min" if the minimum is Diploma in Nursing (BSc not mentioned); "no" if only midwifery/other non-nursing qualification; "unknown" if not stated.
Copy salary/age text as written. Convert Bangla digits in dates to YYYY-MM-DD. Do not guess missing values: use null.`;

interface GeminiCircular {
  title?: string;
  organization?: string;
  noticeType?: NoticeType;
  nursePosts?: Partial<ExtractedPost>[];
  applicationStart?: string | null;
  deadline?: string | null;
  examDate?: string | null;
  applicationFee?: string | null;
}

const NOTICE_TYPES: NoticeType[] = [
  "recruitment", "admit_card", "exam_schedule", "written_result", "viva", "final_result",
  "waiting_list", "admission", "training", "other",
];
const ELIGIBILITY: BscEligibility[] = ["yes", "diploma_min", "no", "unknown"];

/** Reject values the model could not plausibly have read correctly. */
function validDate(s: string | null | undefined): string | null {
  const d = parseDate(s ?? null);
  if (!d) return null;
  const y = +d.slice(0, 4);
  return y >= 2020 && y <= 2035 ? d : null;
}

function validCount(n: unknown): number | null {
  const v = typeof n === "number" ? n : parseInt(String(n ?? ""), 10);
  return Number.isInteger(v) && v > 0 && v < 20000 ? v : null;
}

const str = (s: unknown) => (typeof s === "string" && s.trim() ? s.trim() : null);

function normalize(g: GeminiCircular, now: string, attempts: number): CircularExtraction {
  const nursePosts: ExtractedPost[] = (g.nursePosts ?? [])
    .filter((p) => str(p.name))
    .map((p) => ({
      name: str(p.name)!,
      count: validCount(p.count),
      qualification: str(p.qualification),
      salary: str(p.salary),
      ageLimit: str(p.ageLimit),
      bscEligible: ELIGIBILITY.includes(p.bscEligible as BscEligibility) ? (p.bscEligible as BscEligibility) : "unknown",
    }));
  return {
    status: nursePosts.length ? "nursing" : "not_nursing",
    method: "gemini",
    attempts,
    extractedAt: now,
    title: str(g.title),
    organization: str(g.organization),
    noticeType: NOTICE_TYPES.includes(g.noticeType as NoticeType) ? (g.noticeType as NoticeType) : "other",
    nursePosts,
    applicationStart: validDate(g.applicationStart),
    deadline: validDate(g.deadline),
    examDate: validDate(g.examDate),
    applicationFee: str(g.applicationFee),
  };
}

function emptyResult(status: CircularExtraction["status"], method: CircularExtraction["method"], now: string, attempts: number, error?: string): CircularExtraction {
  return {
    status, method, attempts, extractedAt: now, error,
    title: null, organization: null, noticeType: "other", nursePosts: [],
    applicationStart: null, deadline: null, examDate: null, applicationFee: null,
  };
}

/** Counts Gemini calls in this run so a backlog cannot exhaust the free quota at once. */
export const aiBudget = { remaining: Number(process.env.AI_CALLS_PER_RUN ?? 60) };

/**
 * Extract a circular. `forceAi` skips the text prefilter (used when the listing
 * itself already says it is a nursing notice and we want dates/posts).
 */
export async function extractCircular(
  url: string,
  cache: ExtractionCache,
  now: string,
  opts: { forceAi?: boolean } = {},
): Promise<CircularExtraction | null> {
  const cached = cache[url];
  const aiAvailable = hasGeminiKey() && aiBudget.remaining > 0;
  if (cached?.status === "pending_ai" && !aiAvailable) return null; // don't re-download until AI can run
  if (cached && cached.status !== "error" && cached.status !== "pending_ai") return cached;
  if (cached?.status === "error" && cached.attempts >= MAX_ATTEMPTS) return cached;
  const attempts = (cached?.status === "error" ? cached.attempts : 0) + 1;

  let bytes: Uint8Array;
  try {
    bytes = await getBytes(url, { timeoutMs: 60_000 });
    if (!isPdf(bytes)) throw new Error("not a PDF");
  } catch (err) {
    return (cache[url] = emptyResult("error", "text_prefilter", now, attempts, (err as Error).message));
  }

  if (!opts.forceAi) {
    let text = "";
    try {
      text = await pdfText(bytes);
    } catch {
      // Unreadable text layer: fall through to AI.
    }
    if (text.replace(/\s/g, "").length > 300 && !NURSING_PDF_RE.test(text)) {
      return (cache[url] = emptyResult("not_nursing", "text_prefilter", now, attempts));
    }
  }

  if (!aiAvailable) {
    cache[url] = emptyResult("pending_ai", "gemini", now, 0);
    return null; // try again next run
  }
  aiBudget.remaining--;
  try {
    let payload = bytes;
    if (bytes.length > MAX_INLINE_BYTES) {
      const [firstPages] = await splitPdf(bytes, 6, 6);
      payload = firstPages;
    }
    const g = await geminiJson<GeminiCircular>([pdfPart(payload), { text: PROMPT }]);
    return (cache[url] = normalize(g, now, attempts));
  } catch (err) {
    return (cache[url] = emptyResult("error", "gemini", now, attempts, (err as Error).message.slice(0, 300)));
  }
}
