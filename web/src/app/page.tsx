import { SECTIONS } from "@bsc-nursing/shared";
import Link from "next/link";
import CategoryCard from "@/components/jobs/CategoryCard";
import DaysLeft from "@/components/opportunity/DaysLeft";
import OpportunityExplorer from "@/components/opportunity/OpportunityExplorer";
import { generatedAt, opportunities, sectionCounts, sourceHealth, toRows, toSlug } from "@/lib/data";
import { DateT, NumT, T } from "@/lib/i18n";
import { KIND_LABEL } from "@/lib/labels";
import { SUBMIT_URL } from "@/lib/site";

export default function Home() {
  const counts = sectionCounts();
  const activeJobs = opportunities.filter((o) => o.kind === "job" && o.status === "active");
  // Candidates only; the "days left" badge is computed in the browser.
  const closingSoon = activeJobs.filter((o) => o.deadline).slice(0, 6);
  const updates = opportunities
    .filter((o) => o.kind !== "job")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 8);
  const latestJobs = [...activeJobs]
    .sort((a, b) => b.firstSeenAt.localeCompare(a.firstSeenAt) || (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 15);
  const okSources = sourceHealth.filter((h) => h.ok).length;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 px-4 py-14 text-white">
        {/* Soft medical-cross pattern */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden>
          <defs>
            <pattern id="cross" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M24 16h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cross)" />
        </svg>
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            <T
              bn={<>BSc নার্সদের সব সুযোগ<br /><span className="text-brand-200">এক জায়গায়</span></>}
              en={<>Every opportunity for BSc nurses<br /><span className="text-brand-200">in one place</span></>}
            />
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-200">
            <T
              bn="সরকারি ও বেসরকারি চাকরি, পরীক্ষা ও ফলাফল, শিক্ষকতা, NGO, বিদেশে চাকরি ও স্কলারশিপ — একটি এজেন্ট প্রতিদিন অফিশিয়াল উৎস থেকে নিজে খুঁজে এনে সাজিয়ে রাখে।"
              en="Government and private jobs, exams and results, teaching, NGO, jobs abroad and scholarships — an agent collects them from official sources every day."
            />
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/jobs" className="rounded-xl bg-white px-8 py-3 text-lg font-semibold text-navy-800 shadow-lg hover:bg-brand-50">
              <T bn="সব সুযোগ দেখুন" en="See all opportunities" />
            </Link>
            <Link href="/exams" className="rounded-xl border-2 border-white/30 px-8 py-3 text-lg font-semibold text-white hover:bg-white/10">
              <T bn="পরীক্ষা ও ফলাফল" en="Exams & results" />
            </Link>
          </div>
        </div>
      </section>

      <section className="-mt-6 px-4">
        <div className="relative mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: { bn: "সক্রিয় চাকরি", en: "Active jobs" }, value: <NumT n={activeJobs.length} /> },
            { label: { bn: "সেকশন", en: "Sections" }, value: <NumT n={SECTIONS.length} /> },
            { label: { bn: "চালু উৎস", en: "Sources online" }, value: <><NumT n={okSources} />/<NumT n={sourceHealth.length} /></> },
            { label: { bn: "সর্বশেষ আপডেট", en: "Last updated" }, value: generatedAt ? <DateT date={generatedAt} /> : "—" },
          ].map((s) => (
            <div key={s.label.en} className="rounded-xl border-t-4 border-brand-500 bg-white px-4 py-4 text-center shadow-md dark:bg-navy-800">
              <div className="text-xl font-bold text-navy-800 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500">
                <T bn={s.label.bn} en={s.label.en} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10">
        {closingSoon.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-navy-900 dark:text-white">
              ⏰ <T bn="শেষ তারিখ ঘনিয়ে আসছে" en="Closing soon" />
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {closingSoon.map((o) => (
                <Link
                  key={o.id}
                  href={`/jobs/${toSlug(o.id)}`}
                  className="rounded-xl border border-l-4 border-slate-200 border-l-rose-400 bg-white p-4 hover:shadow-md dark:border-navy-700 dark:bg-navy-800"
                >
                  <div className="font-medium text-navy-900 dark:text-white">{o.title}</div>
                  <div className="text-sm text-slate-500">
                    <T bn={o.organizationBn ?? o.organization} en={o.organization} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">{o.deadline && <DateT date={o.deadline} />}</span>
                    <DaysLeft date={o.deadline} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-bold text-navy-900 dark:text-white">
            <T bn="সেকশন" en="Sections" />
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SECTIONS.map((s) => (
              <CategoryCard key={s.slug} section={s} count={counts[s.slug] ?? 0} />
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-navy-700 dark:bg-navy-800">
          <div>
            <h2 className="font-semibold text-navy-900 dark:text-white">
              <T bn="Facebook গ্রুপে কোনো সার্কুলার দেখেছেন?" en="Seen a circular in a Facebook group?" />
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <T
                bn="লেখা বা ছবি জমা দিন — যাচাইয়ের পর AI পড়ে এখানে যোগ করবে।"
                en="Submit the text or image — after review, AI reads it and adds it here."
              />
            </p>
          </div>
          <a href={SUBMIT_URL} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
            <T bn="সার্কুলার জমা দিন" en="Submit a circular" />
          </a>
        </section>

        {updates.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white">
                📢 <T bn="পরীক্ষা, ফলাফল ও নোটিশ" en="Exams, results & notices" />
              </h2>
              <Link href="/exams" className="text-sm text-brand-700 hover:underline dark:text-brand-300">
                <T bn="সব দেখুন →" en="See all →" />
              </Link>
            </div>
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white dark:divide-navy-700 dark:border-navy-700 dark:bg-navy-800">
              {updates.map((o) => (
                <li key={o.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link href={`/jobs/${toSlug(o.id)}`} className="text-sm text-slate-800 hover:text-brand-700 dark:text-slate-200">
                    <span className="mr-2 rounded bg-violet-100 px-1.5 py-0.5 text-[11px] text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                      <T bn={KIND_LABEL[o.kind].bn} en={KIND_LABEL[o.kind].en} />
                    </span>
                    {o.title}
                  </Link>
                  <span className="shrink-0 text-xs text-slate-500">
                    <T bn={o.organizationBn ?? o.organization} en={o.organization} /> · {o.publishedAt && <DateT date={o.publishedAt} />}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-900 dark:text-white">
              🆕 <T bn="সর্বশেষ চাকরি" en="Latest jobs" />
            </h2>
            <Link href="/jobs" className="text-sm text-brand-700 hover:underline dark:text-brand-300">
              <T bn="সব দেখুন →" en="See all →" />
            </Link>
          </div>
          <OpportunityExplorer rows={toRows(latestJobs)} />
        </section>
      </div>
    </div>
  );
}
