"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, FileX, Search } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Manual downloading takes hours",
    desc: "Right-clicking every file, tracking asset URLs, and organizing them by hand is a full-day job — even for small sites.",
  },
  {
    icon: FileX,
    title: "Assets and scripts get missed",
    desc: "Browser dev tools show you the surface. But third-party fonts, lazy-loaded chunks, and service workers stay invisible.",
  },
  {
    icon: Search,
    title: "No way to map API structure",
    desc: "Understanding a site's data layer means watching dozens of network requests and manually noting each endpoint.",
  },
  {
    icon: AlertTriangle,
    title: "Fragile, one-off scripts break constantly",
    desc: "Custom scraper scripts require maintenance, break on layout changes, and aren't portable across projects.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative py-28 overflow-hidden" id="problem">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-5">
            <AlertTriangle className="w-3 h-3" />
            The Problem
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            Downloading website source<br />
            <span className="text-slate-500">shouldn&apos;t be this hard</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Existing tools are fragile, slow, and miss critical assets. Developers and researchers waste countless hours on a problem that should be solved.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card glass-card-hover p-6 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <p.icon className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual connector */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-16"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-teal-500/40 to-transparent" />
            <div className="section-label">↓ Here&apos;s the fix</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
