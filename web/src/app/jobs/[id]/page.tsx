import { SECTION_BY_SLUG } from "@bsc-nursing/shared";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DaysLeft from "@/components/opportunity/DaysLeft";
import ShareButtons from "@/components/ui/ShareButtons";
import { getBySlug, opportunities, toSlug } from "@/lib/data";
import { ELIGIBILITY_LABEL, ELIGIBILITY_STYLE, EVENT_LABEL, KIND_LABEL, TRUST_LABEL, TRUST_STYLE } from "@/lib/labels";
import { cn, formatBanglaDate, toBanglaDigits } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bsc-nursing-jobs-bd.vercel.app";

export function generateStaticParams() {
  const params = opportunities.map((o) => ({ id: toSlug(o.id) }));
  return params.length ? params : [{ id: "__none__" }];
}

export async function generateMetadata({ params }: PageProps<"/jobs/[id]">): Promise<Metadata> {
  const o = getBySlug((await params).id);
  if (!o) return {};
  return {
    title: `${o.title} — ${o.organizationBn ?? o.organization}`,
    description: `${o.organizationBn ?? o.organization}: ${o.title}. ${o.deadline ? `আবেদনের শেষ তারিখ ${formatBanglaDate(o.deadline)}।` : ""}`,
  };
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{value}</div>
    </div>
  );
}

export default async function OpportunityPage({ params }: PageProps<"/jobs/[id]">) {
  const { id } = await params;
  const o = getBySlug(id);
  if (!o) notFound();
  const section = SECTION_BY_SLUG[o.section];

  // schema.org JobPosting so Google Jobs can index real job posts.
  const jsonLd =
    o.kind === "job"
      ? {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: o.title,
          datePosted: o.publishedAt ?? o.firstSeenAt.slice(0, 10),
          validThrough: o.deadline ?? undefined,
          hiringOrganization: { "@type": "Organization", name: o.organization },
          jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: o.location ?? undefined, addressCountry: "BD" } },
          description: [o.title, o.organization, ...o.posts.map((p) => `${p.name}: ${p.qualification ?? ""}`)].join(" — "),
          totalJobOpenings: o.totalVacancies ?? undefined,
        }
      : null;

  return (
    <div className="px-4 py-8">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div className="mx-auto max-w-4xl">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan-600">হোম</Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${section.slug}`} className="hover:text-cyan-600">{section.nameBn}</Link>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">{KIND_LABEL[o.kind]}</span>
            {o.kind === "job" && <span className={cn("rounded-full px-2 py-0.5 font-medium", ELIGIBILITY_STYLE[o.bscEligible])}>{ELIGIBILITY_LABEL[o.bscEligible]}</span>}
            <span className={cn("rounded-full px-2 py-0.5 font-medium", TRUST_STYLE[o.trust])}>{TRUST_LABEL[o.trust]}</span>
            {o.status !== "active" && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-600">{o.status === "expired" ? "মেয়াদ শেষ" : "বন্ধ"}</span>}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{o.title}</h1>
          {o.titleBn && o.titleBn !== o.title && <p className="mt-1 text-slate-600 dark:text-slate-400">{o.titleBn}</p>}
          <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">{o.organizationBn ?? o.organization}</p>
          {o.warning && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">⚠ {o.warning}</p>}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="আবেদন শুরু" value={o.applicationStart ? formatBanglaDate(o.applicationStart) : null} />
            <Field
              label="আবেদনের শেষ তারিখ"
              value={o.deadline ? <>{formatBanglaDate(o.deadline)} <br /><DaysLeft date={o.deadline} /></> : null}
            />
            <Field label="পরীক্ষার তারিখ" value={o.examDate ? <>{formatBanglaDate(o.examDate)} <br /><DaysLeft date={o.examDate} /></> : null} />
            <Field label="মোট পদ" value={o.totalVacancies ? toBanglaDigits(o.totalVacancies) : null} />
            <Field label="বেতন" value={o.salary} />
            <Field label="বয়সসীমা" value={o.ageLimit} />
            <Field label="আবেদন ফি" value={o.applicationFee} />
            <Field label="অভিজ্ঞতা" value={o.experience} />
            <Field label="এলাকা" value={o.location} />
            <Field label="প্রকাশ" value={o.publishedAt ? formatBanglaDate(o.publishedAt) : null} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {o.applyUrl && o.status === "active" && (
              <a href={o.applyUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-cyan-600 px-5 py-2.5 font-semibold text-white hover:bg-cyan-700">
                আবেদন করুন →
              </a>
            )}
            {o.circularUrl && (
              <a href={o.circularUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200">
                📄 মূল সার্কুলার / PDF
              </a>
            )}
            {o.detailUrl && (
              <a href={o.detailUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200">
                উৎসে দেখুন
              </a>
            )}
          </div>
        </div>

        {o.posts.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">পদ ও যোগ্যতা</h2>
            <div className="space-y-3">
              {o.posts.map((p, i) => (
                <div key={i} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{p.name}</span>
                    {p.count && <span className="text-sm text-slate-500">({toBanglaDigits(p.count)}টি পদ)</span>}
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", ELIGIBILITY_STYLE[p.bscEligible])}>{ELIGIBILITY_LABEL[p.bscEligible]}</span>
                  </div>
                  {p.qualification && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.qualification}</p>}
                  {(p.salary || p.ageLimit) && (
                    <p className="mt-1 text-xs text-slate-500">
                      {p.salary && <>বেতন: {p.salary} </>}
                      {p.ageLimit && <>· বয়স: {p.ageLimit}</>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {o.events.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">টাইমলাইন</h2>
            <ol className="relative ml-2 border-l border-cyan-200 dark:border-cyan-800">
              {o.events.map((e, i) => (
                <li key={i} className="mb-4 ml-4">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-cyan-500" />
                  <div className="text-xs text-slate-500">
                    {EVENT_LABEL[e.type] ?? e.type} · {e.date ? formatBanglaDate(e.date) : formatBanglaDate(e.seenAt)}
                  </div>
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-700 hover:underline dark:text-cyan-400">{e.title}</a>
                  ) : (
                    <span className="text-sm text-slate-700 dark:text-slate-300">{e.title}</span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-6 space-y-3 text-xs text-slate-500">
          {o.aiExtracted && <p>ℹ️ পদ ও তারিখগুলো AI দিয়ে সার্কুলার থেকে পড়া হয়েছে — আবেদনের আগে মূল সার্কুলার মিলিয়ে নিন।</p>}
          <p>প্রথম দেখা গেছে: {formatBanglaDate(o.firstSeenAt)} · সর্বশেষ যাচাই: {formatBanglaDate(o.lastSeenAt)}</p>
          <ShareButtons title={o.title} url={`${SITE_URL}/jobs/${toSlug(o.id)}`} />
        </div>
      </div>
    </div>
  );
}
