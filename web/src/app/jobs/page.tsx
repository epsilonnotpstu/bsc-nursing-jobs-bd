import type { Metadata } from "next";
import Link from "next/link";
import OpportunityExplorer from "@/components/opportunity/OpportunityExplorer";
import { opportunities, toRows } from "@/lib/data";

export const metadata: Metadata = {
  title: "সব সুযোগ",
  description: "BSc নার্সদের জন্য সব চাকরি, পরীক্ষা, ফলাফল ও সুযোগ — শেষ তারিখ, পরীক্ষার তারিখ ও আবেদনের লিংকসহ।",
};

export default function JobsPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan-600">হোম</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100">সব সুযোগ</span>
        </nav>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">সব সুযোগ</h1>
        <p className="mb-6 max-w-3xl text-slate-500 dark:text-slate-400">
          ডিফল্টভাবে শুধু সেই চাকরিগুলো দেখানো হচ্ছে যেখানে BSc নার্সিং স্পষ্টভাবে গ্রহণযোগ্য (বা যোগ্যতা উল্লেখ নেই)। আবেদনের
          আগে সবসময় মূল সার্কুলার মিলিয়ে নিন।
        </p>
        <OpportunityExplorer rows={toRows(opportunities)} />
      </div>
    </div>
  );
}
