"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link2, ScanSearch, FolderOpen, Download } from "lucide-react";

const steps = [
  { n:"01", icon:Link2,      title:"Enter the Target URL",       body:"Paste any public website URL. Optionally configure crawl depth and max pages for your use case.", snippet:"https://target-site.io", tag:"INPUT" },
  { n:"02", icon:ScanSearch, title:"Intelligent Crawl",          body:"SourcePull's BFS engine visits every discoverable page, following internal links and collecting assets.", snippet:"23 pages → 8.2 MB", tag:"CRAWL" },
  { n:"03", icon:FolderOpen, title:"Extract Everything",         body:"HTML, CSS, JS, images, fonts, and API endpoints downloaded and organized into a mirrored directory tree.", snippet:"142 assets found", tag:"EXTRACT" },
  { n:"04", icon:Download,   title:"Download Source Package",    body:"Your complete site archive is compressed into a ZIP — structured, labeled, and immediately usable.", snippet:"source.zip  4.1 MB", tag:"OUTPUT" },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-80px" });

  return (
    <section className="py-24 px-6" id="how-it-works">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Left sticky */}
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5 }}
          className="lg:sticky lg:top-24"
        >
          <div className="pill mb-6">
            <ScanSearch className="w-3 h-3" />
            Workflow
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-5 leading-tight">
            URL to ZIP in<br /><span className="gt">four steps</span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed mb-8">
            No CLI setup, no config files, no dependencies. Open the app, paste your URL, get your files.
          </p>
          <div className="card p-5 inline-block">
            <div className="label-mono mb-2 block">avg extraction time</div>
            <div className="flex items-end gap-2">
              <span className="mono font-black text-5xl text-[#00c9a7] leading-none">14</span>
              <span className="mono text-lg text-neutral-600 mb-1">sec</span>
            </div>
            <div className="label-mono mt-1">for a 20-page site</div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="pt-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isLast = i === steps.length - 1;
            const sRef = useRef(null);
            const sInView = useInView(sRef, { once:true, margin:"-60px" });

            return (
              <div key={s.n} ref={sRef} className="relative flex gap-7">
                {/* Connector */}
                {!isLast && (
                  <div className="absolute left-[19px] top-[44px] bottom-0 w-px overflow-hidden">
                    <motion.div
                      className="w-full h-full"
                      style={{ background:"linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.02))" }}
                      initial={{ scaleY:0, originY:0 }}
                      animate={sInView ? { scaleY:1 } : {}}
                      transition={{ duration:0.8, delay:0.25 }}
                    />
                  </div>
                )}

                {/* Circle icon */}
                <motion.div
                  initial={{ opacity:0, scale:0.5 }}
                  animate={sInView ? { opacity:1, scale:1 } : {}}
                  transition={{ duration:0.4, delay:i*0.1 }}
                  className="shrink-0 w-10 h-10 rounded-full border border-white/[0.1] bg-[#111] flex items-center justify-center z-10"
                >
                  <Icon className="w-4 h-4 text-[#00c9a7]" strokeWidth={1.5} />
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity:0, x:16 }}
                  animate={sInView ? { opacity:1, x:0 } : {}}
                  transition={{ duration:0.5, delay:0.06+i*0.1 }}
                  className="pb-12"
                >
                  <span className="label-mono mb-2 block">{s.n}</span>
                  <h3 className="font-display font-bold text-white text-xl mb-2.5">{s.title}</h3>
                  <p className="text-neutral-500 leading-relaxed mb-4 max-w-sm">{s.body}</p>
                  <div className="inline-flex items-center gap-3 border border-white/[0.07] bg-[#111] rounded-md px-3.5 py-2">
                    <span className="label-mono">{s.tag}</span>
                    <span className="mono text-[11.5px] text-[#00c9a7]">{s.snippet}</span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
