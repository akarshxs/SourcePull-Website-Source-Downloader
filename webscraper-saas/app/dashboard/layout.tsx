import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web CRAWLer — Extraction Console & Telemetry",
  description: "Configure crawl depth and page limits, stream real-time DOM reconstruction, and export full source assets plus DESIGN.md tokens.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
