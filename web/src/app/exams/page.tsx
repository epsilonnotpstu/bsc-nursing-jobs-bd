import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import OpportunityExplorer from "@/components/opportunity/OpportunityExplorer";
import { opportunities, toRows } from "@/lib/data";

export const metadata: Metadata = {
  title: "পরীক্ষা, লাইসেন্স ও ফলাফল · Exams & results",
  description: "BNMC লাইসেন্স পরীক্ষা, সরকারি নার্স নিয়োগ পরীক্ষার সূচি, প্রবেশপত্র ও ফলাফল। BNMC licensing, recruitment exams, admit cards and results.",
};

export default function ExamsPage() {
  const items = opportunities
    .filter((o) => o.kind !== "job" || o.examDate)
    .sort((a, b) => (b.publishedAt ?? b.firstSeenAt).localeCompare(a.publishedAt ?? a.firstSeenAt));

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          icon="📋"
          title={{ bn: "পরীক্ষা, লাইসেন্স ও ফলাফল", en: "Exams, licensing & results" }}
          intro={{
            bn: "BNMC, DGNM, BPSC ও হাসপাতালগুলোর পরীক্ষার সূচি, প্রবেশপত্র, ফলাফল, ভর্তি ও প্রশিক্ষণের নোটিশ।",
            en: "Exam schedules, admit cards, results, admissions and training notices from BNMC, DGNM, BPSC and hospitals.",
          }}
        />
        <OpportunityExplorer rows={toRows(items)} />
      </div>
    </div>
  );
}
