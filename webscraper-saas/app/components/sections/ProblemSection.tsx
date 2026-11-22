"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, FolderX, AlertCircle, Puzzle } from "lucide-react";

const pains = [
  { icon: Clock,       n:"01", title:"HOURS OF MANUAL HARVESTING", body:"Saving web pages one by one, inspecting CSS assets, downloading images manually — tedious and unscalable for large sites." },
  { icon: FolderX,     n:"02", title:"BROKEN RELATIVE ASSETS",      body:"Standard browser downloads break script imports, CSS dependencies, and asset paths, producing corrupted offline folders." },
  { icon: AlertCircle, n:"03", title:"CONCEALED API ENDPOINTS",    body:"REST calls and GraphQL queries buried inside minified JavaScript chunks are missed by standard rippers." },
  { icon: Puzzle,      n:"04", title:"ZERO DESIGN INTELLIGENCE",    body:"Raw code dumps leave you with no typography scale, no color tokens, and no structure for feeding AI coding models." },
];

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-80px" });

  return (
    <section className="py-24 px-6 bg-[#181818]" id="problem">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5 }}
          className="text-center mb-16"
        >
          <div className="pill mb-4 mx-auto w-fit">
            <AlertCircle className="w-3.5 h-3.5 text-[#da291c]" />
            THE BOTTLENECK
          </div>
          <h2 className="font-display font-medium text-4xl lg:text-5xl text-white uppercase tracking-[-1.12px] mb-4">
            LEGACY SITE SCRAPING IS <br />
            <span className="gt-red font-bold">BROKEN BY DESIGN</span>
          </h2>
          <p className="text-[#969696] max-w-lg mx-auto text-base lg:text-lg leading-relaxed">
            Manual scraping burns engineering hours and still leaves broken files with zero design tokens.
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
                className="card card-hover p-6 bg-[#202020] border-[#303030] relative overflow-hidden"
              >
                <span className="absolute top-4 right-4 mono text-[32px] font-bold text-white/[0.04] select-none leading-none">{p.n}</span>
                <div className="w-10 h-10 flex items-center justify-center mb-5 bg-[#da291c]/10 border border-[#da291c]/30">
                  <Icon className="w-4 h-4 text-[#da291c]" strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-semibold text-white text-[13px] uppercase tracking-[1px] mb-2.5">{p.title}</h3>
                <p className="text-xs text-[#969696] leading-relaxed">{p.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
