import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে",
  description: "নার্সিং জবস BD সম্পর্কে জানুন — বাংলাদেশের প্রথম স্বয়ংক্রিয় নার্সিং চাকরি সংগ্রাহক প্ল্যাটফর্ম।",
};

export default function AboutPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan-600">হোম</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100">আমাদের সম্পর্কে</span>
        </nav>

        <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
          নার্সিং জবস BD সম্পর্কে
        </h1>

        <div className="prose prose-slate max-w-none dark:prose-invert">
          <div className="space-y-6 text-slate-600 dark:text-slate-400">
            <p className="text-lg leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-100">নার্সিং জবস BD</strong> হলো
              বাংলাদেশের প্রথম স্বয়ংক্রিয় নার্সিং চাকরি সংগ্রাহক প্ল্যাটফর্ম। আমাদের
              লক্ষ্য হলো BSc Nursing গ্র্যাজুয়েটদের জন্য সকল চাকরির তথ্য এক জায়গায়
              নিয়ে আসা।
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                আমরা কি করি?
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-xl">🤖</span>
                  <span>
                    <strong>স্বয়ংক্রিয় তথ্য সংগ্রহ:</strong> আমাদের এজেন্ট প্রতি ৬ ঘণ্টায়
                    ১০+ ওয়েবসাইট থেকে নার্সিং চাকরির সার্কুলার খুঁজে আনে।
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">📂</span>
                  <span>
                    <strong>ক্যাটাগরি অনুযায়ী সাজানো:</strong> সরকারি, বেসরকারি, হাসপাতাল,
                    ডায়াগনস্টিক সেন্টার, শিক্ষক নিয়োগ, স্কলারশিপ — সব আলাদা সেকশনে।
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🔔</span>
                  <span>
                    <strong>সময়মতো নোটিফিকেশন:</strong> আবেদনের শেষ তারিখ ও পরীক্ষার তারিখ
                    মনে করিয়ে দেই।
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">💰</span>
                  <span>
                    <strong>সম্পূর্ণ বিনামূল্যে:</strong> কোনো চার্জ নেই। সকল তথ্য সবার
                    জন্য উন্মুক্ত।
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                তথ্যের উৎস
              </h2>
              <p className="mb-3">
                আমরা নিম্নলিখিত উৎস থেকে নার্সিং চাকরির তথ্য সংগ্রহ করি:
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "bdjobs.com",
                  "chakri.com",
                  "bdgovtjob.com",
                  "DGHS (স্বাস্থ্য অধিদপ্তর)",
                  "MOHFW (স্বাস্থ্য মন্ত্রণালয়)",
                  "BPSC (সরকারি কর্মকমিশন)",
                  "teletalk.com.bd",
                  "প্রধান হাসপাতাল ওয়েবসাইট",
                ].map((source) => (
                  <div
                    key={source}
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm dark:bg-slate-700"
                  >
                    <span className="text-cyan-500">✓</span>
                    {source}
                  </div>
                ))}
              </div>
            </div>

            <p>
              তথ্যগত ভুল বা নতুন সোর্স যোগ করতে চাইলে আমাদের জানান। আমরা
              ক্রমাগত প্ল্যাটফর্ম উন্নত করছি।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
