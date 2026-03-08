"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe, Github } from "lucide-react";

const TARGETS = [
  "https://stripe.com",
  "https://vercel.com",
  "https://github.com/openai",
  "https://linear.app",
  "https://notion.so",
];

const LOGS = [
  { color: "#888",     msg: "→ Booting crawler engine v2.0..." },
  { color: "#00c9a7", msg: "✓ DNS resolved  93.184.216.34" },
  { color: "#888",     msg: "→ GET /          HTTP 200  48.2kb" },
  { color: "#888",     msg: "→ Parsing 23 internal links..." },
  { color: "#888",     msg: "→ GET /about     HTTP 200  12.1kb" },
  { color: "#888",     msg: "→ GET /main.css  HTTP 200  94.3kb" },
  { color: "#888",     msg: "→ GET /bundle.js HTTP 200  312kb" },
  { color: "#f59e0b", msg: "! Scanning API surface..." },
  { color: "#00c9a7", msg: "✓ GET /docs      HTTP 200  67.8kb" },
  { color: "#00c9a7", msg: "✓ API  /api/v1/users  (REST)" },
  { color: "#00c9a7", msg: "✓ API  /graphql        (GQL)" },
  { color: "#888",     msg: "→ Packaging 58 files → source.zip" },
  { color: "#00c9a7", msg: "✓ Complete — 12 pages · 44 assets · 2 APIs" },
];

export default function Hero() {
  const [urlIdx, setUrlIdx] = useState(0);
  const [visible, setVisible] = useState(0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setUrlIdx(i => (i + 1) % TARGETS.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cleanupTimer: ReturnType<typeof setTimeout>;

    function run() {
      setRunning(true);
      setVisible(0);
      setProgress(0);
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setVisible(i);
        setProgress(Math.round((i / LOGS.length) * 100));
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
        if (i >= LOGS.length) {
          clearInterval(iv);
          cleanupTimer = setTimeout(() => {
            setRunning(false);
            cleanupTimer = setTimeout(run, 2000);
          }, 2500);
        }
      }, 360);
    }

    const start = setTimeout(run, 800);
    return () => { clearTimeout(start); clearTimeout(cleanupTimer); };
  }, []);

  const counts = {
    pages:  Math.min(12, Math.floor(visible * 0.95)),
    assets: Math.min(44, visible * 3),
    apis:   Math.min(2, Math.floor(visible / 5)),
    errors: 0,
  };

  return (
    <section className="relative min-h-screen flex items-center pt-[60px] overflow-hidden">
      {/* Subtle radial glow - top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center top, rgba(0,201,167,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

        {/* Left */}
        <div>
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}>
            <div className="pill mb-7">
              <span className="dot-accent" />
              Web Intelligence Platform
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.08 }}
            className="font-display font-black text-5xl lg:text-[3.75rem] xl:text-[4.25rem] leading-[1.02] tracking-tight text-white mb-5"
          >
            Download the<br />
            full source of<br />
            <span className="gt">any website</span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, delay:0.18 }}
            className="text-[1.05rem] text-neutral-400 leading-relaxed mb-8 max-w-lg"
          >
            SourcePull crawls any public URL and exports the complete source — HTML, CSS, JS, images, fonts, and API endpoints — packaged as a structured ZIP in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, delay:0.28 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <Link href="/dashboard" className="btn-prime text-[0.9rem] px-6 py-3">
              Start Extracting
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/akarshxs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-[0.9rem] px-6 py-3"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.45 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: Shield, label: "No data retained" },
              { icon: Zap,    label: "< 30s extraction" },
              { icon: Globe,  label: "Any public URL" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-neutral-500">
                <Icon className="w-3.5 h-3.5 text-[#00c9a7]" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Terminal */}
        <motion.div
          initial={{ opacity:0, x:32, y:8 }}
          animate={{ opacity:1, x:0, y:0 }}
          transition={{ duration:0.7, delay:0.12, ease:[0.22,1,0.36,1] }}
          className="relative"
        >
          {/* Soft glow behind terminal */}
          <div
            className="absolute -inset-8 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(0,201,167,0.05) 0%, transparent 70%)" }}
          />

          <div className="terminal shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
            {/* Window chrome */}
            <div className="terminal-bar">
              <div className="terminal-dots">
                <div className="td td-r" />
                <div className="td td-y" />
                <div className="td td-g" />
              </div>
              <span className="mono text-[11px] text-neutral-600 tracking-wide">sourcepull — crawler</span>
              <div className={`flex items-center gap-1.5 mono text-[11px] ${running ? "text-[#00c9a7]" : "text-neutral-600"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${running ? "bg-[#00c9a7] animate-pulse" : "bg-neutral-700"}`} />
                {running ? "scanning" : "idle"}
              </div>
            </div>

            {/* URL bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0e0e0e] border-b border-white/[0.05]">
              <Globe className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
              <span className="mono text-[11px] text-neutral-700 mr-1">$</span>
              <motion.span
                key={urlIdx}
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ duration:0.25 }}
                className="mono text-[12px] text-[#00c9a7] truncate flex-1"
              >
                {TARGETS[urlIdx]}
              </motion.span>
              {running && <span className="mono text-[12px] text-[#00c9a7] animate-blink ml-2 shrink-0">█</span>}
            </div>

            {/* Progress */}
            <div className="prog-track mx-4 mt-3">
              <motion.div
                className="prog-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration:0.28 }}
                style={{ width: 0 }}
              />
            </div>

            {/* Log output */}
            <div
              ref={logRef}
              className="p-4 h-[240px] overflow-y-auto mono text-[11.5px] space-y-1.5"
              style={{ scrollbarWidth:"none" }}
            >
              {LOGS.slice(0, visible).map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity:0, x:-4 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ duration:0.15 }}
                  style={{ color: l.color }}
                  className="whitespace-pre leading-relaxed"
                >
                  {l.msg}
                </motion.div>
              ))}
              {running && visible < LOGS.length && (
                <span className="text-[#00c9a7] animate-blink">█</span>
              )}
            </div>

            {/* Stats footer */}
            <div className="grid grid-cols-4 divide-x divide-white/[0.05] border-t border-white/[0.05]">
              {[
                { label: "PAGES",  val: counts.pages },
                { label: "ASSETS", val: counts.assets },
                { label: "APIS",   val: counts.apis },
                { label: "ERRORS", val: counts.errors },
              ].map(({ label, val }) => (
                <div key={label} className="py-3 text-center">
                  <div className="mono font-bold text-sm text-white tabular-nums">{val}</div>
                  <div className="label-mono text-[9px] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
