"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Package, Cpu, Code2, FileCode, AlertTriangle, Map, Layers } from "lucide-react";

const features = [
  { icon: Globe,         n:"01", title:"Full-Site Crawling",        body:"BFS crawler visits every internal link up to configurable depth. No page left behind." },
  { icon: Package,       n:"02", title:"ZIP Export",                body:"All files packaged into a ready-to-use ZIP preserving the original directory structure." },
  { icon: Cpu,           n:"03", title:"API Endpoint Discovery",    body:"Pattern-matching engine surfaces REST, GraphQL, and dynamic API calls from minified JS." },
  { icon: Code2,         n:"04", title:"JS & CSS Collection",       body:"Every stylesheet and script downloaded — including lazy-loaded chunks and async imports." },
  { icon: FileCode,      n:"05", title:"Asset Extraction",          body:"Images, fonts, SVGs, and media files retrieved and correctly referenced in the archive." },
  { icon: AlertTriangle, n:"06", title:"Error Logging",             body:"Failed requests and blocked routes recorded in a structured error log — never silently dropped." },
  { icon: Map,           n:"07", title:"Domain Structure Map",      body:"Machine-readable site map generated showing every crawled URL, depth, and response code." },
  { icon: Layers,        n:"08", title:"Depth & Page Control",      body:"Configure crawl depth (1–4) and max pages (up to 100) per job to balance time vs thoroughness." },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-80px" });

  return (
    <section className="py-24 px-6" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5 }}
          className="text-center mb-14"
        >
          <div className="pill mb-5 mx-auto w-fit">
            <Layers className="w-3 h-3" />
            Capabilities
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4 leading-tight">
            Everything a site contains —<br className="hidden lg:block" />{" "}
            <span className="gt">SourcePull extracts it</span>
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
            No plugins, no browser extensions. One URL in, complete source package out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.n}
                initial={{ opacity:0, y:28 }}
                animate={inView ? { opacity:1, y:0 } : {}}
                transition={{ duration:0.55, delay:(i%4)*0.07 }}
                className="card card-hover card-accent p-6 group relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background:"radial-gradient(ellipse at 0% 0%, rgba(0,201,167,0.05) 0%, transparent 60%)" }}
                />
                <span className="label-mono mb-2 block">{f.n}</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 border border-white/[0.07] bg-white/[0.03] group-hover:border-[rgba(0,201,167,0.2)] group-hover:bg-[rgba(0,201,167,0.04)] transition-all duration-300">
                  <Icon className="w-4.5 h-4.5 text-[#00c9a7]" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-bold text-white text-[0.95rem] mb-2.5 leading-snug">{f.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.body}</p>
                <div className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-gradient-to-r from-[#00c9a7]/40 to-transparent" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
