import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "PamukAI — AI-Powered Visual Intelligence",
  description:
    "Upload any image and get instant AI analysis. Decoration, code review, fashion, food, creative — powered by Claude Vision.",
  keywords: [
    "AI",
    "görsel analiz",
    "yapay zeka",
    "image analysis",
    "visual intelligence",
    "Claude Vision",
  ],
  openGraph: {
    title: "PamukAI — AI-Powered Visual Intelligence",
    description: "Upload any image and get instant AI analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
