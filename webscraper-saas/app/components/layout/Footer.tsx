"use client";
import Link from "next/link";
import { Terminal, Github, Instagram, ExternalLink } from "lucide-react";

const cols = [
  {
    title:"Product",
    links:[
      { label:"Features",     href:"#features" },
      { label:"How It Works", href:"#how-it-works" },
      { label:"Dashboard",    href:"/dashboard" },
      { label:"Changelog",    href:"/changelog" },
    ],
  },
  {
    title:"Developers",
    links:[
      { label:"Documentation", href:"/docs" },
      { label:"API Reference",  href:"/docs/api" },
      { label:"GitHub",         href:"https://github.com/akarshxs", ext:true },
      { label:"Status",         href:"/status" },
    ],
  },
  {
    title:"Legal",
    links:[
      { label:"Privacy Policy", href:"/privacy" },
      { label:"Terms of Use",   href:"/terms" },
      { label:"Contact",        href:"/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-[#00c9a7]" strokeWidth={1.5} />
              </div>
              <span className="font-display font-black text-[1rem] text-white">
                Source<span className="text-[#00c9a7]">Pull</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed mb-5 max-w-[180px]">
              Extract complete website source code in seconds.
            </p>
            <div className="flex items-center gap-2.5">
              {[
                { Icon:Github,    href:"https://github.com/akarshxs",    label:"GitHub" },
                { Icon:Instagram, href:"https://instagram.com/akarshxs", label:"Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/20 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <div className="label-mono mb-4 block">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-neutral-500 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {l.label}
                      {"ext" in l && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-7" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="mono text-[11px] text-neutral-700">
            © 2025 SourcePull. Built by{" "}
            <a href="https://github.com/akarshxs" className="text-neutral-500 hover:text-white transition-colors">Akarsh</a>
          </span>
          <div className="flex items-center gap-2">
            <div className="dot-live" />
            <span className="mono text-[11px] text-neutral-700">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
