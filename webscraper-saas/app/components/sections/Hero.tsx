"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Shield, Zap, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const urls = [
  "https://example.com",
  "https://github.com/user/repo",
  "https://target-site.io",
  "https://docs.company.com",
];

const logLines = [
  { text: "→ Initializing crawler engine...", color: "text-slate-400" },
  { text: "→ Connecting to example.com", color: "text-blue-400" },
  { text: "✓ Resolved DNS: 93.184.216.34", color: "text-teal-400" },
  { text: "→ Fetching /index.html (200 OK)", color: "text-teal-400" },
  { text: "→ Extracting 14 internal links", color: "text-slate-400" },
  { text: "→ Downloading style.css (48kb)", color: "text-blue-400" },
  { text: "→ Downloading main.js (124kb)", color: "text-blue-400" },
  { text: "✓ Scraped /about  (200 OK)", color: "text-teal-400" },
  { text: "✓ Scraped /docs   (200 OK)", color: "text-teal-400" },
  { text: "→ Detecting API endpoints...", color: "text-yellow-400" },
  { text: "✓ Found: /api/v1/users", color: "text-teal-400" },
  { text: "✓ Packaging 47 files → source.zip", color: "text-teal-400" },
];

export default function Hero() {
  const [urlIndex, setUrlIndex] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<number>(0);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const urlTimer = setInterval(() => {
      setUrlIndex((i) => (i + 1) % urls.length);
    }, 3000);
    return () => clearInterval(urlTimer);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setScanning(true);
      let i = 0;
      const logTimer = setInterval(() => {
        setVisibleLogs((prev) => {
          if (prev >= logLines.length) {
            clearInterval(logTimer);
            setTimeout(() => {
              setScanning(false);
              setVisibleLogs(0);
              setTimeout(() => setScanning(true), 1000);
            }, 2000);
            return prev;
          }
          return prev + 1;
        });
        i++;
      }, 400);
    }, 1000);
    return () => clearTimeout(delay);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-0" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[80px] -z-0" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        {/* Left content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-label mb-6">
              <Zap className="w-3 h-3" />
              Next-Gen Web Intelligence
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6"
          >
            Extract Every<br />
            <span className="gradient-text">Byte of Source</span><br />
            From Any Site
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl"
          >
            SourcePull crawls websites and exports complete source packages — HTML, CSS, JS, images, fonts, API endpoints — delivered as a ready-to-use ZIP archive in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10"
          >
            <Link href="/app" className="btn-primary text-base px-7 py-3.5">
              Start Downloading Source
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="btn-ghost text-base">
              <Play className="w-3.5 h-3.5 fill-current" />
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-5"
          >
            {[
              { icon: Shield, text: "No data stored" },
              { icon: Zap, text: "< 30s extraction" },
              { icon: Globe, text: "Any public URL" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-500">
                <Icon className="w-3.5 h-3.5 text-teal-500" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Terminal UI */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="gradient-border rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
            <div className="bg-[#0a0f1e] rounded-2xl">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-xs text-slate-600">sourcepull — crawler</span>
                <div className={`flex items-center gap-1.5 text-xs font-mono ${scanning ? "text-teal-400" : "text-slate-600"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${scanning ? "bg-teal-400 animate-pulse" : "bg-slate-600"}`} />
                  {scanning ? "scanning" : "ready"}
                </div>
              </div>

              {/* URL bar */}
              <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-600 shrink-0" />
                <motion.span
                  key={urlIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-sm text-teal-300 truncate"
                >
                  {urls[urlIndex]}
                </motion.span>
              </div>

              {/* Log output */}
              <div className="p-4 h-72 overflow-hidden font-mono text-xs space-y-1.5">
                {logLines.slice(0, visibleLogs).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={line.color}
                  >
                    {line.text}
                  </motion.div>
                ))}
                {scanning && visibleLogs < logLines.length && (
                  <div className="text-teal-400 opacity-70 cursor-blink">&nbsp;</div>
                )}
              </div>

              {/* Stats bar */}
              <div className="px-4 py-3 border-t border-white/[0.06] grid grid-cols-4 gap-3">
                {[
                  { label: "Pages", value: Math.min(visibleLogs * 1, 9) },
                  { label: "Assets", value: Math.min(visibleLogs * 3, 47) },
                  { label: "APIs", value: Math.min(Math.floor(visibleLogs / 4), 3) },
                  { label: "Errors", value: 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="font-mono text-sm text-white font-bold">{value}</div>
                    <div className="font-mono text-[9px] text-slate-600 uppercase">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow effect behind terminal */}
          <div className="absolute -inset-4 bg-teal-500/5 rounded-3xl blur-2xl -z-10" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-teal-500/10 blur-2xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
