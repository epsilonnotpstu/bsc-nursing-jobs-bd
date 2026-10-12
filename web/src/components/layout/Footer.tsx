import Link from "next/link";

const CATEGORY_LINKS = [
  { href: "/category/govt-health", label: "সরকারি চাকরি" },
  { href: "/category/clinic", label: "ক্লিনিক ও জেলা হাসপাতাল" },
  { href: "/category/private-hospital", label: "হাসপাতাল" },
  { href: "/category/diagnostic", label: "ডায়াগনস্টিক সেন্টার" },
  { href: "/category/teaching", label: "শিক্ষক নিয়োগ" },
  { href: "/scholarships", label: "স্কলারশিপ" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🏥</span>
              <span className="text-lg font-bold text-cyan-700 dark:text-cyan-400">
                নার্সিং জবস BD
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              বাংলাদেশের সকল নার্সিং চাকরির খবর এক জায়গায়। সরকারি, বেসরকারি,
              হাসপাতাল, স্কলারশিপ — সব তথ্য স্বয়ংক্রিয়ভাবে আপডেট হয়।
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              ক্যাটাগরি
            </h3>
            <ul className="space-y-2">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              গুরুত্বপূর্ণ লিংক
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="text-sm text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">
                  পরীক্ষার প্রস্তুতি
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-sm text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">
                  নোটিফিকেশন সাবস্ক্রাইব
                </Link>
              </li>
              <li>
                <Link href="/sources" className="text-sm text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">
                  তথ্যের উৎস
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">
                  আমাদের সম্পর্কে
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              যোগাযোগ
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              নতুন চাকরির তথ্য বা ভুল সংশোধনের জন্য আমাদের জানান।
            </p>
            <div className="mt-3 flex gap-3">
              <span className="text-xl" title="Facebook">📘</span>
              <span className="text-xl" title="Telegram">📱</span>
              <span className="text-xl" title="WhatsApp">💬</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-400 dark:border-slate-700">
          &copy; 2026 নার্সিং জবস BD। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
