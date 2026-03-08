import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SourcePull — Website Source Downloader",
  description: "Crawl any public website and download its complete source code — HTML, CSS, JS, images, fonts, and API endpoints — as a ZIP archive.",
  keywords: ["web scraper", "source downloader", "site crawler", "OSINT", "website ripper", "html downloader"],
  authors: [{ name: "Akarsh", url: "https://github.com/akarshxs" }],
  openGraph: {
    title: "SourcePull — Website Source Downloader",
    description: "Crawl any public website. Download everything. ZIP ready in seconds.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800;12..96,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
