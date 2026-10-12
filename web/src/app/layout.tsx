import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "নার্সিং জবস BD — বাংলাদেশের সকল নার্সিং চাকরির খবর",
    template: "%s | নার্সিং জবস BD",
  },
  description:
    "বাংলাদেশের সকল BSc নার্সিং চাকরির সার্কুলার এক জায়গায়। সরকারি, বেসরকারি, হাসপাতাল, ডায়াগনস্টিক সেন্টার, শিক্ষক নিয়োগ, স্কলারশিপ — সব তথ্য স্বয়ংক্রিয়ভাবে আপডেট হয়।",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
