import Link from "next/link";
import type { ReactNode } from "react";
import { T, type Bi } from "@/lib/i18n";

/** Breadcrumb + bilingual title/intro used at the top of inner pages. */
export default function PageHeader({ title, intro, icon, crumbs = [] }: { title: Bi; intro?: Bi; icon?: ReactNode; crumbs?: { href: string; label: Bi }[] }) {
  return (
    <div className="mb-6">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">
          <T bn="হোম" en="Home" />
        </Link>
        {crumbs.map((c) => (
          <span key={c.href}>
            <span className="mx-2">/</span>
            <Link href={c.href} className="hover:text-brand-600">
              <T bn={c.label.bn} en={c.label.en} />
            </Link>
          </span>
        ))}
        <span className="mx-2">/</span>
        <span className="text-navy-900 dark:text-slate-100">
          <T bn={title.bn} en={title.en} />
        </span>
      </nav>
      <h1 className="flex items-center gap-3 text-2xl font-bold text-navy-900 dark:text-white">
        {icon}
        <span>
          <T bn={title.bn} en={title.en} />
        </span>
      </h1>
      {intro && (
        <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">
          <T bn={intro.bn} en={intro.en} />
        </p>
      )}
    </div>
  );
}
