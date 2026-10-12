import type { BscEligibility, OpportunityKind, TrustGrade } from "@bsc-nursing/shared";
import type { Bi } from "./i18n";

export const ELIGIBILITY_LABEL: Record<BscEligibility, Bi> = {
  yes: { bn: "BSc গ্রহণযোগ্য", en: "BSc accepted" },
  diploma_min: { bn: "ন্যূনতম ডিপ্লোমা", en: "Diploma minimum" },
  no: { bn: "BSc প্রযোজ্য নয়", en: "Not for BSc" },
  unknown: { bn: "যোগ্যতা দেখুন", en: "Check eligibility" },
};

export const ELIGIBILITY_STYLE: Record<BscEligibility, string> = {
  yes: "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300",
  diploma_min: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  no: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  unknown: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export const TRUST_LABEL: Record<TrustGrade, Bi> = {
  A1: { bn: "অফিশিয়াল উৎস", en: "Official source" },
  A2: { bn: "অফিশিয়াল উৎস", en: "Official source" },
  B: { bn: "প্রতিষ্ঠানের পোর্টাল", en: "Employer portal" },
  C: { bn: "জব সাইট", en: "Job site" },
  D: { bn: "যাচাই করুন", en: "Verify first" },
};

export const TRUST_STYLE: Record<TrustGrade, string> = {
  A1: "bg-navy-100 text-navy-800 dark:bg-navy-800/50 dark:text-navy-100",
  A2: "bg-navy-100 text-navy-800 dark:bg-navy-800/50 dark:text-navy-100",
  B: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  C: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  D: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export const KIND_LABEL: Record<OpportunityKind, Bi> = {
  job: { bn: "নিয়োগ", en: "Job" },
  admit_card: { bn: "প্রবেশপত্র", en: "Admit card" },
  exam_schedule: { bn: "পরীক্ষার সূচি", en: "Exam schedule" },
  result: { bn: "ফলাফল", en: "Result" },
  admission: { bn: "ভর্তি", en: "Admission" },
  training: { bn: "প্রশিক্ষণ", en: "Training" },
  scholarship: { bn: "স্কলারশিপ", en: "Scholarship" },
  notice: { bn: "নোটিশ", en: "Notice" },
};

export const EVENT_LABEL: Record<string, Bi> = {
  circular: { bn: "বিজ্ঞপ্তি", en: "Circular" },
  admit_card: { bn: "প্রবেশপত্র", en: "Admit card" },
  exam: { bn: "পরীক্ষা", en: "Exam" },
  written_result: { bn: "লিখিত পরীক্ষার ফল", en: "Written result" },
  viva: { bn: "মৌখিক পরীক্ষা", en: "Viva" },
  final_result: { bn: "চূড়ান্ত ফল", en: "Final result" },
  waiting_list: { bn: "অপেক্ষমাণ তালিকা", en: "Waiting list" },
  notice: { bn: "নোটিশ", en: "Notice" },
};
