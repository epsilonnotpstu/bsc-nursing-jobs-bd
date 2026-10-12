import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import OpportunityExplorer from "@/components/opportunity/OpportunityExplorer";
import { opportunities, toRows } from "@/lib/data";

export const metadata: Metadata = {
  title: "সব সুযোগ · All opportunities",
  description: "BSc নার্সদের জন্য সব চাকরি, পরীক্ষা, ফলাফল ও সুযোগ। All jobs, exams and opportunities for BSc nurses in Bangladesh.",
};

export default function JobsPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title={{ bn: "সব সুযোগ", en: "All opportunities" }}
          intro={{
            bn: "ডিফল্টভাবে শুধু সেই চাকরিগুলো দেখানো হচ্ছে যেখানে BSc নার্সিং স্পষ্টভাবে গ্রহণযোগ্য (বা যোগ্যতা উল্লেখ নেই)। আবেদনের আগে সবসময় মূল সার্কুলার মিলিয়ে নিন।",
            en: "By default only jobs that clearly accept BSc Nursing (or don't state the qualification) are shown. Always check the original circular before applying.",
          }}
        />
        <OpportunityExplorer rows={toRows(opportunities)} />
      </div>
    </div>
  );
}
