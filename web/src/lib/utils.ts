const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const BANGLA_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
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

export function daysLeft(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function daysLeftLabel(days: number | null): string {
  if (days === null) return "তারিখ অজানা";
  if (days < 0) return "মেয়াদ শেষ";
  if (days === 0) return "আজ শেষ দিন!";
  if (days === 1) return "আগামীকাল শেষ!";
  return `${toBanglaDigits(days)} দিন বাকি`;
}

export function daysLeftColor(days: number | null): string {
  if (days === null) return "text-gray-400";
  if (days < 0) return "text-gray-400";
  if (days <= 3) return "text-red-600";
  if (days <= 7) return "text-orange-500";
  return "text-green-600";
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
