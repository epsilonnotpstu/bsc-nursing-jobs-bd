import { SECTION_BY_SLUG, SECTIONS, type SectionSlug } from "@bsc-nursing/shared";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OpportunityExplorer from "@/components/opportunity/OpportunityExplorer";
import PageHeader from "@/components/layout/PageHeader";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { getBySection, toRows } from "@/lib/data";

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const section = SECTION_BY_SLUG[slug as SectionSlug];
  return section ? { title: `${section.nameBn} · ${section.name}`, description: `${section.nameBn} — BSc নার্সদের সুযোগ। ${section.name} — opportunities for BSc nurses.` } : {};
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const section = SECTION_BY_SLUG[slug as SectionSlug];
  if (!section) notFound();
  const items = getBySection(section.slug);

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader icon={<CategoryIcon icon={section.icon} size="text-3xl" />} title={{ bn: section.nameBn, en: section.name }} />
        <OpportunityExplorer rows={toRows(items)} showSection={false} emptyText={{ bn: "এই সেকশনে এই মুহূর্তে কোনো সক্রিয় সুযোগ নেই। এজেন্ট প্রতি ৪ ঘণ্টায় নতুন করে খোঁজে।", en: "No active opportunities in this section right now. The agent checks again every 4 hours." }} />
      </div>
    </div>
  );
}
