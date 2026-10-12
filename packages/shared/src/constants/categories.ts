export const CATEGORIES = [
  {
    name: "Government Nursing Jobs",
    name_bn: "সরকারি নার্সিং চাকরি",
    slug: "government-nursing",
    icon: "building-government",
    sort_order: 1,
  },
  {
    name: "Non-Government Nursing Jobs",
    name_bn: "বেসরকারি নার্সিং চাকরি",
    slug: "non-government-nursing",
    icon: "briefcase",
    sort_order: 2,
  },
  {
    name: "Diagnostic Center",
    name_bn: "ডায়াগনস্টিক সেন্টার",
    slug: "diagnostic-center",
    icon: "microscope",
    sort_order: 3,
  },
  {
    name: "Private Hospital & Medical College",
    name_bn: "বেসরকারি হাসপাতাল ও মেডিকেল কলেজ",
    slug: "private-hospital",
    icon: "hospital",
    sort_order: 4,
  },
  {
    name: "Nursing Teacher Recruitment",
    name_bn: "নার্সিং শিক্ষক নিয়োগ",
    slug: "nursing-teacher",
    icon: "academic-cap",
    sort_order: 5,
  },
  {
    name: "Nursing Scholarship (Abroad)",
    name_bn: "নার্সিং স্কলারশিপ (বিদেশে পড়াশোনা)",
    slug: "scholarship-abroad",
    icon: "globe",
    sort_order: 6,
  },
  {
    name: "NGO Health Services",
    name_bn: "এনজিও স্বাস্থ্যসেবা",
    slug: "ngo-health",
    icon: "heart",
    sort_order: 7,
  },
  {
    name: "Military Nursing",
    name_bn: "সামরিক নার্সিং (CMH, সশস্ত্র বাহিনী)",
    slug: "military-nursing",
    icon: "shield",
    sort_order: 8,
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
