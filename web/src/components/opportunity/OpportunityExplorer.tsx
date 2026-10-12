"use client";

import { SECTIONS, type SectionSlug } from "@bsc-nursing/shared";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { OpportunityRow } from "@/lib/data";
import { ELIGIBILITY_LABEL, ELIGIBILITY_STYLE, KIND_LABEL, TRUST_LABEL, TRUST_STYLE } from "@/lib/labels";
import { cn, formatBanglaDate, toBanglaDigits } from "@/lib/utils";
import DaysLeft from "./DaysLeft";

interface Props {
  rows: OpportunityRow[];
  /** Show the section column + section filter (off on a single-section page). */
  showSection?: boolean;
  emptyText?: string;
}

const SECTION_NAME = Object.fromEntries(SECTIONS.map((s) => [s.slug, s.nameBn])) as Record<SectionSlug, string>;

export default function OpportunityExplorer({ rows, showSection = true, emptyText = "এই মুহূর্তে কোনো সুযোগ পাওয়া যায়নি" }: Props) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<SectionSlug | "">("");
  const [includeDiploma, setIncludeDiploma] = useState(false);
  const [includeExpired, setIncludeExpired] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (!includeExpired && r.status !== "active") return false;
      if (!includeDiploma && r.bscEligible === "diploma_min") return false;
      if (section && r.section !== section) return false;
      if (q) {
        const hay = `${r.title} ${r.titleBn ?? ""} ${r.organization} ${r.organizationBn ?? ""} ${r.location ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, query, section, includeDiploma, includeExpired]);

  const diplomaCount = rows.filter((r) => r.bscEligible === "diploma_min" && r.status === "active").length;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center dark:border-slate-700 dark:bg-slate-800">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="পদ, প্রতিষ্ঠান বা জেলা খুঁজুন…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-slate-600"
        />
        {showSection && (
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as SectionSlug | "")}
            className="rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="">সব সেকশন</option>
            {SECTIONS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.nameBn}
              </option>
            ))}
          </select>
        )}
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={includeDiploma} onChange={(e) => setIncludeDiploma(e.target.checked)} />
          ন্যূনতম-ডিপ্লোমা চাকরিও দেখাও ({toBanglaDigits(diplomaCount)})
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={includeExpired} onChange={(e) => setIncludeExpired(e.target.checked)} />
          মেয়াদ শেষগুলোও দেখাও
        </label>
      </div>

      <p className="mb-2 text-sm text-slate-500">মোট {toBanglaDigits(filtered.length)}টি</p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800">
          {emptyText}
        </div>
      ) : (
        <>
        {/* Phones: cards, so deadline and apply button are visible without sideways scrolling. */}
        <ul className="space-y-3 md:hidden">
          {filtered.map((r) => (
            <li key={r.id} className={cn("rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800", r.status !== "active" && "opacity-60")}>
              <Link href={`/jobs/${r.slug}`} className="font-medium text-slate-900 dark:text-slate-100">
                {r.titleBn && r.kind !== "job" ? r.titleBn : r.title}
              </Link>
              <div className="text-sm text-slate-500">
                {r.organizationBn ?? r.organization}
                {r.location && ` · ${r.location}`}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.kind !== "job" && <Tag className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">{KIND_LABEL[r.kind]}</Tag>}
                {r.kind === "job" && <Tag className={ELIGIBILITY_STYLE[r.bscEligible]}>{ELIGIBILITY_LABEL[r.bscEligible]}</Tag>}
                <Tag className={TRUST_STYLE[r.trust]}>{TRUST_LABEL[r.trust]}</Tag>
                {r.totalVacancies && <Tag className="bg-slate-100 text-slate-600">{toBanglaDigits(r.totalVacancies)}টি পদ</Tag>}
              </div>
              {r.warning && <p className="mt-1 text-xs text-red-600 dark:text-red-400">⚠ {r.warning}</p>}
              <div className="mt-3 flex items-end justify-between gap-2">
                <div className="text-sm">
                  {r.deadline && (
                    <div>
                      <span className="text-slate-500">শেষ: </span>
                      {formatBanglaDate(r.deadline)} {r.status === "active" && <DaysLeft date={r.deadline} />}
                    </div>
                  )}
                  {r.examDate && (
                    <div>
                      <span className="text-slate-500">পরীক্ষা: </span>
                      {formatBanglaDate(r.examDate)} <DaysLeft date={r.examDate} />
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  {r.circularUrl && (
                    <a href={r.circularUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      সার্কুলার
                    </a>
                  )}
                  {r.applyUrl && r.status === "active" && (
                    <a href={r.applyUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white">
                      আবেদন
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                <th className="px-3 py-3 font-medium">পদ / বিষয়</th>
                <th className="px-3 py-3 font-medium">প্রতিষ্ঠান</th>
                {showSection && <th className="px-3 py-3 font-medium">সেকশন</th>}
                <th className="px-3 py-3 font-medium">পদ</th>
                <th className="px-3 py-3 font-medium">আবেদনের শেষ তারিখ</th>
                <th className="px-3 py-3 font-medium">পরীক্ষা</th>
                <th className="px-3 py-3 font-medium">লিংক</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className={cn(
                    "border-b border-slate-100 align-top hover:bg-cyan-50/50 dark:border-slate-700/50 dark:hover:bg-cyan-900/10",
                    r.status !== "active" && "opacity-60",
                  )}
                >
                  <td className="px-3 py-3">
                    <Link href={`/jobs/${r.slug}`} className="font-medium text-slate-900 hover:text-cyan-600 dark:text-slate-100">
                      {r.titleBn && r.kind !== "job" ? r.titleBn : r.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.kind !== "job" && <Tag className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">{KIND_LABEL[r.kind]}</Tag>}
                      {r.kind === "job" && <Tag className={ELIGIBILITY_STYLE[r.bscEligible]}>{ELIGIBILITY_LABEL[r.bscEligible]}</Tag>}
                      <Tag className={TRUST_STYLE[r.trust]}>{TRUST_LABEL[r.trust]}</Tag>
                      {r.gender === "male" && <Tag className="bg-slate-100 text-slate-600">শুধু পুরুষ</Tag>}
                      {r.gender === "female" && <Tag className="bg-slate-100 text-slate-600">শুধু মহিলা</Tag>}
                      {r.status === "expired" && <Tag className="bg-slate-200 text-slate-600">মেয়াদ শেষ</Tag>}
                    </div>
                    {r.warning && <p className="mt-1 text-xs text-red-600 dark:text-red-400">⚠ {r.warning}</p>}
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                    {r.organizationBn ?? r.organization}
                    {r.location && <div className="text-xs text-slate-400">{r.location}</div>}
                  </td>
                  {showSection && <td className="px-3 py-3 text-xs text-slate-500">{SECTION_NAME[r.section]}</td>}
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{r.totalVacancies ? toBanglaDigits(r.totalVacancies) : "—"}</td>
                  <td className="px-3 py-3">
                    <div className="text-slate-700 dark:text-slate-300">{r.deadline ? formatBanglaDate(r.deadline) : "—"}</div>
                    {r.status === "active" && <DaysLeft date={r.deadline} />}
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-slate-700 dark:text-slate-300">{r.examDate ? formatBanglaDate(r.examDate) : "—"}</div>
                    {r.examDate && <DaysLeft date={r.examDate} />}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      {r.applyUrl && r.status === "active" && (
                        <a href={r.applyUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-cyan-600 px-2 py-1 text-center text-xs font-medium text-white hover:bg-cyan-700">
                          আবেদন
                        </a>
                      )}
                      {r.circularUrl && (
                        <a href={r.circularUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-slate-100 px-2 py-1 text-center text-xs text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200">
                          সার্কুলার
                        </a>
                      )}
                      <Link href={`/jobs/${r.slug}`} className="text-center text-xs text-cyan-700 hover:underline dark:text-cyan-400">
                        বিস্তারিত
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", className)}>{children}</span>;
}
