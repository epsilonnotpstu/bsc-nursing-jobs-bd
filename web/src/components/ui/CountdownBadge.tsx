"use client";

import { useEffect, useState } from "react";
import { daysLeft, daysLeftLabel, daysLeftColor } from "@/lib/utils";

export default function CountdownBadge({ date }: { date: string | null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  const days = daysLeft(date);
  const label = daysLeftLabel(days);
  const color = daysLeftColor(days);

  return (
    <span className={`text-sm font-semibold ${color}`}>
      {label}
    </span>
  );
}
