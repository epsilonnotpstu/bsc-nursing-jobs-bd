"use client";

import Link from "next/link";
import { useState } from "react";
import { T } from "@/lib/i18n";
import { setLang, useLang } from "@/lib/useLang";

const NAV_LINKS = [
  { href: "/", bn: "হোম", en: "Home" },
  { href: "/jobs", bn: "সব সুযোগ", en: "All" },
  { href: "/category/govt-health", bn: "সরকারি", en: "Government" },
  { href: "/category/private-hospital", bn: "হাসপাতাল", en: "Hospitals" },
  { href: "/exams", bn: "পরীক্ষা ও ফল", en: "Exams & Results" },
  { href: "/category/abroad-jobs", bn: "বিদেশে", en: "Abroad" },
  { href: "/scholarships", bn: "স্কলারশিপ", en: "Scholarships" },
];

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <circle cx="16" cy="16" r="15" className="fill-navy-800" />
        <path d="M13 7h6v6h6v6h-6v6h-6v-6H7v-6h6z" className="fill-white" />
        <circle cx="16" cy="16" r="2.6" className="fill-brand-400" />
      </svg>
      <span className="text-lg font-bold text-navy-800 dark:text-white">
        <T bn="নার্সিং জবস BD" en="Nursing Jobs BD" />
      </span>
    </span>
  );
}

function LangSwitch() {
  const lang = useLang();
  return (
    <div className="flex overflow-hidden rounded-full border border-navy-100 text-xs font-semibold dark:border-navy-700" role="group" aria-label="Language">
      {(["bn", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={lang === l ? "bg-navy-800 px-3 py-1.5 text-white" : "px-3 py-1.5 text-navy-700 hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-navy-800"}
        >
          {l === "bn" ? "বাংলা" : "English"}
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur dark:border-navy-800 dark:bg-navy-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-navy-800"
            >
              <T bn={link.bn} en={link.en} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch />
          <Link
            href="/subscribe"
            className="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 lg:block"
          >
            <T bn="নোটিফিকেশন পান" en="Get alerts" />
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-navy-800"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-brand-100 bg-white px-4 pb-4 lg:hidden dark:border-navy-800 dark:bg-navy-900">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-navy-800"
            >
              <T bn={link.bn} en={link.en} />
            </Link>
          ))}
          <Link
            href="/subscribe"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white"
          >
            <T bn="নোটিফিকেশন পান" en="Get alerts" />
          </Link>
        </div>
      )}
    </header>
  );
}
