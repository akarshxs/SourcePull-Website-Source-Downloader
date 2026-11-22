"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Package, Cpu, Code2, FileCode, AlertTriangle, Map, Layers, Wand2 } from "lucide-react";

const features = [
  { icon: Globe, n: "01", title: "DEEP BFS RECURSION", body: "Crawls all internal routes up to 4 levels deep. Captures SPAs, multi-page architectures, and dynamic views." },
  { icon: Wand2, n: "02", title: "DESIGN.MD EXTRACTION", body: "Scans 1,000 DOM elements and exports structured DESIGN.md and SKILL.md rulesets for Claude Code and Cursor." },
  { icon: Package, n: "03", title: "COMPACT ZIP PACKAGING", body: "Compresses the entire hierarchy into an instant, organized ZIP that mirrors target domain directories." },
  { icon: Cpu, n: "04", title: "API RECON DISCOVERY", body: "Regex parser surfaces hidden REST routes, GraphQL queries, and microservice URLs directly from minified scripts." },
  { icon: Code2, n: "05", title: "FULL JS & CSS BUNDLES", body: "Downloads runtime script chunks, async lazy-loaded styles, and third-party vendor assets." },
  { icon: FileCode, n: "06", title: "ASSET PIPELINE MIRROR", body: "Extracts webp, svg, png, otf, and woff2 font files, correcting all internal relative paths." },
  { icon: AlertTriangle, n: "07", title: "LOGGED AUDIT TRAIL", body: "Logs 403 blocks, 404 dead routes, and CORS anomalies in a clean, human-readable diagnostics file." },
  { icon: Map, n: "08", title: "SITE ARCHITECTURE MAP", body: "Generates JSON domain maps revealing site hierarchy, depth levels, and HTTP response codes." },
  { icon: Layers, n: "09", title: "CLIENT PRIVACY SHIELD", body: "Runs processing client-side in browser memory with zero third-party database telemetry." },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-6 bg-[#181818]" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="pill mb-4 mx-auto w-fit">
            <Layers className="w-3.5 h-3.5 text-[#da291c]" />
            ENGINE CAPABILITIES
          </div>
          <h2 className="font-display font-medium text-4xl lg:text-5xl text-white uppercase tracking-[-1.12px] mb-4">
            EVERY ARTIFACT ON THE SITE. <br />
            <span className="gt-red font-bold">WEB CRAWLER CAPTURES IT.</span>
          </h2>
          <p className="text-[#969696] max-w-xl mx-auto text-base lg:text-lg leading-relaxed">
            Zero CLI installs. Zero server configurations. One URL in, complete source package and design specs out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.n}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                className="card card-hover card-accent p-6 bg-[#202020] border-[#303030] group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="mono text-xs font-bold text-[#da291c]">{f.n}</span>
                  <div className="w-9 h-9 flex items-center justify-center bg-[#181818] border border-[#303030] group-hover:border-[#da291c] transition-colors">
                    <Icon className="w-4 h-4 text-white group-hover:text-[#da291c] transition-colors" strokeWidth={1.7} />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-white text-[14px] uppercase tracking-[1px] mb-2">{f.title}</h3>
                <p className="text-xs text-[#969696] leading-relaxed">{f.body}</p>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-[#da291c]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
