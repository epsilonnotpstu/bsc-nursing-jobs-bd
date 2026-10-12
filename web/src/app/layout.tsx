import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LANG_BOOT_SCRIPT } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "নার্সিং জবস BD · Nursing Jobs BD — BSc নার্সদের সব সুযোগ",
    template: "%s | নার্সিং জবস BD",
  },
  description:
    "BSc নার্সদের চাকরি, পরীক্ষা, ফলাফল ও স্কলারশিপ — অফিশিয়াল উৎস থেকে স্বয়ংক্রিয়ভাবে। Jobs, exams, results and scholarships for BSc nurses in Bangladesh, collected automatically from official sources.",
  keywords: [
    "nursing jobs bangladesh",
    "নার্সিং চাকরি",
    "bsc nursing jobs",
    "dghs nursing",
    "staff nurse job",
    "নার্সিং সার্কুলার",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${hind.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
