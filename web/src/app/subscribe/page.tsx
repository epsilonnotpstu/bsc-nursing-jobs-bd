import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "নোটিফিকেশন · Notifications",
  description: "নতুন চাকরি, শেষ তারিখ ও পরীক্ষার নোটিফিকেশন। Alerts for new jobs, deadlines and exams.",
};

const PLANNED = [
  { bn: "আপনার পছন্দের সেকশনে নতুন চাকরি এলে", en: "New jobs in the sections you choose" },
  { bn: "আবেদনের শেষ তারিখের ৭, ৩ ও ১ দিন আগে", en: "7, 3 and 1 days before an application deadline" },
  { bn: "প্রবেশপত্র, পরীক্ষার তারিখ ও ফলাফল প্রকাশ হলে", en: "When admit cards, exam dates and results are published" },
];

export default function SubscribePage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <PageHeader
          icon="🔔"
          title={{ bn: "নোটিফিকেশন", en: "Notifications" }}
          intro={{
            bn: "মোবাইল অ্যাপের পুশ নোটিফিকেশন তৈরি হচ্ছে। চালু হলে এখানে জানানো হবে।",
            en: "Push notifications through the mobile app are being built. This page will say when they go live.",
          }}
        />
        <div className="rounded-xl border border-l-4 border-slate-200 border-l-brand-500 bg-white p-6 dark:border-navy-700 dark:bg-navy-800">
          <h2 className="mb-3 font-semibold text-navy-900 dark:text-white">
            <T bn="যেসব নোটিফিকেশন আসবে" en="What you'll be notified about" />
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {PLANNED.map((p) => (
              <li key={p.en} className="flex gap-2">
                <span className="text-brand-600">✓</span>
                <T bn={p.bn} en={p.en} />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 rounded-xl bg-navy-50 p-5 text-sm text-navy-800 dark:bg-navy-800 dark:text-slate-200">
          <T
            bn={<>ততদিন পর্যন্ত এই সাইটটি বুকমার্ক করে রাখুন — তথ্য প্রতি ৪ ঘণ্টায় আপডেট হয়। <Link href="/jobs" className="font-medium text-brand-700 underline dark:text-brand-300">সব সুযোগ দেখুন →</Link></>}
            en={<>Until then, bookmark this site — it updates every 4 hours. <Link href="/jobs" className="font-medium text-brand-700 underline dark:text-brand-300">See all opportunities →</Link></>}
          />
        </div>
      </div>
    </div>
  );
}
