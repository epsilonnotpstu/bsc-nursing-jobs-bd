import Link from "next/link";
import { Logo } from "@/components/layout/Header";
import { T } from "@/lib/i18n";
import { SUBMIT_URL } from "@/lib/site";

const SECTION_LINKS = [
  { href: "/category/govt-health", bn: "সরকারি চাকরি", en: "Government jobs" },
  { href: "/category/private-hospital", bn: "বড় হাসপাতাল", en: "Major hospitals" },
  { href: "/category/clinic", bn: "ক্লিনিক ও জেলা হাসপাতাল", en: "Clinics & district hospitals" },
  { href: "/category/teaching", bn: "শিক্ষক নিয়োগ", en: "Teaching jobs" },
  { href: "/category/ngo-un", bn: "NGO ও জাতিসংঘ", en: "NGO & UN" },
  { href: "/category/abroad-jobs", bn: "বিদেশে চাকরি", en: "Jobs abroad" },
  { href: "/scholarships", bn: "স্কলারশিপ", en: "Scholarships" },
];

const USEFUL_LINKS = [
  { href: "/exams", bn: "পরীক্ষা ও ফলাফল", en: "Exams & results" },
  { href: "/resources", bn: "পরীক্ষার প্রস্তুতি", en: "Exam preparation" },
  { href: "/subscribe", bn: "নোটিফিকেশন", en: "Notifications" },
  { href: "/sources", bn: "তথ্যের উৎস", en: "Data sources" },
  { href: "/about", bn: "আমাদের সম্পর্কে", en: "About" },
];

const linkClass = "text-sm text-slate-300 hover:text-brand-300";

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 [&_span]:!text-white">
              <Logo />
            </div>
            <p className="text-sm text-slate-400">
              <T
                bn="BSc নার্সদের চাকরি, পরীক্ষা, ফলাফল ও স্কলারশিপ — অফিশিয়াল উৎস থেকে স্বয়ংক্রিয়ভাবে সংগ্রহ করা।"
                en="Jobs, exams, results and scholarships for BSc nurses — collected automatically from official sources."
              />
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              <T bn="সেকশন" en="Sections" />
            </h3>
            <ul className="space-y-2">
              {SECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    <T bn={link.bn} en={link.en} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              <T bn="গুরুত্বপূর্ণ লিংক" en="Useful links" />
            </h3>
            <ul className="space-y-2">
              {USEFUL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    <T bn={link.bn} en={link.en} />
                  </Link>
                </li>
              ))}
              <li>
                <a href={SUBMIT_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <T bn="সার্কুলার জমা দিন" en="Submit a circular" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              <T bn="সতর্কতা" en="Please note" />
            </h3>
            <p className="text-sm text-slate-400">
              <T
                bn="আবেদনের আগে সবসময় মূল সার্কুলার মিলিয়ে নিন। কেউ টাকা চাইলে বা চাকরির নিশ্চয়তা দিলে সতর্ক থাকুন।"
                en="Always check the original circular before applying. Be careful if anyone asks for money or guarantees a job."
              />
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-navy-700 pt-6 text-center text-sm text-slate-400">
          &copy; 2026 <T bn="নার্সিং জবস BD" en="Nursing Jobs BD" />
        </div>
      </div>
    </footer>
  );
}
