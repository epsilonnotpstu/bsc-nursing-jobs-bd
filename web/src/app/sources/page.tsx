import type { Metadata } from "next";
import Link from "next/link";
import { sourceHealth } from "@/lib/data";
import { formatBanglaDate, toBanglaDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "তথ্যের উৎস",
  description: "এজেন্ট কোন কোন অফিশিয়াল উৎস থেকে তথ্য আনে এবং প্রতিটি উৎস সর্বশেষ কবে সফলভাবে পড়া হয়েছে।",
};

export default function SourcesPage() {
  const sorted = [...sourceHealth].sort((a, b) => Number(a.ok) - Number(b.ok) || a.name.localeCompare(b.name));
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan-600">হোম</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100">তথ্যের উৎস</span>
        </nav>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">তথ্যের উৎস</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">
          এজেন্ট প্রতি ৪ ঘণ্টায় এই উৎসগুলো পড়ে। সরকারি সার্কুলারের PDF AI দিয়ে পড়া হয়, যাতে একাধিক পদের বিজ্ঞপ্তির ভেতরে থাকা নার্স পদও বাদ না পড়ে।
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                <th className="px-4 py-3 font-medium">উৎস</th>
                <th className="px-4 py-3 font-medium">অবস্থা</th>
                <th className="px-4 py-3 font-medium">পাওয়া গেছে</th>
                <th className="px-4 py-3 font-medium">সর্বশেষ সফল</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((h) => (
                <tr key={h.sourceId} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{h.name}</td>
                  <td className="px-4 py-3">
                    {h.ok ? <span className="text-emerald-600">✓ চালু</span> : <span className="text-red-600" title={h.error ?? ""}>✗ সমস্যা</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{toBanglaDigits(h.itemsFound)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{h.lastSuccessAt ? formatBanglaDate(h.lastSuccessAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
