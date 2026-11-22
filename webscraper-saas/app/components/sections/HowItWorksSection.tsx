"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link2, ScanSearch, FolderOpen, Download } from "lucide-react";

const steps = [
  { n: "01", icon: Link2,      title: "SPECIFY TARGET ENDPOINT",   body: "Paste any public web domain. Adjust crawl depth from 1 to 4 and limit max pages to tune time vs depth.", snippet: "https://ferrari.com", tag: "INPUT" },
  { n: "02", icon: ScanSearch, title: "ORCHESTRATE BFS RECON",     body: "The engine discovers all internal hyper-references, bypassing typical superficial one-page scraping limits.", snippet: "34 PAGES // 186 ASSETS", tag: "CRAWL" },
  { n: "03", icon: FolderOpen, title: "RECONSTRUCT & TOKENIZE",     body: "Extracts HTML, CSS, fonts, and API requests while simultaneously grouping color and typography tokens.", snippet: "DESIGN.MD READY", tag: "EXTRACT" },
  { n: "04", icon: Download,   title: "INSTANT COMPRESSED ARCHIVE", body: "One click downloads your complete site package as source.zip alongside ready-to-use AI design blueprints.", snippet: "SOURCE.ZIP (9.4 MB)", tag: "OUTPUT" },
];

function Step({ s, i, isLast }: { s: typeof steps[0]; i: number; isLast: boolean }) {
  const Icon = s.icon;
  const sRef = useRef(null);
  const sInView = useInView(sRef, { once: true, margin: "-60px" });

  return (
    <div ref={sRef} className="relative flex gap-6">
      {!isLast && (
        <div className="absolute left-[19px] top-[44px] bottom-0 w-px overflow-hidden">
          <motion.div
            className="w-full h-full bg-[#303030]"
            initial={{ scaleY: 0, originY: 0 }}
            animate={sInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={sInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: i * 0.1 }}
        className="shrink-0 w-10 h-10 border border-[#303030] bg-[#202020] flex items-center justify-center z-10"
      >
        <Icon className="w-4 h-4 text-[#da291c]" strokeWidth={1.6} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={sInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.06 + i * 0.1 }}
        className="pb-12"
      >
        <span className="mono text-xs font-bold text-[#da291c] mb-1 block">{s.n}</span>
        <h3 className="font-display font-semibold text-white text-lg tracking-[1px] uppercase mb-2">{s.title}</h3>
        <p className="text-sm text-[#969696] leading-relaxed mb-4 max-w-md">{s.body}</p>
        <div className="inline-flex items-center gap-3 border border-[#303030] bg-[#181818] px-3.5 py-1.5">
          <span className="label-mono text-[9px]">{s.tag}</span>
          <span className="mono text-[11px] text-white font-medium">{s.snippet}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-6 bg-[#181818]" id="how-it-works">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 lg:sticky lg:top-24"
        >
          <div className="pill mb-4">
            <ScanSearch className="w-3.5 h-3.5 text-[#da291c]" />
            PRECISION PIPELINE
          </div>
          <h2 className="font-display font-medium text-4xl lg:text-5xl text-white uppercase tracking-[-1.12px] mb-5 leading-tight">
            URL TO SOURCE IN <br />
            <span className="gt-red font-bold">FOUR PHASES</span>
          </h2>
          <p className="text-[#969696] text-base lg:text-lg leading-relaxed mb-8">
            Engineered with Ferrari precision. Clean hairlines, zero dependency bloat, and automated DESIGN.md structuring built right in.
          </p>
          <div className="card p-6 bg-[#202020] border-[#303030] inline-block">
            <div className="label-mono mb-2 block">BENCHMARK PERFORMANCE</div>
            <div className="flex items-baseline gap-2">
              <span className="mono font-bold text-5xl text-[#da291c] leading-none">12.4</span>
              <span className="mono text-base text-[#969696]">sec</span>
            </div>
            <div className="label-mono text-[10px] mt-2 text-[#666666]">MEDIAN COMPLETION FOR 25 PAGES</div>
          </div>
        </motion.div>

        <div className="lg:col-span-7 pt-2">
          {steps.map((s, i) => (
            <Step key={s.n} s={s} i={i} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
