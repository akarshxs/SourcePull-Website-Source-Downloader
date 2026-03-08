"use client";
import { motion } from "framer-motion";
import { Globe, CheckCircle2, XCircle, Clock, Download, BarChart3 } from "lucide-react";
import Link from "next/link";

const mockFiles = [
  { name: "index.html", size: "48 KB", type: "html", status: "ok" },
  { name: "about.html", size: "32 KB", type: "html", status: "ok" },
  { name: "styles/main.css", size: "124 KB", type: "css", status: "ok" },
  { name: "js/app.bundle.js", size: "892 KB", type: "js", status: "ok" },
  { name: "images/hero.webp", size: "286 KB", type: "img", status: "ok" },
  { name: "fonts/inter.woff2", size: "78 KB", type: "font", status: "ok" },
  { name: "api/v1/users", size: "—", type: "api", status: "warn" },
  { name: "docs/404.html", size: "—", type: "html", status: "err" },
];

const typeColors: Record<string, string> = {
  html: "text-blue-400 bg-blue-500/10",
  css: "text-purple-400 bg-purple-500/10",
  js: "text-yellow-400 bg-yellow-500/10",
  img: "text-teal-400 bg-teal-500/10",
  font: "text-pink-400 bg-pink-500/10",
  api: "text-orange-400 bg-orange-500/10",
};

export default function DashboardPreview() {
  return (
    <section className="relative py-28 overflow-hidden" id="dashboard">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mb-6">App Interface</div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
              A scraper dashboard<br />
              <span className="gradient-text">built for clarity</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              See exactly what&apos;s being extracted in real-time. Monitor every page, asset, and API call as the crawler works through the target site.
            </p>

            <div className="space-y-4 mb-10">
              {[
                "Live log stream with color-coded status codes",
                "Per-file download tracking with size and type",
                "One-click ZIP download when complete",
                "Error diagnostics with suggested fixes",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/app" className="btn-primary">
              Open the App
              <Download className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right — UI mockup */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="gradient-border rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
              <div className="bg-[#0a0f1e] rounded-2xl">
                {/* App header */}
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-teal-400" />
                    <span className="font-mono text-sm text-teal-300">https://example.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-teal-400">Complete</span>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-0 border-b border-white/[0.06]">
                  {[
                    { icon: BarChart3, label: "Pages", value: "12" },
                    { icon: Globe, label: "Assets", value: "47" },
                    { icon: CheckCircle2, label: "OK", value: "44" },
                    { icon: XCircle, label: "Failed", value: "3" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="px-4 py-3 text-center border-r border-white/[0.04] last:border-0">
                      <div className="font-mono font-bold text-white text-lg">{value}</div>
                      <div className="text-[9px] text-slate-600 uppercase font-mono">{label}</div>
                    </div>
                  ))}
                </div>

                {/* File list */}
                <div className="divide-y divide-white/[0.04] max-h-64 overflow-hidden">
                  {mockFiles.map((file) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 px-5 py-2.5"
                    >
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${typeColors[file.type] || "text-slate-400 bg-slate-500/10"}`}>
                        {file.type.toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-slate-300 flex-1 truncate">{file.name}</span>
                      <span className="font-mono text-[10px] text-slate-600">{file.size}</span>
                      {file.status === "ok" && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />}
                      {file.status === "err" && <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                      {file.status === "warn" && <Clock className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
                    </motion.div>
                  ))}
                </div>

                {/* Download bar */}
                <div className="px-5 py-4 border-t border-white/[0.06]">
                  <button className="btn-primary w-full justify-center text-sm">
                    <Download className="w-4 h-4" />
                    Download ZIP (1.4 MB)
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -inset-4 bg-blue-500/5 rounded-3xl blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
