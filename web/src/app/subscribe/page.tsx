"use client";

import { useState } from "react";
import Link from "next/link";
import { SECTIONS } from "@bsc-nursing/shared";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 text-6xl">✅</div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            সাবস্ক্রাইব সফল!
          </h1>
          <p className="mb-6 text-slate-500 dark:text-slate-400">
            আপনার ইমেইলে নতুন চাকরির নোটিফিকেশন পাঠানো হবে। ধন্যবাদ!
          </p>
          <Link
            href="/"
            className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-lg">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan-600">হোম</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100">সাবস্ক্রাইব</span>
        </nav>

        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          নোটিফিকেশন সাবস্ক্রাইব করুন
        </h1>
        <p className="mb-8 text-slate-500 dark:text-slate-400">
          নতুন চাকরি পোস্ট হলে, আবেদনের শেষ তারিখ কাছে আসলে, বা পরীক্ষার
          তারিখ ঠিক হলে আমরা আপনাকে জানাবো। সম্পূর্ণ বিনামূল্যে।
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              ইমেইল ঠিকানা
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-cyan-800"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              কোন ক্যাটাগরির চাকরি চান? (ঐচ্ছিক)
            </p>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => toggleCategory(cat.slug)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    selectedCategories.includes(cat.slug)
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {cat.nameBn}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              কোন নোটিফিকেশন চান?
            </p>
            {[
              { id: "new_jobs", label: "নতুন চাকরি পোস্ট হলে" },
              { id: "deadline", label: "আবেদনের শেষ তারিখ ৩ দিন আগে" },
              { id: "exam", label: "পরীক্ষার তারিখ ৩ দিন আগে" },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-600 py-3 text-sm font-semibold text-white shadow transition hover:bg-cyan-700"
          >
            সাবস্ক্রাইব করুন — বিনামূল্যে
          </button>
        </form>
      </div>
    </div>
  );
}
