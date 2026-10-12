import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "রিসোর্স — পরীক্ষার প্রস্তুতি",
  description: "নার্সিং পরীক্ষার প্রশ্নব্যাংক, স্টাডি ম্যাটেরিয়াল, DGHS ও BCS পরীক্ষার প্রস্তুতি।",
};

const RESOURCE_SECTIONS = [
  {
    title: "পরীক্ষার প্রশ্নব্যাংক",
    icon: "📝",
    items: [
      "DGHS সিনিয়র স্টাফ নার্স নিয়োগ পরীক্ষা (২০১৮-২০২৬)",
      "BCS Health Cadre প্রশ্নব্যাংক",
      "নার্সিং কলেজ ভর্তি পরীক্ষার প্রশ্ন",
      "PSC নন-ক্যাডার স্বাস্থ্য পদ পরীক্ষা",
    ],
  },
  {
    title: "স্টাডি ম্যাটেরিয়াল",
    icon: "📚",
    items: [
      "Anatomy & Physiology সংক্ষিপ্ত নোট",
      "Pharmacology গুরুত্বপূর্ণ ওষুধের তালিকা",
      "Nursing Fundamentals MCQ ব্যাংক",
      "Community Health Nursing গাইড",
    ],
  },
  {
    title: "বিদেশে নার্সিং — প্রস্তুতি গাইড",
    icon: "🌍",
    items: [
      "IELTS প্রস্তুতি গাইড (নার্সদের জন্য)",
      "OET (Occupational English Test) টিপস",
      "NCLEX-RN প্রস্তুতি (USA/Canada)",
      "UK NMC রেজিস্ট্রেশন প্রক্রিয়া",
    ],
  },
  {
    title: "ক্যারিয়ার গাইড",
    icon: "💼",
    items: [
      "সরকারি নার্সিং চাকরির আবেদন প্রক্রিয়া",
      "নার্সিং পেশায় বেতন কাঠামো (২০২৬)",
      "MSc in Nursing — কোথায় পড়বেন",
      "নার্সিং গবেষণার সুযোগ",
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan-600">হোম</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100">রিসোর্স</span>
        </nav>

        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          রিসোর্স ও পরীক্ষার প্রস্তুতি
        </h1>
        <p className="mb-8 text-slate-500 dark:text-slate-400">
          নার্সিং পরীক্ষার প্রস্তুতি, প্রশ্নব্যাংক, স্টাডি ম্যাটেরিয়াল ও ক্যারিয়ার গাইড
        </p>

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            ⚠️ এই সেকশনটি শীঘ্রই আপডেট হবে। প্রশ্নব্যাংক ও স্টাডি ম্যাটেরিয়াল যোগ করা হচ্ছে।
            নোটিফিকেশন পেতে{" "}
            <Link href="/subscribe" className="font-medium underline">
              সাবস্ক্রাইব করুন
            </Link>
            ।
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {RESOURCE_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <span className="text-cyan-500">•</span>
                    {item}
                    <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-400 dark:bg-slate-700">
                      শীঘ্রই
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
