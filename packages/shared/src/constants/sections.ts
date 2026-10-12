import type { SectionSlug } from "../types/opportunity";

export interface SectionInfo {
  slug: SectionSlug;
  name: string;
  nameBn: string;
  icon: string;
}

/** The 15 sections from FINAL_PLAN.md, in display order. */
export const SECTIONS: SectionInfo[] = [
  { slug: "govt-health", name: "Government (DGNM / BPSC / Health)", nameBn: "সরকারি চাকরি (স্বাস্থ্য)", icon: "building-government" },
  { slug: "govt-other", name: "Other Government & Autonomous", nameBn: "অন্যান্য সরকারি ও স্বায়ত্তশাসিত", icon: "landmark" },
  { slug: "defence", name: "Armed Forces (AFNS / CMH)", nameBn: "সশস্ত্র বাহিনী", icon: "shield" },
  { slug: "private-hospital", name: "Major Private Hospitals & Medical Colleges", nameBn: "বড় প্রাইভেট হাসপাতাল ও মেডিকেল কলেজ", icon: "hospital" },
  { slug: "clinic", name: "District Hospitals & Clinics", nameBn: "জেলা পর্যায়ের হাসপাতাল ও ক্লিনিক", icon: "clinic" },
  { slug: "diagnostic", name: "Diagnostic Centers", nameBn: "ডায়াগনস্টিক সেন্টার", icon: "microscope" },
  { slug: "teaching", name: "Nursing Teaching & Training", nameBn: "নার্সিং শিক্ষক ও প্রশিক্ষক", icon: "school" },
  { slug: "ngo-un", name: "NGO / INGO / UN / Research", nameBn: "NGO / জাতিসংঘ / গবেষণা", icon: "heart-handshake" },
  { slug: "corporate", name: "Factory & Corporate Nurse", nameBn: "কারখানা ও কর্পোরেট নার্স", icon: "factory" },
  { slug: "homecare-other", name: "Home Care & Others", nameBn: "হোম-কেয়ার ও অন্যান্য", icon: "home" },
  { slug: "abroad-jobs", name: "Jobs Abroad (verified)", nameBn: "বিদেশে চাকরি", icon: "plane" },
  { slug: "scholarship", name: "Scholarships Abroad", nameBn: "বিদেশে স্কলারশিপ", icon: "graduation-cap" },
  { slug: "higher-study", name: "Higher Study & Admission (BD)", nameBn: "দেশে উচ্চশিক্ষা ও ভর্তি", icon: "book-open" },
  { slug: "exams-results", name: "Exams, Licensing & Results", nameBn: "পরীক্ষা, লাইসেন্স ও ফলাফল", icon: "clipboard-check" },
  { slug: "special", name: "Special Opportunities & Training", nameBn: "বিশেষ সুযোগ ও প্রশিক্ষণ", icon: "star" },
];

export const SECTION_BY_SLUG: Record<SectionSlug, SectionInfo> = Object.fromEntries(
  SECTIONS.map((s) => [s.slug, s]),
) as Record<SectionSlug, SectionInfo>;
