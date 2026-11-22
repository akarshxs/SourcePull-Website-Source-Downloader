"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe, Sparkles, ChevronDown } from "lucide-react";
import TubesBackground from "../ui/TubesBackground";

const TARGETS = [
  "https://ferrari.com",
  "https://stripe.com",
  "https://vercel.com",
  "https://linear.app",
  "https://openai.com",
];

const LOGS = [
  { color: "#969696", msg: "→ Initializing crawler engine v2.4 (Rosso Edition)..." },
  { color: "#ffffff", msg: "✓ Target resolved: 141.101.90.18" },
  { color: "#969696", msg: "→ GET /                HTTP 200  48.2kb" },
  { color: "#969696", msg: "→ Crawling 34 internal pages (BFS depth=3)..." },
  { color: "#969696", msg: "→ GET /models/f8       HTTP 200  84.1kb" },
  { color: "#969696", msg: "→ GET /assets/app.css  HTTP 200  94.3kb" },
  { color: "#969696", msg: "→ GET /assets/main.js  HTTP 200  412kb" },
  { color: "#da291c", msg: "★ Running DESIGN.md token analysis..." },
  { color: "#ffffff", msg: "✓ Extracted: 48 color tokens · 12 font scales" },
  { color: "#ffffff", msg: "✓ Discovered REST & GraphQL endpoints" },
  { color: "#da291c", msg: "✓ Generated DESIGN.md & SKILL.md specs" },
  { color: "#969696", msg: "→ Compressing structured assets into ZIP..." },
  { color: "#ffffff", msg: "★ Ready: source.zip (9.4 MB) + design_specs.zip" },
];

