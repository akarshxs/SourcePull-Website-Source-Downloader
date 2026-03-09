"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, FolderX, AlertCircle, Puzzle } from "lucide-react";

const pains = [
  { icon: Clock,       n:"01", title:"Hours of manual work",       body:"Saving pages one by one, hunting stylesheet URLs, right-clicking images — endless repetition for even a single site." },
  { icon: FolderX,     n:"02", title:"Missing assets every time",   body:"Browser DevTools shows files but downloading each one is error-prone. Half your archive ends up broken or incomplete." },
  { icon: AlertCircle, n:"03", title:"Hidden API endpoints",        body:"REST calls buried inside minified JS bundles are nearly impossible to find manually. Critical data just slips past." },
  { icon: Puzzle,      n:"04", title:"No structure, just chaos",    body:"Files land in random folders. Reconstructing the original site tree takes longer than the download itself." },
];

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-80px" });

  return (
    <section className="py-24 px-6" id="problem">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5 }}
          className="text-center mb-14"
        >
          <div className="pill mb-5 mx-auto w-fit" style={{ borderColor:"rgba(239,68,68,0.25)", background:"rgba(239,68,68,0.06)", color:"#ef4444" }}>
            <AlertCircle className="w-3 h-3" />
            The Problem
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4 leading-tight">
            Manual download is<br className="hidden lg:block" /> <span className="gt">broken by design</span>
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto text-lg leading-relaxed">
            Every approach before SourcePull wastes hours and still leaves you with an incomplete mess.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pains.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.n}
                initial={{ opacity:0, y:24 }}
                animate={inView ? { opacity:1, y:0 } : {}}
                transition={{ duration:0.5, delay:i*0.08 }}
                className="card card-hover p-6 relative overflow-hidden"
              >
                <span className="absolute top-4 right-4 mono text-[36px] font-black text-white/[0.03] select-none leading-none">{p.n}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-5" style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)" }}>
                  <Icon className="w-4 h-4 text-red-400" strokeWidth={1.6} />
                </div>
                <h3 className="font-display font-bold text-white text-[0.95rem] mb-2.5">{p.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{p.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
