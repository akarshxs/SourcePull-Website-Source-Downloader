import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web CRAWLer — Website Source Downloader & Design Extractor",
  description: "Crawl any public website and download its complete source code — HTML, CSS, JS, images, fonts, and API endpoints — plus generate implementation-ready DESIGN.md specifications.",
  keywords: ["web crawler", "source downloader", "site crawler", "OSINT", "website ripper", "html downloader", "design system extractor", "design.md"],
  authors: [{ name: "Akarsh", url: "https://github.com/akarshxs" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Web CRAWLer — Website Source Downloader & Design Extractor",
    description: "Crawl any public website. Download complete assets & design specifications. ZIP ready in seconds.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth bg-[#181818]">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#181818] text-white selection:bg-[#da291c] selection:text-white">
        {children}
      </body>
    </html>
  );
}
