import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে · About",
  description: "নার্সিং জবস BD কীভাবে কাজ করে। How Nursing Jobs BD collects and checks opportunities for BSc nurses.",
};

const FEATURES = [
  {
    icon: "🤖",
    bn: ["স্বয়ংক্রিয় সংগ্রহ", "একটি এজেন্ট প্রতি ৪ ঘণ্টায় সরকারি পোর্টাল, টেলিটক, জব সাইট ও প্রতিষ্ঠানের নোটিশ বোর্ড পড়ে।"],
    en: ["Automatic collection", "An agent reads government portals, Teletalk, job sites and notice boards every 4 hours."],
  },
  {
    icon: "📄",
    bn: ["সার্কুলার পড়া", "সরকারি PDF (বিজয় ফন্ট বা স্ক্যান করা ছবি হলেও) AI দিয়ে পড়ে পদ, যোগ্যতা ও তারিখ বের করা হয়।"],
    en: ["Reading circulars", "Government PDFs — even Bijoy-font or scanned ones — are read by AI to extract posts, eligibility and dates."],
  },
  {
    icon: "🎓",
    bn: ["BSc-কেন্দ্রিক", "যেখানে BSc নার্সিং গ্রহণযোগ্য, সেগুলোই আগে দেখানো হয়; ন্যূনতম-ডিপ্লোমা চাকরি আলাদা চিহ্নিত।"],
    en: ["BSc-focused", "Jobs that accept BSc Nursing come first; diploma-minimum jobs are marked separately."],
  },
  {
    icon: "🛡️",
    bn: ["উৎসের নির্ভরযোগ্যতা", "প্রতিটি তথ্যের পাশে উৎস ও তার গ্রেড থাকে; বেনামি পোস্টে সতর্কবার্তা দেওয়া হয়।"],
    en: ["Source trust", "Every item shows its source and a trust grade; anonymous posts carry a warning."],
  },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <PageHeader title={{ bn: "আমাদের সম্পর্কে", en: "About" }} />
        <div className="space-y-6 text-slate-600 dark:text-slate-300">
          <p className="text-lg leading-relaxed">
            <T
              bn="নার্সিং জবস BD একটি বিনামূল্যের প্ল্যাটফর্ম, যার লক্ষ্য BSc নার্সদের চাকরি, পরীক্ষা, ফলাফল, শিক্ষকতা, NGO, বিদেশে চাকরি ও স্কলারশিপের তথ্য এক জায়গায় আনা।"
              en="Nursing Jobs BD is a free platform that brings jobs, exams, results, teaching posts, NGO roles, jobs abroad and scholarships for BSc nurses into one place."
            />
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.en[0]} className="rounded-xl border border-l-4 border-slate-200 border-l-brand-500 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
                <div className="mb-2 text-2xl">{f.icon}</div>
                <h2 className="font-semibold text-navy-900 dark:text-white">
                  <T bn={f.bn[0]} en={f.en[0]} />
                </h2>
                <p className="mt-1 text-sm">
                  <T bn={f.bn[1]} en={f.en[1]} />
                </p>
              </div>
            ))}
          </div>
          <p>
            <T
              bn={<>কোন কোন উৎস থেকে তথ্য আসে, তা <Link href="/sources" className="text-brand-700 underline">তথ্যের উৎস</Link> পেজে দেখুন। তথ্যে ভুল পেলে বা নতুন উৎস জানাতে চাইলে আমাদের জানান।</>}
              en={<>See the <Link href="/sources" className="text-brand-700 underline">data sources</Link> page for where information comes from. Tell us if you find a mistake or know a source we should add.</>}
            />
          </p>
          <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-900/20 dark:text-rose-200">
            <T
              bn="আবেদনের আগে সবসময় মূল সার্কুলার মিলিয়ে নিন। কেউ টাকার বিনিময়ে চাকরির নিশ্চয়তা দিলে তা প্রতারণা হতে পারে।"
              en="Always check the original circular before applying. Anyone promising a job in exchange for money may be a scam."
            />
          </p>
        </div>
      </div>
    </div>
  );
}
