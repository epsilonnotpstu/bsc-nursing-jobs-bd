import { cn } from "@/lib/utils";

const VARIANTS: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  expired: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  result_published: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  urgent: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  new: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

const LABELS: Record<string, string> = {
  active: "সক্রিয়",
  expired: "মেয়াদ শেষ",
  cancelled: "বাতিল",
  result_published: "ফলাফল প্রকাশিত",
  urgent: "জরুরি",
  new: "নতুন",
};

export default function Badge({ variant }: { variant: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant] ?? VARIANTS.active
      )}
    >
      {LABELS[variant] ?? variant}
    </span>
  );
}
