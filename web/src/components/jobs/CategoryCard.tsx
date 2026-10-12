import type { SectionInfo } from "@bsc-nursing/shared";
import Link from "next/link";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { NumT, T } from "@/lib/i18n";

export default function CategoryCard({ section, count }: { section: SectionInfo; count: number }) {
  return (
    <Link
      href={`/category/${section.slug}`}
      className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/60 dark:border-navy-700 dark:bg-navy-800 dark:hover:border-brand-600"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 dark:bg-navy-700">
        <CategoryIcon icon={section.icon} size="text-3xl" />
      </span>
      <h3 className="text-sm font-semibold text-navy-900 group-hover:text-brand-700 dark:text-slate-100">
        <T bn={section.nameBn} en={section.name} />
      </h3>
      <span className="rounded-full bg-brand-50 px-3 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
        <T bn={<><NumT n={count} />টি সক্রিয়</>} en={<>{count} active</>} />
      </span>
    </Link>
  );
}
