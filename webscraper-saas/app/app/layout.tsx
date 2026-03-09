import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SourcePull App — Scraper Dashboard",
  description: "Enter a URL and extract complete website source code in seconds.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
