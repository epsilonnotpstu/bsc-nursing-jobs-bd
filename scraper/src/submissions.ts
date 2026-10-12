// Turns an admin-approved GitHub issue ("Submit a circular" form) into an opportunity.
// Used for circulars seen in Facebook groups and other places that cannot be scraped.
// Usage (GitHub Actions): tsx src/submissions.ts            -> reads $GITHUB_EVENT_PATH
//        (local test)    : tsx src/submissions.ts issue.json

import { readFileSync, writeFileSync } from "node:fs";
import { type GeminiCircular, normalize, PROMPT } from "./extract/circular";
import { geminiJson, type GeminiPart } from "./lib/gemini";
import { getBytes } from "./lib/http";
import { readJson, type ScrapedItem, writeJson } from "./lib/store";
import { classifyPrivateSection, cleanText, isNursingText } from "./lib/text";
import { govtSection } from "./sources/teletalk";

export const SUBMISSIONS_FILE = "submissions.json";

interface Issue {
  number: number;
  html_url: string;
  title: string;
  body: string | null;
}

/** Issue forms render as "### Label\n\nvalue" blocks. */
function formField(body: string, labelStart: string): string | null {
  const m = body.match(new RegExp(`###\\s*${labelStart}[^\\n]*\\n+([\\s\\S]*?)(?=\\n###\\s|$)`));
  const v = m?.[1].trim();
  return v && v !== "_No response_" ? v : null;
}

function imageUrls(text: string): string[] {
  const urls = new Set<string>();
  for (const m of text.matchAll(/!\[[^\]]*\]\((https:\/\/[^)\s]+)\)/g)) urls.add(m[1]);
  for (const m of text.matchAll(/<img[^>]+src="(https:\/\/[^"]+)"/g)) urls.add(m[1]);
  for (const m of text.matchAll(/https:\/\/github\.com\/user-attachments\/assets\/[\w-]+/g)) urls.add(m[0]);
  return [...urls].slice(0, 4);
}

function sniffMime(bytes: Uint8Array): string | null {
  const b = Buffer.from(bytes.subarray(0, 8));
  if (b.toString("hex").startsWith("ffd8ff")) return "image/jpeg";
  if (b.toString("hex").startsWith("89504e47")) return "image/png";
  if (b.toString("ascii", 0, 4) === "RIFF") return "image/webp";
  if (b.toString("ascii", 0, 5) === "%PDF-") return "application/pdf";
  return null;
}

