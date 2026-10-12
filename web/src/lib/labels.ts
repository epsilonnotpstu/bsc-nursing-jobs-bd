import type { BscEligibility, OpportunityKind, TrustGrade } from "@bsc-nursing/shared";

export const ELIGIBILITY_LABEL: Record<BscEligibility, string> = {
  yes: "BSc গ্রহণযোগ্য",
  diploma_min: "ন্যূনতম ডিপ্লোমা",
  no: "BSc প্রযোজ্য নয়",
  unknown: "যোগ্যতা দেখুন",
};

export const ELIGIBILITY_STYLE: Record<BscEligibility, string> = {
  yes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  diploma_min: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  no: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  unknown: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export const TRUST_LABEL: Record<TrustGrade, string> = {
  A1: "অফিশিয়াল উৎস",
  A2: "অফিশিয়াল উৎস",
  B: "প্রতিষ্ঠানের পোর্টাল",
  C: "জব সাইট",
  D: "যাচাই করুন",
};

export const TRUST_STYLE: Record<TrustGrade, string> = {
  A1: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  A2: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  B: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  C: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  D: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const KIND_LABEL: Record<OpportunityKind, string> = {
  job: "নিয়োগ",
  admit_card: "প্রবেশপত্র",
  exam_schedule: "পরীক্ষার সূচি",
  result: "ফলাফল",
  admission: "ভর্তি",
  training: "প্রশিক্ষণ",
  scholarship: "স্কলারশিপ",
  notice: "নোটিশ",
};

export const EVENT_LABEL: Record<string, string> = {
  circular: "বিজ্ঞপ্তি",
  admit_card: "প্রবেশপত্র",
  exam: "পরীক্ষা",
  written_result: "লিখিত পরীক্ষার ফল",
  viva: "মৌখিক পরীক্ষা",
  final_result: "চূড়ান্ত ফল",
  waiting_list: "অপেক্ষমাণ তালিকা",
  notice: "নোটিশ",
};
