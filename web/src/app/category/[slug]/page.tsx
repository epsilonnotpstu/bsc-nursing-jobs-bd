import { SECTION_BY_SLUG, SECTIONS, type SectionSlug } from "@bsc-nursing/shared";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OpportunityExplorer from "@/components/opportunity/OpportunityExplorer";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { getBySection, toRows } from "@/lib/data";

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const section = SECTION_BY_SLUG[slug as SectionSlug];
  return section ? { title: section.nameBn, description: `${section.nameBn} — BSc নার্সদের সুযোগ, শেষ তারিখ ও আবেদনের লিংক।` } : {};
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const section = SECTION_BY_SLUG[slug as SectionSlug];
  if (!section) notFound();
  const items = getBySection(section.slug);

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan-600">হোম</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100">{section.nameBn}</span>
        </nav>
        <h1 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <CategoryIcon icon={section.icon} size="text-3xl" />
          {section.nameBn}
        </h1>
        <OpportunityExplorer rows={toRows(items)} showSection={false} emptyText="এই সেকশনে এই মুহূর্তে কোনো সক্রিয় সুযোগ নেই। এজেন্ট প্রতি ৪ ঘণ্টায় নতুন করে খোঁজে।" />
      </div>
    </div>
  );
}
