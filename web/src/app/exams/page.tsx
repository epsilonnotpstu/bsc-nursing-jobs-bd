import type { Metadata } from "next";
import Link from "next/link";
import OpportunityExplorer from "@/components/opportunity/OpportunityExplorer";
import { opportunities, toRows } from "@/lib/data";

export const metadata: Metadata = {
  title: "পরীক্ষা, লাইসেন্স ও ফলাফল",
  description: "BNMC লাইসেন্স পরীক্ষা, সরকারি নার্স নিয়োগ পরীক্ষার সূচি, প্রবেশপত্র ও ফলাফল।",
};

export default function ExamsPage() {
  const items = opportunities
    .filter((o) => o.kind !== "job" || o.examDate)
    .sort((a, b) => (b.publishedAt ?? b.firstSeenAt).localeCompare(a.publishedAt ?? a.firstSeenAt));

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan-600">হোম</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100">পরীক্ষা ও ফলাফল</span>
        </nav>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">📋 পরীক্ষা, লাইসেন্স ও ফলাফল</h1>
        <p className="mb-6 max-w-3xl text-slate-500 dark:text-slate-400">
          BNMC, DGNM, BPSC ও হাসপাতালগুলোর পরীক্ষার সূচি, প্রবেশপত্র, ফলাফল, ভর্তি ও প্রশিক্ষণের নোটিশ।
        </p>
        <OpportunityExplorer rows={toRows(items)} />
      </div>
    </div>
  );
}
