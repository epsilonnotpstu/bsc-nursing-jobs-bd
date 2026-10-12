// Bilingual rendering that works on a fully static site: both languages are in the HTML,
// and `<html data-lang>` (set before paint from localStorage) hides one via CSS.

import type { ReactNode } from "react";
import { formatBanglaDate, formatEnglishDate, toBanglaDigits } from "./utils";

export type Lang = "bn" | "en";
export type Bi = { bn: string; en: string };

export function T({ bn, en }: { bn: ReactNode; en: ReactNode }) {
  return (
    <>
      <span data-l="bn">{bn}</span>
      <span data-l="en" lang="en">{en}</span>
    </>
  );
}

/** Calendar date in both languages. */
export function DateT({ date }: { date: string }) {
  return <T bn={formatBanglaDate(date)} en={formatEnglishDate(date)} />;
}

/** Number with Bangla digits in Bangla mode. */
export function NumT({ n }: { n: number | string }) {
  return <T bn={toBanglaDigits(n)} en={String(n)} />;
}

/** Runs before first paint (inline in <head>) so the saved language never flashes. */
export const LANG_BOOT_SCRIPT = `try{if(localStorage.getItem("lang")==="en"){document.documentElement.dataset.lang="en";document.documentElement.lang="en"}}catch(e){}`;