export default function Hero() {
  const [urlIdx, setUrlIdx] = useState(0);
  const [visible, setVisible] = useState(0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setUrlIdx((i) => (i + 1) % TARGETS.length), 3200);
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
            cleanupTimer = setTimeout(run, 2400);
          }, 3000);
        }
      }, 320);
    }

    const start = setTimeout(run, 600);
    return () => {
      clearTimeout(start);
      clearTimeout(cleanupTimer);
    };
  }, []);

  const counts = {
    pages: Math.min(34, Math.floor(visible * 2.8)),
    assets: Math.min(186, visible * 14),
    apis: Math.min(8, Math.floor(visible / 1.5)),
    tokens: Math.min(64, visible * 5),
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-[64px] overflow-hidden bg-[#181818]">
      {/* ── 3D Interactive Neon Tubes Background ── */}
      <div className="absolute inset-0 z-0">
        <TubesBackground opacity={0.8} enableClickInteraction={true} />
      </div>

      {/* Subtle atmospheric vignette gradient */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-b from-[#181818]/60 via-transparent to-[#181818]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Left Column: Ferrari Editorial Title & CTAs */}
        <div className="lg:col-span-7 pointer-events-auto">
          {/* Eyebrow Label */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="pill mb-6">
              <span className="dot-accent" />
              <span>CRAWLER & DESIGN SYSTEM SUITE</span>
            </div>
          </motion.div>

          {/* Display Headline - Editorial 500 weight, sharp tracking */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display font-medium text-4xl sm:text-6xl lg:text-[4.2rem] leading-[1.05] tracking-[-1.6px] text-white uppercase mb-6"
          >
            CRAWL ANY SITE. <br />
            EXTRACT THE SOURCE. <br />
            <span className="gt-red font-bold">EXPORT DESIGN TOKENS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-[1.05rem] text-[#969696] leading-[1.6] mb-10 max-w-xl"
          >
            Web CRAWLer crawls public web architecture to deliver full HTML/CSS/JS source trees and automated{" "}
            <span className="text-white font-medium">DESIGN.md + SKILL.md</span> systems for Claude Code, Codex, and Cursor in under 30 seconds.
          </motion.p>

          {/* Action Row - 0px sharp corners */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link href="/dashboard" className="btn-prime">
              START EXTRACTION
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <a href="#design-extractor" className="btn-ghost">
              <Sparkles className="w-4 h-4 text-[#da291c]" />
              DESIGN.MD EXTRACTOR
            </a>
          </motion.div>

          {/* Technical badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-[#303030] max-w-lg"
          >
            <div>
              <div className="font-mono font-bold text-2xl text-white">0s</div>
              <div className="text-[11px] font-mono tracking-[1.1px] text-[#666666] uppercase mt-1">CONFIG SETUP</div>
            </div>
            <div>
              <div className="font-mono font-bold text-2xl text-[#da291c]">&lt;30s</div>
              <div className="text-[11px] font-mono tracking-[1.1px] text-[#666666] uppercase mt-1">AVG SPEED</div>
            </div>
            <div>
              <div className="font-mono font-bold text-2xl text-white">100%</div>
              <div className="text-[11px] font-mono tracking-[1.1px] text-[#666666] uppercase mt-1">CLIENT PRIVACY</div>
            </div>
          </motion.div>

          {/* 3D Tubes interactivity hint */}
          <p className="mt-8 text-[11px] font-mono tracking-[1.2px] text-[#666666] uppercase select-none">
            [✦] MOVE CURSOR TO COMMAND 3D TUBES · CLICK TO ROTATE VOLTAGE
          </p>
        </div>

        {/* Right Column: High-Performance Ferrari Red Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-5 pointer-events-auto"
        >
          <div className="terminal shadow-[0_24px_64px_rgba(0,0,0,0.85)] border border-[#303030]">
            {/* Terminal Chrome Bar */}
            <div className="terminal-bar bg-[#202020] border-b border-[#303030]">
              <div className="terminal-dots">
                <div className="td td-r" />
                <div className="td td-y" />
                <div className="td td-g" />
              </div>
              <span className="mono text-[11px] tracking-[1.2px] text-[#969696] uppercase">
                WEB CRAWLER // LIVE RECON
              </span>
              <div className="flex items-center gap-2 mono text-[11px] text-[#da291c]">
                <div className={`w-2 h-2 ${running ? "bg-[#da291c] animate-pulse" : "bg-[#666666]"}`} />
                <span className="uppercase">{running ? "ONLINE" : "STANDBY"}</span>
              </div>
            </div>

            {/* Target Address Display */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#181818] border-b border-[#303030]">
              <Globe className="w-3.5 h-3.5 text-[#da291c] shrink-0" />
              <span className="mono text-[11px] text-[#666666]">$</span>
              <motion.span
                key={urlIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="mono text-[12px] text-white truncate flex-1 font-medium"
              >
                {TARGETS[urlIdx]}
              </motion.span>
              {running && <span className="mono text-[12px] text-[#da291c] animate-blink shrink-0">■</span>}
            </div>

            {/* Precision Rosso Progress Bar */}
            <div className="prog-track mx-4 mt-3">
              <motion.div
                className="prog-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25 }}
                style={{ width: 0 }}
              />
            </div>

            {/* Scroll Stream Output */}
            <div
              ref={logRef}
              className="p-4 h-[250px] overflow-y-auto mono text-[11.5px] space-y-1.5 bg-[#181818]"
              style={{ scrollbarWidth: "none" }}
            >
              {LOGS.slice(0, visible).map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.12 }}
                  style={{ color: l.color }}
                  className="whitespace-pre leading-relaxed"
                >
                  {l.msg}
                </motion.div>
              ))}
              {running && visible < LOGS.length && (
                <span className="text-[#da291c] animate-blink">■</span>
              )}
            </div>

            {/* Telemetry Metric Grid */}
            <div className="grid grid-cols-4 divide-x divide-[#303030] border-t border-[#303030] bg-[#202020]">
              {[
                { label: "PAGES", val: counts.pages },
                { label: "ASSETS", val: counts.assets },
                { label: "APIS", val: counts.apis },
                { label: "TOKENS", val: counts.tokens },
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
