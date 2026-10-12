"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/useLang";
import { daysLeft, daysLeftColor, daysLeftLabel, daysLeftLabelEn } from "@/lib/utils";

/** Computed in the browser so prerendered pages never show a stale count. */
export default function DaysLeft({ date }: { date: string | null }) {
  const lang = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!date) return <span className="text-xs text-slate-400">—</span>;
  if (!mounted) return <span className="text-xs text-slate-400">…</span>;
  const days = daysLeft(date);
  return (
    <span className={`text-xs font-semibold ${daysLeftColor(days)}`}>
      {lang === "en" ? daysLeftLabelEn(days) : daysLeftLabel(days)}
    </span>
  );
}
