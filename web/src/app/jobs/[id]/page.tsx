import { SECTION_BY_SLUG } from "@bsc-nursing/shared";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import DaysLeft from "@/components/opportunity/DaysLeft";
import ShareButtons from "@/components/ui/ShareButtons";
import { getBySlug, opportunities, toSlug } from "@/lib/data";
import { DateT, NumT, T, type Bi } from "@/lib/i18n";
import { ELIGIBILITY_LABEL, ELIGIBILITY_STYLE, EVENT_LABEL, KIND_LABEL, TRUST_LABEL, TRUST_STYLE } from "@/lib/labels";
import { cn, formatBanglaDate } from "@/lib/utils";

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
    description: `${o.organization}: ${o.title}. ${o.deadline ? `আবেদনের শেষ তারিখ ${formatBanglaDate(o.deadline)} · Apply by ${o.deadline}.` : ""}`,
  };
}

function Field({ label, children }: { label: Bi; children: React.ReactNode }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="rounded-lg border border-brand-100 bg-brand-50/50 p-3 dark:border-navy-700 dark:bg-navy-900/40">
      <div className="text-xs text-slate-500">
        <T bn={label.bn} en={label.en} />
      </div>
      <div className="mt-0.5 text-sm font-medium text-navy-900 dark:text-slate-100">{children}</div>
    </div>
  );
}

