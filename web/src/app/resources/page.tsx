import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { T, type Bi } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "পরীক্ষার প্রস্তুতি · Exam preparation",
  description: "নার্সিং নিয়োগ পরীক্ষার প্রস্তুতি ও ক্যারিয়ার গাইড। Preparation and career guides for nursing exams.",
};

const RESOURCE_SECTIONS: { title: Bi; icon: string; items: Bi[] }[] = [
  {
    title: { bn: "পরীক্ষার প্রশ্নব্যাংক", en: "Question banks" },
    icon: "📝",
    items: [
      { bn: "সিনিয়র স্টাফ নার্স নিয়োগ পরীক্ষা (BPSC/DGNM)", en: "Senior Staff Nurse recruitment exams (BPSC/DGNM)" },
      { bn: "BNMC লাইসেন্স পরীক্ষা", en: "BNMC licensing exam" },
      { bn: "পোস্ট বেসিক ও MSN ভর্তি পরীক্ষা", en: "Post-basic and MSN admission tests" },
    ],
  },
  {
    title: { bn: "স্টাডি ম্যাটেরিয়াল", en: "Study material" },
    icon: "📚",
    items: [
      { bn: "Anatomy & Physiology সংক্ষিপ্ত নোট", en: "Anatomy & Physiology short notes" },
      { bn: "Pharmacology গুরুত্বপূর্ণ ওষুধ", en: "Key Pharmacology drugs" },
      { bn: "Nursing Fundamentals MCQ", en: "Nursing Fundamentals MCQs" },
    ],
  },
  {
    title: { bn: "বিদেশে নার্সিং — প্রস্তুতি", en: "Nursing abroad — preparation" },
    icon: "🌍",
    items: [
      { bn: "IELTS / OET (নার্সদের জন্য)", en: "IELTS / OET for nurses" },
      { bn: "UK NMC: CBT ও OSCE", en: "UK NMC: CBT and OSCE" },
      { bn: "মধ্যপ্রাচ্যের লাইসেন্স (Prometric, DataFlow)", en: "Middle East licensing (Prometric, DataFlow)" },
    ],
  },
  {
    title: { bn: "ক্যারিয়ার গাইড", en: "Career guides" },
    icon: "💼",
    items: [
      { bn: "সরকারি নার্সিং চাকরির আবেদন প্রক্রিয়া", en: "How to apply for government nursing jobs" },
      { bn: "নার্সিং শিক্ষক হওয়ার পথ (PGCNET, MSN)", en: "Becoming a nursing teacher (PGCNET, MSN)" },
      { bn: "NGO ও জাতিসংঘে নার্সিং ক্যারিয়ার", en: "Nursing careers in NGOs and the UN" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title={{ bn: "পরীক্ষার প্রস্তুতি ও গাইড", en: "Exam preparation & guides" }}
          intro={{ bn: "এই সেকশনটি তৈরি হচ্ছে — নিচের বিষয়গুলো শিগগিরই যোগ হবে।", en: "This section is being built — the topics below are coming soon." }}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {RESOURCE_SECTIONS.map((section) => (
            <div key={section.title.en} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-navy-700 dark:bg-navy-800">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-navy-900 dark:text-white">
                <span>{section.icon}</span>
                <T bn={section.title.bn} en={section.title.en} />
              </h2>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.en} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="text-brand-500">•</span>
                    <T bn={item.bn} en={item.en} />
                    <span className="ml-auto shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-400 dark:bg-navy-700">
                      <T bn="শীঘ্রই" en="Soon" />
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
