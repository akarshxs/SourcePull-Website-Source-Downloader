import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "SourcePull Website Source Downloader",
  description: "Instantly crawl, extract, and download complete website source code. Full HTML, CSS, JS, and asset extraction in one click.",
  keywords: ["web scraper", "website downloader", "source code extractor", "web crawler", "OSINT tool"],
  authors: [{ name: "SourcePull" }],
  openGraph: {
    title: "SourcePull Website Source Downloader",
    description: "Crawl any website and download its complete source code as a ZIP package.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,600,700,800,900&f[]=instrument-sans@400,500,600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
