import type { Metadata } from "next";
import Link from "next/link";
import { scholarships } from "@/lib/data";

export const metadata: Metadata = {
  title: "বিদেশে স্কলারশিপ",
  description: "BSc নার্সদের জন্য বিদেশে মাস্টার্স ও পিএইচডি স্কলারশিপ — অফিশিয়াল লিংক, সাধারণ আবেদনের সময় ও বর্তমান অবস্থা।",
};

export default function ScholarshipsPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan-600">হোম</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100">স্কলারশিপ</span>
        </nav>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">🎓 বিদেশে স্কলারশিপ</h1>
        <p className="mb-4 max-w-3xl text-slate-500 dark:text-slate-400">
          শুধু অফিশিয়াল লিংক দেওয়া হলো। আবেদনের সময়কাল আনুমানিক — প্রতি বছর বদলায়, তাই অফিশিয়াল সাইটে নিশ্চিত হোন।
        </p>
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300">
          কোনো স্কলারশিপকে &quot;নার্সিং স্কলারশিপ&quot; ধরার আগে ৪টি বিষয় মিলিয়ে নিন: (১) বাংলাদেশি নাগরিকরা যোগ্য কিনা, (২) ডিগ্রির স্তর ও কতটুকু
          খরচ দেয়, (৩) নির্দিষ্ট বিশ্ববিদ্যালয়ের প্রোগ্রামটি এ বছর আন্তর্জাতিক শিক্ষার্থী নিচ্ছে কিনা, (৪) আপনার BSc নার্সিং সেই
          প্রোগ্রামের শর্ত পূরণ করে কিনা (স্থানীয় নার্স রেজিস্ট্রেশন লাগে কিনা)।
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {scholarships.map((s) => (
            <div key={s.name} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</h2>
                <span className="shrink-0 rounded-full bg-cyan-50 px-2 py-0.5 text-xs text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">{s.country}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{s.level}</p>
              <dl className="mt-3 space-y-1 text-sm">
                <div><dt className="inline text-slate-500">সাধারণ সময়: </dt><dd className="inline text-slate-700 dark:text-slate-300">{s.usualWindow}</dd></div>
                <div><dt className="inline text-slate-500">অবস্থা: </dt><dd className="inline font-medium text-slate-800 dark:text-slate-200">{s.status}</dd></div>
                <div><dt className="inline text-slate-500">নার্সদের জন্য: </dt><dd className="inline text-slate-700 dark:text-slate-300">{s.nursingFit}</dd></div>
                {s.note && <div className="text-xs text-slate-500">{s.note}</div>}
              </dl>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-cyan-700 hover:underline dark:text-cyan-400">
                অফিশিয়াল সাইট →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
