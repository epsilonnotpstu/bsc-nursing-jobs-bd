import type { SectionInfo } from "@bsc-nursing/shared";
import Link from "next/link";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { toBanglaDigits } from "@/lib/utils";

export default function CategoryCard({ section, count }: { section: SectionInfo; count: number }) {
  return (
    <Link
      href={`/category/${section.slug}`}
      className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition-all hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-600"
    >
      <CategoryIcon icon={section.icon} size="text-3xl" />
      <h3 className="text-sm font-semibold text-slate-800 group-hover:text-cyan-700 dark:text-slate-200">{section.nameBn}</h3>
      <span className="rounded-full bg-cyan-50 px-3 py-0.5 text-xs font-medium text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
        {toBanglaDigits(count)}টি সক্রিয়
      </span>
    </Link>
  );
}
