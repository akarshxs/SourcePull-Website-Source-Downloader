"use client";
import { motion } from "framer-motion";
import { Link2, ScanSearch, Boxes, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Enter a URL",
    desc: "Paste any publicly accessible URL — a homepage, docs site, app, or subdomain. SourcePull accepts full URLs or bare domains.",
    detail: "Supports HTTP & HTTPS, custom ports, subdomains, and URL paths.",
    color: "teal",
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "Crawl the Website",
    desc: "Our multi-threaded crawler traverses the site graph, discovering every internal page up to your configured depth limit.",
    detail: "Configurable depth (1–5), max pages (up to 200), and request throttle.",
    color: "blue",
  },
  {
    number: "03",
    icon: Boxes,
    title: "Extract All Assets",
    desc: "Every stylesheet, script, image, font, and API endpoint is identified, downloaded, and categorized into a clean folder structure.",
    detail: "Smart deduplication prevents downloading the same file twice.",
    color: "purple",
  },
  {
    number: "04",
    icon: Download,
    title: "Download Your Package",
    desc: "Receive a structured ZIP archive containing every extracted file, a sitemap, error log, and a full index of discovered API endpoints.",
    detail: "Archives expire after 24 hours. No data is stored after that.",
    color: "orange",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; line: string }> = {
  teal:   { bg: "bg-teal-500/10",   border: "border-teal-500/30",   text: "text-teal-400",   line: "from-teal-500/40" },
  blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-400",   line: "from-blue-500/40" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", line: "from-purple-500/40" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", line: "from-orange-500/40" },
};

export default function HowItWorksSection() {
  return (
    <section className="relative py-28 overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="section-label mx-auto mb-5">How It Works</div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            From URL to ZIP in<br />
            <span className="gradient-text">four simple steps</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            No configuration, no setup, no expertise required. Paste a URL and get a complete source package.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const c = colorMap[step.color];
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative"
                >
                  {/* Step number + icon */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className={`relative w-14 h-14 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-4 shadow-lg`}>
                      <step.icon className={`w-6 h-6 ${c.text}`} />
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#020817] border ${c.border} flex items-center justify-center`}>
                        <span className={`font-mono text-[9px] font-bold ${c.text}`}>{step.number}</span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-white text-lg mb-3">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{step.desc}</p>
                    <p className={`text-xs ${c.text} font-mono`}>{step.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