const bi = (b: Bi) => <T bn={b.bn} en={b.en} />;
const btnPrimary = "rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700";
const btnSecondary = "rounded-xl border border-navy-100 px-5 py-2.5 font-medium text-navy-800 hover:bg-navy-50 dark:border-navy-600 dark:text-white dark:hover:bg-navy-800";
const card = "mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-navy-700 dark:bg-navy-800";

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
        <div className="[&_h1]:hidden">
          <PageHeader title={{ bn: o.title, en: o.title }} crumbs={[{ href: `/category/${section.slug}`, label: { bn: section.nameBn, en: section.name } }]} />
        </div>

        <div className="rounded-2xl border border-t-4 border-slate-200 border-t-brand-500 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800">
          <div className="mb-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">{bi(KIND_LABEL[o.kind])}</span>
            {o.kind === "job" && <span className={cn("rounded-full px-2 py-0.5 font-medium", ELIGIBILITY_STYLE[o.bscEligible])}>{bi(ELIGIBILITY_LABEL[o.bscEligible])}</span>}
            <span className={cn("rounded-full px-2 py-0.5 font-medium", TRUST_STYLE[o.trust])}>{bi(TRUST_LABEL[o.trust])}</span>
            {o.status !== "active" && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-600">
                {o.status === "expired" ? bi({ bn: "মেয়াদ শেষ", en: "Closed" }) : bi({ bn: "বন্ধ", en: "No longer listed" })}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">{o.title}</h1>
          {o.titleBn && o.titleBn !== o.title && <p className="mt-1 text-slate-600 dark:text-slate-400">{o.titleBn}</p>}
          <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">
            <T bn={o.organizationBn ?? o.organization} en={o.organization} />
          </p>
          {o.warning && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">⚠ {o.warning}</p>}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label={{ bn: "আবেদন শুরু", en: "Applications open" }}>{o.applicationStart && <DateT date={o.applicationStart} />}</Field>
            <Field label={{ bn: "আবেদনের শেষ তারিখ", en: "Apply by" }}>
              {o.deadline && (
                <>
                  <DateT date={o.deadline} />
                  <br />
                  <DaysLeft date={o.deadline} />
                </>
              )}
            </Field>
            <Field label={{ bn: "পরীক্ষার তারিখ", en: "Exam date" }}>
              {o.examDate && (
                <>
                  <DateT date={o.examDate} />
                  <br />
                  <DaysLeft date={o.examDate} />
                </>
              )}
            </Field>
            <Field label={{ bn: "মোট পদ", en: "Vacancies" }}>{o.totalVacancies && <NumT n={o.totalVacancies} />}</Field>
            <Field label={{ bn: "বেতন", en: "Salary" }}>{o.salary}</Field>
            <Field label={{ bn: "বয়সসীমা", en: "Age limit" }}>{o.ageLimit}</Field>
            <Field label={{ bn: "আবেদন ফি", en: "Application fee" }}>{o.applicationFee}</Field>
            <Field label={{ bn: "অভিজ্ঞতা", en: "Experience" }}>{o.experience}</Field>
            <Field label={{ bn: "এলাকা", en: "Location" }}>{o.location}</Field>
            <Field label={{ bn: "প্রকাশ", en: "Published" }}>{o.publishedAt && <DateT date={o.publishedAt} />}</Field>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {o.applyUrl && o.status === "active" && (
              <a href={o.applyUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                <T bn="আবেদন করুন →" en="Apply →" />
              </a>
            )}
            {o.circularUrl && (
              <a href={o.circularUrl} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                📄 <T bn="মূল সার্কুলার / PDF" en="Original circular / PDF" />
              </a>
            )}
            {o.detailUrl && (
              <a href={o.detailUrl} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                <T bn="উৎসে দেখুন" en="View at source" />
              </a>
            )}
          </div>
        </div>

        {o.posts.length > 0 && (
          <section className={card}>
            <h2 className="mb-3 text-lg font-semibold text-navy-900 dark:text-white">
              <T bn="পদ ও যোগ্যতা" en="Posts & qualifications" />
            </h2>
            <div className="space-y-3">
              {o.posts.map((p, i) => (
                <div key={i} className="rounded-lg border border-slate-100 p-3 dark:border-navy-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-navy-900 dark:text-white">{p.name}</span>
                    {p.count && (
                      <span className="text-sm text-slate-500">
                        (<T bn={<><NumT n={p.count} />টি পদ</>} en={<>{p.count} posts</>} />)
                      </span>
                    )}
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", ELIGIBILITY_STYLE[p.bscEligible])}>{bi(ELIGIBILITY_LABEL[p.bscEligible])}</span>
                  </div>
                  {p.qualification && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.qualification}</p>}
                  {(p.salary || p.ageLimit) && (
                    <p className="mt-1 text-xs text-slate-500">
                      {p.salary && <>{bi({ bn: "বেতন: ", en: "Salary: " })}{p.salary} </>}
                      {p.ageLimit && <>· {bi({ bn: "বয়স: ", en: "Age: " })}{p.ageLimit}</>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {o.events.length > 0 && (
          <section className={card}>
            <h2 className="mb-3 text-lg font-semibold text-navy-900 dark:text-white">
              <T bn="টাইমলাইন" en="Timeline" />
            </h2>
            <ol className="relative ml-2 border-l-2 border-brand-200 dark:border-brand-800">
              {o.events.map((e, i) => (
                <li key={i} className="mb-4 ml-4">
                  <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-brand-500 ring-4 ring-white dark:ring-navy-800" />
                  <div className="text-xs text-slate-500">
                    {EVENT_LABEL[e.type] ? bi(EVENT_LABEL[e.type]) : e.type} · <DateT date={e.date ?? e.seenAt} />
                  </div>
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-700 hover:underline dark:text-brand-300">
                      {e.title}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-700 dark:text-slate-300">{e.title}</span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-6 space-y-3 text-xs text-slate-500">
          {o.aiExtracted && (
            <p>
              ℹ️{" "}
              <T
                bn="পদ ও তারিখগুলো AI দিয়ে সার্কুলার থেকে পড়া হয়েছে — আবেদনের আগে মূল সার্কুলার মিলিয়ে নিন।"
                en="Posts and dates were read from the circular by AI — check the original before applying."
              />
            </p>
          )}
          <p>
            <T bn="প্রথম দেখা গেছে: " en="First seen: " />
            <DateT date={o.firstSeenAt} /> · <T bn="সর্বশেষ যাচাই: " en="Last checked: " />
            <DateT date={o.lastSeenAt} />
          </p>
          <ShareButtons title={o.title} url={`${SITE_URL}/jobs/${toSlug(o.id)}/`} />
        </div>
      </div>
    </div>
  );
}
