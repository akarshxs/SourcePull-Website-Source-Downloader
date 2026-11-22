"use client";
import Link from "next/link";
import { Terminal, Github, Instagram, ExternalLink } from "lucide-react";

const cols = [
  {
    title: "SYSTEM",
    links: [
      { label: "ENGINE FEATURES",   href: "#features" },
      { label: "DESIGN EXTRACTOR",  href: "#design-extractor" },
      { label: "RECON WORKFLOW",    href: "#how-it-works" },
      { label: "LIVE CONSOLE",      href: "/dashboard" },
    ],
  },
  {
    title: "PROTOCOL",
    links: [
      { label: "DESIGN.MD SPEC",    href: "https://xvelocity.org", ext: true },
      { label: "X VELOCITY SUITE",  href: "https://xvelocity.org", ext: true },
      { label: "GITHUB REPOSITORY", href: "https://github.com/akarshxs", ext: true },
      { label: "TELEGRAM CHANNEL",  href: "https://t.me/+f-9oAHhGc28yZjQ1", ext: true },
    ],
  },
  {
    title: "STANDARDS",
    links: [
      { label: "WCAG AAA COMPLIANCE", href: "/docs" },
      { label: "CLIENT PRIVACY FIRST", href: "/docs" },
      { label: "MIT LICENSE",         href: "https://github.com/akarshxs", ext: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#303030] bg-[#181818] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-8 h-8 rounded-none bg-[#da291c] flex items-center justify-center">
                <span className="font-mono font-black text-white text-[13px]">WC</span>
              </div>
              <span className="font-display font-medium text-[1.05rem] uppercase tracking-[1.4px] text-white">
                WEB <span className="text-[#da291c]">CRAWLER</span>
              </span>
            </Link>
            <p className="text-xs text-[#969696] leading-relaxed mb-6 max-w-[220px]">
              High-performance website crawler, DOM reconstructor, and DESIGN.md specification engine.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Github,    href: "https://github.com/akarshxs",    label: "GitHub" },
                { Icon: Instagram, href: "https://instagram.com/akarshxs", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="w-10 h-10 border border-[#303030] bg-[#202020] flex items-center justify-center text-[#969696] hover:text-white hover:border-[#da291c] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <div className="label-mono mb-5 block text-white font-semibold text-[11px] tracking-[1.2px]">
                {col.title}
              </div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target={l.ext ? "_blank" : undefined}
                      rel={l.ext ? "noopener noreferrer" : undefined}
                      className="text-xs font-mono uppercase tracking-[0.65px] text-[#969696] hover:text-white transition-colors flex items-center gap-1.5 group"
                    >
                      {l.label}
                      {l.ext && <ExternalLink className="w-3 h-3 text-[#666666] group-hover:text-[#da291c] transition-colors" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#666666]">
          <span>
            © 2025 SOURCEPULL. ARCHITECTED BY{" "}
            <a href="https://github.com/akarshxs" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#da291c] transition-colors font-semibold">
              AKARSH TRIPATHI
            </a>{" "}
            // X VELOCITY
          </span>
          <div className="flex items-center gap-2">
            <div className="dot-live" />
            <span className="text-[#969696] uppercase">ALL RECON ENGINES OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
