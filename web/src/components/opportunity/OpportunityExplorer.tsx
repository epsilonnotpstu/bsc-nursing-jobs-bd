"use client";

import { SECTION_BY_SLUG, SECTIONS, type SectionSlug } from "@bsc-nursing/shared";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { OpportunityRow } from "@/lib/data";
import { DateT, NumT, T, type Bi } from "@/lib/i18n";
import { ELIGIBILITY_LABEL, ELIGIBILITY_STYLE, KIND_LABEL, TRUST_LABEL, TRUST_STYLE } from "@/lib/labels";
import { useLang } from "@/lib/useLang";
import { cn } from "@/lib/utils";
import DaysLeft from "./DaysLeft";

interface Props {
  rows: OpportunityRow[];
  /** Show the section column + section filter (off on a single-section page). */
  showSection?: boolean;
  emptyText?: Bi;
}

const DEFAULT_EMPTY: Bi = { bn: "এই মুহূর্তে কোনো সুযোগ পাওয়া যায়নি", en: "Nothing found right now" };

export default function OpportunityExplorer({ rows, showSection = true, emptyText = DEFAULT_EMPTY }: Props) {
  const lang = useLang();
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
  const title = (r: OpportunityRow) => (lang === "bn" && r.titleBn && r.kind !== "job" ? r.titleBn : r.title);
  const org = (r: OpportunityRow) => (lang === "bn" ? (r.organizationBn ?? r.organization) : r.organization);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-brand-100 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center dark:border-navy-700 dark:bg-navy-800">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === "en" ? "Search post, organization or district…" : "পদ, প্রতিষ্ঠান বা জেলা খুঁজুন…"}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-navy-600"
        />
        {showSection && (
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as SectionSlug | "")}
            className="rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-navy-600 dark:bg-navy-800"
          >
            <option value="">{lang === "en" ? "All sections" : "সব সেকশন"}</option>
            {SECTIONS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {lang === "en" ? s.name : s.nameBn}
              </option>
            ))}
          </select>
        )}
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" className="accent-brand-600" checked={includeDiploma} onChange={(e) => setIncludeDiploma(e.target.checked)} />
          <span>
            <T bn="ন্যূনতম-ডিপ্লোমা চাকরিও দেখাও" en="Include diploma-minimum jobs" /> (<NumT n={diplomaCount} />)
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" className="accent-brand-600" checked={includeExpired} onChange={(e) => setIncludeExpired(e.target.checked)} />
          <T bn="মেয়াদ শেষগুলোও দেখাও" en="Include closed" />
        </label>
      </div>

      <p className="mb-2 text-sm text-slate-500">
        <T bn={<>মোট <NumT n={filtered.length} />টি</>} en={<>{filtered.length} results</>} />
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-navy-700 dark:bg-navy-800">
          <T bn={emptyText.bn} en={emptyText.en} />
        </div>
      ) : (
        <>
          {/* Phones: cards, so deadline and apply button are visible without sideways scrolling. */}
          <ul className="space-y-3 md:hidden">
            {filtered.map((r) => (
              <li
                key={r.id}
                className={cn(
                  "rounded-xl border border-l-4 border-slate-200 border-l-brand-500 bg-white p-4 dark:border-navy-700 dark:bg-navy-800",
                  r.status !== "active" && "opacity-60",
                )}
              >
                <Link href={`/jobs/${r.slug}`} className="font-medium text-navy-900 dark:text-white">
                  {title(r)}
                </Link>
                <div className="text-sm text-slate-500">
                  {org(r)}
                  {r.location && ` · ${r.location}`}
                </div>
                <Tags r={r} />
                {r.warning && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">⚠ {r.warning}</p>}
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div className="text-sm">
                    {r.deadline && (
                      <div>
                        <span className="text-slate-500">
                          <T bn="শেষ: " en="Deadline: " />
                        </span>
                        <DateT date={r.deadline} /> {r.status === "active" && <DaysLeft date={r.deadline} />}
                      </div>
                    )}
                    {r.examDate && (
                      <div>
                        <span className="text-slate-500">
                          <T bn="পরীক্ষা: " en="Exam: " />
                        </span>
                        <DateT date={r.examDate} /> <DaysLeft date={r.examDate} />
                      </div>
                    )}
                  </div>
                  <Actions r={r} compact />
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block dark:border-navy-700 dark:bg-navy-800">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="bg-navy-800 text-white">
                  <th className="px-3 py-3 font-medium"><T bn="পদ / বিষয়" en="Post / subject" /></th>
                  <th className="px-3 py-3 font-medium"><T bn="প্রতিষ্ঠান" en="Organization" /></th>
                  {showSection && <th className="px-3 py-3 font-medium"><T bn="সেকশন" en="Section" /></th>}
                  <th className="px-3 py-3 font-medium"><T bn="পদ" en="Posts" /></th>
                  <th className="px-3 py-3 font-medium"><T bn="আবেদনের শেষ তারিখ" en="Apply by" /></th>
                  <th className="px-3 py-3 font-medium"><T bn="পরীক্ষা" en="Exam" /></th>
                  <th className="px-3 py-3 font-medium"><T bn="লিংক" en="Links" /></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-b border-slate-100 align-top even:bg-brand-50/40 hover:bg-brand-50 dark:border-navy-700 dark:even:bg-navy-900/30 dark:hover:bg-navy-700/40",
                      r.status !== "active" && "opacity-60",
                    )}
                  >
                    <td className="px-3 py-3">
                      <Link href={`/jobs/${r.slug}`} className="font-medium text-navy-900 hover:text-brand-700 dark:text-white">
                        {title(r)}
                      </Link>
                      <Tags r={r} />
                      {r.warning && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">⚠ {r.warning}</p>}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      {org(r)}
                      {r.location && <div className="text-xs text-slate-400">{r.location}</div>}
                    </td>
                    {showSection && (
                      <td className="px-3 py-3 text-xs text-slate-500">
                        <T bn={SECTION_BY_SLUG[r.section].nameBn} en={SECTION_BY_SLUG[r.section].name} />
                      </td>
                    )}
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{r.totalVacancies ? <NumT n={r.totalVacancies} /> : "—"}</td>
                    <td className="px-3 py-3">
                      <div className="text-slate-700 dark:text-slate-200">{r.deadline ? <DateT date={r.deadline} /> : "—"}</div>
                      {r.status === "active" && <DaysLeft date={r.deadline} />}
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-slate-700 dark:text-slate-200">{r.examDate ? <DateT date={r.examDate} /> : "—"}</div>
                      {r.examDate && <DaysLeft date={r.examDate} />}
                    </td>
                    <td className="px-3 py-3">
                      <Actions r={r} />
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

const bi = (b: Bi) => <T bn={b.bn} en={b.en} />;

function Tags({ r }: { r: OpportunityRow }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {r.kind !== "job" && <Tag className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">{bi(KIND_LABEL[r.kind])}</Tag>}
      {r.kind === "job" && <Tag className={ELIGIBILITY_STYLE[r.bscEligible]}>{bi(ELIGIBILITY_LABEL[r.bscEligible])}</Tag>}
      <Tag className={TRUST_STYLE[r.trust]}>{bi(TRUST_LABEL[r.trust])}</Tag>
      {r.gender === "male" && <Tag className="bg-slate-100 text-slate-600">{bi({ bn: "শুধু পুরুষ", en: "Male only" })}</Tag>}
      {r.gender === "female" && <Tag className="bg-slate-100 text-slate-600">{bi({ bn: "শুধু মহিলা", en: "Female only" })}</Tag>}
      {r.status === "expired" && <Tag className="bg-slate-200 text-slate-600">{bi({ bn: "মেয়াদ শেষ", en: "Closed" })}</Tag>}
    </div>
  );
}

function Actions({ r, compact }: { r: OpportunityRow; compact?: boolean }) {
  return (
    <div className={cn("flex gap-1", compact ? "shrink-0 flex-row" : "flex-col")}>
      {r.applyUrl && r.status === "active" && (
        <a href={r.applyUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-brand-600 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-brand-700">
          <T bn="আবেদন" en="Apply" />
        </a>
      )}
      {r.circularUrl && (
        <a href={r.circularUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-navy-50 px-3 py-1.5 text-center text-xs text-navy-800 hover:bg-navy-100 dark:bg-navy-700 dark:text-white">
          <T bn="সার্কুলার" en="Circular" />
        </a>
      )}
      {!compact && (
        <Link href={`/jobs/${r.slug}`} className="text-center text-xs text-brand-700 hover:underline dark:text-brand-300">
          <T bn="বিস্তারিত" en="Details" />
        </Link>
      )}
    </div>
  );
}
