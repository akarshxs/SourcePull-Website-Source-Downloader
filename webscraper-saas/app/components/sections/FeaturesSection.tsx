"use client";
import { motion } from "framer-motion";
import {
  Globe, Cpu, Image, Radio, Code, FileWarning, Archive, Map,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Full Website Source Export",
    desc: "Download complete HTML for every crawled page, preserving document structure and metadata.",
    color: "from-teal-500/20 to-teal-500/5",
    border: "border-teal-500/20",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badge: "Core",
  },
  {
    icon: Cpu,
    title: "Smart Page Crawling",
    desc: "Intelligent BFS crawler respects robots.txt, depth limits, and same-domain boundaries.",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badge: "AI-Powered",
  },
  {
    icon: Image,
    title: "Asset Downloader",
    desc: "Pulls every image, SVG, font, video, and binary file referenced across all pages.",
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/20",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    badge: null,
  },
  {
    icon: Radio,
    title: "API Endpoint Detection",
    desc: "Automatically detects and logs XHR/fetch calls, REST endpoints, and GraphQL queries.",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/20",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    badge: "New",
  },
  {
    icon: Code,
    title: "JS & CSS Extraction",
    desc: "Captures all stylesheets and scripts — including inline, external, and dynamically injected.",
    color: "from-teal-500/20 to-blue-500/5",
    border: "border-teal-500/15",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    badge: null,
  },
  {
    icon: FileWarning,
    title: "Error Logging",
    desc: "Detailed logs for every failed request, broken link, and blocked resource with actionable diagnostics.",
    color: "from-slate-500/20 to-slate-500/5",
    border: "border-slate-500/20",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
    badge: null,
  },
  {
    icon: Archive,
    title: "ZIP Packaging",
    desc: "All extracted files compressed into a structured, ready-to-open ZIP archive with folder hierarchy preserved.",
    color: "from-yellow-500/20 to-yellow-500/5",
    border: "border-yellow-500/20",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
    badge: null,
  },
  {
    icon: Map,
    title: "Domain Structure Mapping",
    desc: "Visual sitemap of every URL visited, categorized by page type, status code, and content type.",
    color: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/20",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    badge: "Beta",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-28" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-5">Features</div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            Everything you need to<br />
            <span className="gradient-text">dissect any website</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From simple page archives to deep API mapping — SourcePull handles every layer of the web stack automatically.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative glass-card glass-card-hover p-5 bg-gradient-to-br ${f.color} ${f.border}`}
            >
              {f.badge && (
                <span className="absolute top-3 right-3 text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-400">
                  {f.badge}
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl ${f.iconBg} border ${f.border} flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.iconColor}`} />
              </div>
              <h3 className="font-display font-bold text-white text-sm mb-2 leading-snug">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
