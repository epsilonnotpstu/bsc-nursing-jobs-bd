const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const BANGLA_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export function toBanglaDigits(num: number | string): string {
  return String(num)
    .split("")
    .map((d) => (/\d/.test(d) ? BANGLA_DIGITS[parseInt(d)] : d))
    .join("");
}

export function formatBanglaDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = toBanglaDigits(date.getDate());
  const month = BANGLA_MONTHS[date.getMonth()];
  const year = toBanglaDigits(date.getFullYear());
  return `${day} ${month} ${year}`;
}

export function formatEnglishDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function daysLeft(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function daysLeftLabel(days: number | null): string {
  if (days === null) return "তারিখ অজানা";
  if (days < 0) return "মেয়াদ শেষ";
  if (days === 0) return "আজ শেষ দিন!";
  if (days === 1) return "আগামীকাল শেষ!";
  return `${toBanglaDigits(days)} দিন বাকি`;
}
