import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { scholarships } from "@/lib/data";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "বিদেশে স্কলারশিপ · Scholarships abroad",
  description: "BSc নার্সদের জন্য বিদেশে মাস্টার্স ও পিএইচডি স্কলারশিপ। Master's and PhD scholarships abroad for BSc nurses — official links and usual timelines.",
};

export default function ScholarshipsPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          icon="🎓"
          title={{ bn: "বিদেশে স্কলারশিপ", en: "Scholarships abroad" }}
          intro={{
            bn: "শুধু অফিশিয়াল লিংক দেওয়া হলো। আবেদনের সময়কাল আনুমানিক — প্রতি বছর বদলায়, তাই অফিশিয়াল সাইটে নিশ্চিত হোন।",
            en: "Official links only. Timelines are approximate and change every year — confirm on the official site.",
          }}
        />
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
          <T
            bn="কোনো স্কলারশিপকে “নার্সিং স্কলারশিপ” ধরার আগে ৪টি বিষয় মিলিয়ে নিন: (১) বাংলাদেশি নাগরিকরা যোগ্য কিনা, (২) ডিগ্রির স্তর ও কতটুকু খরচ দেয়, (৩) নির্দিষ্ট বিশ্ববিদ্যালয়ের প্রোগ্রামটি এ বছর আন্তর্জাতিক শিক্ষার্থী নিচ্ছে কিনা, (৪) আপনার BSc নার্সিং সেই প্রোগ্রামের শর্ত পূরণ করে কিনা (স্থানীয় নার্স রেজিস্ট্রেশন লাগে কিনা)।"
            en="Before treating a scholarship as a “nursing scholarship”, check four things: (1) Bangladeshi citizens are eligible, (2) degree level and what it funds, (3) the specific university programme accepts international students this year, (4) your BSc Nursing meets its entry rules (including any local nurse registration)."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {scholarships.map((s) => (
            <div key={s.name} className="rounded-xl border border-t-4 border-slate-200 border-t-navy-700 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-navy-900 dark:text-white">{s.name}</h2>
                <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  <T bn={s.country.bn} en={s.country.en} />
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                <T bn={s.level.bn} en={s.level.en} />
              </p>
              <dl className="mt-3 space-y-1 text-sm">
                <div>
                  <dt className="inline text-slate-500"><T bn="সাধারণ সময়: " en="Usual window: " /></dt>
                  <dd className="inline text-slate-700 dark:text-slate-300"><T bn={s.usualWindow.bn} en={s.usualWindow.en} /></dd>
                </div>
                <div>
                  <dt className="inline text-slate-500"><T bn="অবস্থা: " en="Status: " /></dt>
                  <dd className="inline font-medium text-navy-900 dark:text-slate-200"><T bn={s.status.bn} en={s.status.en} /></dd>
                </div>
                <div>
                  <dt className="inline text-slate-500"><T bn="নার্সদের জন্য: " en="For nurses: " /></dt>
                  <dd className="inline text-slate-700 dark:text-slate-300"><T bn={s.nursingFit.bn} en={s.nursingFit.en} /></dd>
                </div>
                {s.note && <div className="text-xs text-slate-500">{s.note}</div>}
              </dl>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">
                <T bn="অফিশিয়াল সাইট →" en="Official site →" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
