import { SECTIONS } from "@bsc-nursing/shared";
import Link from "next/link";
import CategoryCard from "@/components/jobs/CategoryCard";
import DaysLeft from "@/components/opportunity/DaysLeft";
import OpportunityExplorer from "@/components/opportunity/OpportunityExplorer";
import { generatedAt, opportunities, sectionCounts, sourceHealth, toRows, toSlug } from "@/lib/data";
import { KIND_LABEL } from "@/lib/labels";
import { formatBanglaDate, toBanglaDigits } from "@/lib/utils";

export default function Home() {
  const counts = sectionCounts();
  const activeJobs = opportunities.filter((o) => o.kind === "job" && o.status === "active");
  // "Closing soon" uses build-time date only to pick candidates; the badge itself is computed client-side.
  const closingSoon = activeJobs.filter((o) => o.deadline).slice(0, 6);
  const updates = opportunities
    .filter((o) => o.kind !== "job")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 8);
  const latestJobs = [...activeJobs].sort((a, b) => b.firstSeenAt.localeCompare(a.firstSeenAt) || (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")).slice(0, 15);
  const okSources = sourceHealth.filter((h) => h.ok).length;

  return (
    <div>
      <section className="bg-gradient-to-br from-cyan-700 via-cyan-600 to-teal-600 px-4 py-14 text-white dark:from-cyan-900 dark:via-cyan-800 dark:to-teal-900">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            BSc নার্সদের সব সুযোগ
            <br />
            <span className="text-cyan-200">এক জায়গায়</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-cyan-100">
            সরকারি ও বেসরকারি চাকরি, পরীক্ষা ও ফলাফল, শিক্ষকতা, NGO, বিদেশে চাকরি ও স্কলারশিপ — একটি এজেন্ট প্রতিদিন
            অফিশিয়াল উৎস থেকে নিজে খুঁজে এনে সাজিয়ে রাখে।
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/jobs" className="rounded-xl bg-white px-8 py-3 text-lg font-semibold text-cyan-700 shadow-lg hover:bg-cyan-50">
              সব সুযোগ দেখুন
            </Link>
            <Link href="/exams" className="rounded-xl border-2 border-white/30 px-8 py-3 text-lg font-semibold text-white hover:bg-white/10">
              পরীক্ষা ও ফলাফল
            </Link>
          </div>
        </div>
      </section>

      <section className="-mt-6 px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "সক্রিয় চাকরি", value: toBanglaDigits(activeJobs.length) },
            { label: "সেকশন", value: toBanglaDigits(SECTIONS.length) },
            { label: "চালু উৎস", value: `${toBanglaDigits(okSources)}/${toBanglaDigits(sourceHealth.length)}` },
            { label: "সর্বশেষ আপডেট", value: generatedAt ? formatBanglaDate(generatedAt) : "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10">
        {closingSoon.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">⏰ শেষ তারিখ ঘনিয়ে আসছে</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {closingSoon.map((o) => (
                <Link key={o.id} href={`/jobs/${toSlug(o.id)}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-800">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{o.title}</div>
                  <div className="text-sm text-slate-500">{o.organizationBn ?? o.organization}</div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{o.deadline ? formatBanglaDate(o.deadline) : ""}</span>
                    <DaysLeft date={o.deadline} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">সেকশন</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SECTIONS.map((s) => (
              <CategoryCard key={s.slug} section={s} count={counts[s.slug] ?? 0} />
            ))}
          </div>
        </section>

        {updates.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">📢 পরীক্ষা, ফলাফল ও নোটিশ</h2>
              <Link href="/exams" className="text-sm text-cyan-700 hover:underline dark:text-cyan-400">সব দেখুন →</Link>
            </div>
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800">
              {updates.map((o) => (
                <li key={o.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link href={`/jobs/${toSlug(o.id)}`} className="text-sm text-slate-800 hover:text-cyan-700 dark:text-slate-200">
                    <span className="mr-2 rounded bg-violet-100 px-1.5 py-0.5 text-[11px] text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">{KIND_LABEL[o.kind]}</span>
                    {o.title}
                  </Link>
                  <span className="shrink-0 text-xs text-slate-500">
                    {o.organizationBn ?? o.organization} · {o.publishedAt ? formatBanglaDate(o.publishedAt) : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">🆕 সর্বশেষ চাকরি</h2>
            <Link href="/jobs" className="text-sm text-cyan-700 hover:underline dark:text-cyan-400">সব দেখুন →</Link>
          </div>
          <OpportunityExplorer rows={toRows(latestJobs)} />
        </section>
      </div>
    </div>
  );
}
