import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { sourceHealth } from "@/lib/data";
import { DateT, NumT, T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "তথ্যের উৎস · Data sources",
  description: "এজেন্ট কোন কোন অফিশিয়াল উৎস থেকে তথ্য আনে। Which official sources the agent reads and when each last succeeded.",
};

export default function SourcesPage() {
  const sorted = [...sourceHealth].sort((a, b) => Number(a.ok) - Number(b.ok) || a.name.localeCompare(b.name));
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title={{ bn: "তথ্যের উৎস", en: "Data sources" }}
          intro={{
            bn: "এজেন্ট প্রতি ৪ ঘণ্টায় এই উৎসগুলো পড়ে। সরকারি সার্কুলারের PDF AI দিয়ে পড়া হয়, যাতে একাধিক পদের বিজ্ঞপ্তির ভেতরে থাকা নার্স পদও বাদ না পড়ে।",
            en: "The agent reads these sources every 4 hours. Government circular PDFs are read by AI so nurse posts hidden inside multi-post circulars are not missed.",
          }}
        />
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-navy-800 text-white">
                <th className="px-4 py-3 font-medium"><T bn="উৎস" en="Source" /></th>
                <th className="px-4 py-3 font-medium"><T bn="অবস্থা" en="Status" /></th>
                <th className="px-4 py-3 font-medium"><T bn="পাওয়া গেছে" en="Items" /></th>
                <th className="px-4 py-3 font-medium"><T bn="সর্বশেষ সফল" en="Last success" /></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((h) => (
                <tr key={h.sourceId} className="border-b border-slate-100 even:bg-brand-50/40 dark:border-navy-700">
                  <td className="px-4 py-3 text-navy-900 dark:text-slate-200">{h.name}</td>
                  <td className="px-4 py-3">
                    {h.ok ? (
                      <span className="text-brand-700 dark:text-brand-300">✓ <T bn="চালু" en="OK" /></span>
                    ) : (
                      <span className="text-rose-600" title={h.error ?? ""}>✗ <T bn="সমস্যা" en="Failing" /></span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300"><NumT n={h.itemsFound} /></td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{h.lastSuccessAt ? <DateT date={h.lastSuccessAt} /> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
