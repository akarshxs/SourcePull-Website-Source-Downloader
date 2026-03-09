"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Monitor, FolderOpen, CheckCircle2, Download } from "lucide-react";

const files = [
  { name:"index.html",         size:"48 KB",  icon:"📄", d:0 },
  { name:"pages/",             size:"",        icon:"📁", d:0, dir:true },
  { name:"about.html",         size:"12 KB",  icon:"📄", d:1 },
  { name:"docs/index.html",    size:"34 KB",  icon:"📄", d:1 },
  { name:"pricing.html",       size:"19 KB",  icon:"📄", d:1 },
  { name:"assets/",            size:"",        icon:"📁", d:0, dir:true },
  { name:"main.css",           size:"94 KB",  icon:"🎨", d:1 },
  { name:"bundle.js",          size:"312 KB", icon:"⚙️",  d:1 },
  { name:"logo.svg",           size:"4 KB",   icon:"🖼",  d:1 },
  { name:"api_data/",          size:"",        icon:"📁", d:0, dir:true },
  { name:"v1_users.json",      size:"2 KB",   icon:"🔌", d:1 },
];

const logs = [
  { c:"#22c55e", m:"✓ Crawl complete — 12 pages visited" },
  { c:"#22c55e", m:"✓ 46 assets extracted" },
  { c:"#22c55e", m:"✓ 2 API endpoints discovered" },
  { c:"#f59e0b", m:"! 1 page returned 404 (logged)" },
  { c:"#22c55e", m:"✓ source.zip ready → 4.1 MB" },
];

const progItems = [
  { label:"Pages crawled",  val:92 },
  { label:"Assets found",   val:78 },
  { label:"Scripts parsed", val:100 },
  { label:"ZIP packaged",   val:100 },
];

export default function DashboardPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });

  return (
    <section className="py-24 px-6" id="dashboard">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5 }}
          className="text-center mb-14"
        >
          <div className="pill mb-5 mx-auto w-fit">
            <Monitor className="w-3 h-3" />
            Dashboard
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4 leading-tight">
            Full visibility into <span className="gt">every extraction</span>
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-lg">
            Live logs, structured file tree, progress bars, and one-click download.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:32 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.65, delay:0.12, ease:[0.22,1,0.36,1] }}
          className="terminal shadow-[0_60px_120px_rgba(0,0,0,0.7)]"
        >
          {/* Chrome */}
          <div className="terminal-bar">
            <div className="terminal-dots">
              <div className="td td-r" /><div className="td td-y" /><div className="td td-g" />
            </div>
            <span className="mono text-[11px] text-neutral-600">SourcePull Dashboard</span>
            <div className="flex items-center gap-1.5">
              <div className="dot-live" />
              <span className="mono text-[11px] text-[#22c55e]">complete</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.05]">

            {/* File tree */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <FolderOpen className="w-3.5 h-3.5 text-neutral-600" />
                <span className="label-mono">File Tree</span>
              </div>
              <div className="space-y-0.5">
                {files.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity:0, x:-6 }}
                    animate={inView ? { opacity:1, x:0 } : {}}
                    transition={{ duration:0.25, delay:0.4+i*0.05 }}
                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/[0.03] transition-colors group"
                    style={{ paddingLeft: f.d * 14 + 8 }}
                  >
                    <span className="text-xs flex items-center gap-1.5">
                      <span>{f.icon}</span>
                      <span className={f.dir ? "text-neutral-300 font-semibold" : "text-neutral-500 group-hover:text-neutral-300 transition-colors"}>
                        {f.name}
                      </span>
                    </span>
                    {f.size && <span className="mono text-[10px] text-neutral-700">{f.size}</span>}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress + stats */}
            <div className="p-5 flex flex-col gap-6">
              <div>
                <div className="label-mono mb-4 block">Extraction Progress</div>
                {progItems.map((p, i) => (
                  <div key={p.label} className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="mono text-[11px] text-neutral-500">{p.label}</span>
                      <span className="mono text-[11px] text-[#00c9a7]">{p.val}%</span>
                    </div>
                    <div className="prog-track">
                      <motion.div
                        className="prog-fill"
                        initial={{ width:0 }}
                        animate={inView ? { width:`${p.val}%` } : {}}
                        transition={{ duration:1.1, delay:0.55+i*0.12, ease:"easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2.5 mt-auto">
                {[{l:"PAGES",v:12},{l:"ASSETS",v:46},{l:"APIS",v:2},{l:"ERRORS",v:1}].map(s => (
                  <div key={s.l} className="card p-3 text-center">
                    <div className="mono font-black text-2xl text-white">{s.v}</div>
                    <div className="label-mono mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Log + download */}
            <div className="p-5 flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="label-mono">Output Log</span>
                </div>
                <div className="mono text-[11px] space-y-2">
                  {logs.map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity:0 }}
                      animate={inView ? { opacity:1 } : {}}
                      transition={{ delay:0.65+i*0.12 }}
                      style={{ color:l.c }}
                    >
                      {l.m}
                    </motion.div>
                  ))}
                </div>
              </div>
              <a href="/dashboard" className="btn-prime justify-center mt-auto">
                <Download className="w-4 h-4" />
                Open Dashboard
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
