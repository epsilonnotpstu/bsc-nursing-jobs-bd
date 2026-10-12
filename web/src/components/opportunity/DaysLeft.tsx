"use client";

import { useEffect, useState } from "react";
import { daysLeft, daysLeftColor, daysLeftLabel } from "@/lib/utils";

/** Computed in the browser so prerendered pages never show a stale count. */
export default function DaysLeft({ date, prefix }: { date: string | null; prefix?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!date) return <span className="text-xs text-slate-400">—</span>;
  if (!mounted) return <span className="text-xs text-slate-400">…</span>;
  const days = daysLeft(date);
  return (
    <span className={`text-xs font-semibold ${daysLeftColor(days)}`}>
      {prefix}
      {daysLeftLabel(days)}
    </span>
  );
}
