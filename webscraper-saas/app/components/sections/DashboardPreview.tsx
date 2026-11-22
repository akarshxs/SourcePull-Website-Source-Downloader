"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Monitor, FolderOpen, CheckCircle2, Download, Terminal } from "lucide-react";
import Link from "next/link";

const files = [
  { name:"index.html",         size:"48 KB",  icon:"📄", d:0 },
  { name:"pages/",             size:"",        icon:"📁", d:0, dir:true },
  { name:"models.html",        size:"24 KB",  icon:"📄", d:1 },
  { name:"specs/v8.html",      size:"38 KB",  icon:"📄", d:1 },
  { name:"pricing.html",       size:"19 KB",  icon:"📄", d:1 },
  { name:"assets/",            size:"",        icon:"📁", d:0, dir:true },
  { name:"ferrari.css",        size:"94 KB",  icon:"🎨", d:1 },
  { name:"bundle.min.js",      size:"312 KB", icon:"⚙️",  d:1 },
  { name:"logo.svg",           size:"4 KB",   icon:"🖼",  d:1 },
  { name:"design_system/",     size:"",        icon:"📁", d:0, dir:true },
  { name:"DESIGN.md",          size:"14 KB",  icon:"✨", d:1 },
  { name:"SKILL.md",           size:"6 KB",   icon:"⚡", d:1 },
];

const logs = [
  { c:"#ffffff", m:"✓ Target: 100% crawl completed (34 pages)" },
  { c:"#ffffff", m:"✓ 186 static assets resolved & mirrored" },
  { c:"#da291c", m:"★ DESIGN.md & SKILL.md specs compiled" },
  { c:"#da291c", m:"★ 8 REST & GraphQL endpoints cataloged" },
  { c:"#03904a", m:"✓ source.zip ready for extraction → 9.4 MB" },
];

const progItems = [
  { label:"DOM PAGES VISITED",  val:100 },
  { label:"ASSETS PACKAGED",    val:100 },
  { label:"SCRIPTS DECOMPILED", val:100 },
  { label:"TOKENS EXTRACTED",   val:100 },
];

export default function DashboardPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });

  return (
    <section className="py-24 px-6 bg-[#181818]" id="dashboard-preview">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5 }}
          className="text-center mb-16"
        >
          <div className="pill mb-4 mx-auto w-fit">
            <Monitor className="w-3.5 h-3.5 text-[#da291c]" />
            CONSOLE ARCHITECTURE
          </div>
          <h2 className="font-display font-medium text-4xl lg:text-5xl text-white uppercase tracking-[-1.12px] mb-4">
            FULL TELEMETRY INTO <br />
            <span className="gt-red font-bold">EVERY HARVEST CYCLE</span>
          </h2>
          <p className="text-[#969696] max-w-xl mx-auto text-base">
            Live console feed, recursive file trees, token extraction meters, and one-click ZIP packaging.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:32 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.65, delay:0.12 }}
          className="terminal border border-[#303030] shadow-[0_48px_96px_rgba(0,0,0,0.9)] bg-[#181818]"
        >
          <div className="terminal-bar bg-[#202020] border-b border-[#303030]">
            <div className="terminal-dots">
              <div className="td td-r" /><div className="td td-y" /><div className="td td-g" />
            </div>
            <span className="mono text-[11px] text-[#969696] tracking-[1.2px] uppercase">
              WEB CRAWLER TELEMETRY DASHBOARD
            </span>
            <div className="flex items-center gap-2">
              <div className="dot-live" />
              <span className="mono text-[11px] text-[#03904a] uppercase font-bold">READY</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#303030]">

            {/* Tree */}
            <div className="p-6 bg-[#181818]">
              <div className="flex items-center gap-2 mb-4">
                <FolderOpen className="w-4 h-4 text-[#da291c]" />
                <span className="label-mono text-white">RECONSTRUCTED FILE HIERARCHY</span>
              </div>
              <div className="space-y-1">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1 px-2 hover:bg-[#202020] transition-colors"
                    style={{ paddingLeft: f.d * 14 + 8 }}
                  >
                    <span className="text-xs flex items-center gap-2 font-mono">
                      <span>{f.icon}</span>
                      <span className={f.dir ? "text-white font-semibold" : "text-[#969696]"}>
                        {f.name}
                      </span>
                    </span>
                    {f.size && <span className="mono text-[10px] text-[#666666]">{f.size}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="p-6 flex flex-col gap-6 bg-[#202020]">
              <div>
                <div className="label-mono mb-4 block text-white">EXTRACTION PROGRESS</div>
                {progItems.map((p) => (
                  <div key={p.label} className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="mono text-[11px] text-[#969696]">{p.label}</span>
                      <span className="mono text-[11px] text-[#da291c] font-bold">{p.val}%</span>
                    </div>
                    <div className="prog-track">
                      <div className="prog-fill" style={{ width: `${p.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                {[{l:"PAGES",v:34},{l:"ASSETS",v:186},{l:"APIS",v:8},{l:"TOKENS",v:64}].map(s => (
                  <div key={s.l} className="card p-3 text-center bg-[#181818] border-[#303030]">
                    <div className="mono font-bold text-2xl text-white">{s.v}</div>
                    <div className="label-mono text-[9px] mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Output log */}
            <div className="p-6 flex flex-col gap-6 bg-[#181818]">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-[#da291c]" />
                  <span className="label-mono text-white">DIAGNOSTICS STREAM</span>
                </div>
                <div className="mono text-[11.5px] space-y-2 bg-[#202020] p-4 border border-[#303030]">
                  {logs.map((l, i) => (
                    <div key={i} style={{ color: l.c }} className="leading-relaxed">
                      {l.m}
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/dashboard" className="btn-prime justify-center mt-auto">
                <Download className="w-4 h-4 mr-1" />
                LAUNCH LIVE CONSOLE
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