export async function processIssue(issue: Issue, now = new Date().toISOString()): Promise<{ item: ScrapedItem; summary: string }> {
  const body = issue.body ?? "";
  const link = formField(body, "পোস্ট বা সার্কুলারের লিংক");
  const seenAt = formField(body, "কোথায় দেখেছেন");
  const content = formField(body, "সার্কুলারের লেখা বা ছবি") ?? body;

  const parts: GeminiPart[] = [];
  for (const url of imageUrls(content)) {
    try {
      const bytes = await getBytes(url, { timeoutMs: 60_000 });
      const mime = sniffMime(bytes);
      if (mime) parts.push({ inline_data: { mime_type: mime, data: Buffer.from(bytes).toString("base64") } });
    } catch {
      // Unreachable attachment: rely on the pasted text.
    }
  }
  const text = cleanText(content.replace(/!\[[^\]]*\]\([^)]*\)|<img[^>]*>/g, " "));
  parts.push({ text: `${PROMPT}\n\nThe notice was submitted by a user. Pasted text (may be empty):\n${text.slice(0, 8000)}` });

  const ex = normalize(await geminiJson<GeminiCircular>(parts), now, 1);
  const organization = ex.organization ?? "Unknown organization";
  const title = ex.nursePosts.map((p) => p.name).join(", ") || ex.title || cleanText(issue.title.replace(/^\[Circular\]\s*/i, ""));
  const govt = /সরকার|মন্ত্রণালয়|অধিদপ্তর|বাহিনী|কর্তৃপক্ষ|কর্পোরেশন|পরিদপ্তর|government|ministry|directorate|army|navy|air force|authority|\.gov\.bd|\.mil\.bd/i.test(`${organization} ${link ?? ""}`);
  const eligibility = ex.nursePosts.some((p) => p.bscEligible === "yes")
    ? "yes"
    : ex.nursePosts.some((p) => p.bscEligible === "diploma_min")
      ? "diploma_min"
      : ex.nursePosts.length && ex.nursePosts.every((p) => p.bscEligible === "no")
        ? "no"
        : "unknown";

  const item: ScrapedItem = {
    sourceId: "submission",
    sourceKey: String(issue.number),
    kind: ex.noticeType === "admission" ? "admission" : ex.noticeType === "recruitment" || ex.noticeType === "other" ? "job" : "result",
    section: govt ? govtSection(organization) : classifyPrivateSection(title, organization, ""),
    title,
    titleBn: ex.title,
    organization,
    organizationBn: null,
    posts: ex.nursePosts,
    totalVacancies: ex.nursePosts.reduce((n, p) => n + (p.count ?? 0), 0) || null,
    location: null,
    publishedAt: now.slice(0, 10),
    applicationStart: ex.applicationStart,
    deadline: ex.deadline,
    examDate: ex.examDate,
    applyUrl: link,
    detailUrl: link ?? issue.html_url,
    circularUrl: link,
    salary: ex.nursePosts.find((p) => p.salary)?.salary ?? null,
    ageLimit: ex.nursePosts.find((p) => p.ageLimit)?.ageLimit ?? null,
    applicationFee: ex.applicationFee,
    experience: null,
    gender: null,
    bscEligible: eligibility,
    trust: "C",
    warning: `কমিউনিটি থেকে জমা দেওয়া${seenAt ? ` (${seenAt})` : ""} — admin অনুমোদিত, তবু মূল সার্কুলার মিলিয়ে নিন`,
    aiExtracted: true,
    needsReview: eligibility === "unknown",
    events: [{ type: "circular", title: ex.title ?? title, date: now.slice(0, 10), url: link ?? issue.html_url, seenAt: now }],
  };

  const nursing = ex.nursePosts.length > 0 || isNursingText(`${title} ${ex.title ?? ""}`);
  const summary = [
    nursing ? "✅ সাইটে যোগ করা হয়েছে / Added to the site" : "⚠️ AI কোনো নার্স পদ খুঁজে পায়নি — তবু যোগ করা হয়েছে, যাচাই করুন / No nurse post detected — added anyway, please check",
    `- প্রতিষ্ঠান / Organization: ${organization}`,
    `- পদ / Posts: ${ex.nursePosts.map((p) => `${p.name}${p.count ? ` (${p.count})` : ""}`).join("; ") || "—"}`,
    `- শেষ তারিখ / Deadline: ${ex.deadline ?? "—"}`,
    `- পরীক্ষা / Exam: ${ex.examDate ?? "—"}`,
    `- BSc: ${eligibility}`,
    `- সেকশন / Section: ${item.section}`,
  ].join("\n");
  return { item, summary };
}

async function main() {
  const eventFile = process.argv[2] ?? process.env.GITHUB_EVENT_PATH;
  if (!eventFile) throw new Error("No issue event: pass a JSON file or set GITHUB_EVENT_PATH");
  const event = JSON.parse(readFileSync(eventFile, "utf8"));
  const issue: Issue = event.issue ?? event;
  const { item, summary } = await processIssue(issue);

  const list = readJson<ScrapedItem[]>(SUBMISSIONS_FILE, []).filter((s) => s.sourceKey !== item.sourceKey);
  list.push(item);
  writeJson(SUBMISSIONS_FILE, list);
  writeFileSync(process.env.SUMMARY_FILE ?? "submission-summary.md", summary + "\n");
  console.log(summary);
}

if (process.argv[1]?.endsWith("submissions.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
