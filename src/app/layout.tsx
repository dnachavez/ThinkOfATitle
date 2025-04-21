import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generate creative and professional titles | ThinkOfATitle",
  description:
    "Generate creative and professional titles for your academic papers, dissertations, theses, and research documents",
  keywords: [
    "title generator",
    "academic titles",
    "research paper titles",
    "thesis titles",
    "dissertation titles",
  ],
  authors: [{ name: "dnachavez.dev" }],
  creator: "dnachavez.dev",
  publisher: "dnachavez.dev",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Generate creative and professional titles | ThinkOfATitle",
    description:
      "Generate creative and professional titles for your academic papers, dissertations, theses, and research documents",
    type: "website",
    locale: "en_US",
    siteName: "ThinkOfATitle",
    url: "https://thinkofatitle.dnachavez.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Generate creative and professional titles | ThinkOfATitle",
    description:
      "Generate creative and professional titles for your academic papers, dissertations, theses, and research documents",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
