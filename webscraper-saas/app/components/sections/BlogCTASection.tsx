"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Rss, Github, Instagram, Terminal, ExternalLink } from "lucide-react";
import TubesBackground from "../ui/TubesBackground";

const posts = [
  {
    cat: "SYSTEMS",
    title: "RESTRUCTURING MINIFIED JS BUNDLES INTO CLEAN REST MAPS",
    excerpt: "How regex AST traversals decompile runtime route registrations and expose hidden endpoints.",
    date: "MAR 2025",
    read: "8 MIN",
  },
  {
    cat: "FERRARI SPEC",
    title: "LUXURY EDITORIAL UI: CINEMATIC CANVASES AND SHARP HAILINES",
    excerpt: "Why premium brand sites utilize near-black #181818 canvases, 0px border radius, and strict typography rules.",
    date: "FEB 2025",
    read: "6 MIN",
  },
  {
    cat: "AI PROTOCOLS",
    title: "FEEDING DESIGN.MD AND SKILL.MD DIRECTLY INTO CODEX & CURSOR",
    excerpt: "Accelerate autonomous agent frontend fidelity by feeding exact color scales and spacing grids upfront.",
    date: "JAN 2025",
    read: "10 MIN",
  },
];

export function BlogSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 px-6 bg-[#181818]" id="blog">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="pill mb-4">
              <Rss className="w-3.5 h-3.5 text-[#da291c]" />
              TECHNICAL MEMOS
            </div>
            <h2 className="font-display font-medium text-4xl lg:text-5xl text-white uppercase tracking-[-1.12px]">
              ENGINEERING <span className="gt-red font-bold">DISPATCHES</span>
            </h2>
          </div>
          <a
            href="https://github.com/akarshxs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost shrink-0"
          >
            ALL ARCHIVES <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card card-hover p-7 flex flex-col bg-[#202020] border-[#303030] group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono tracking-[1px] text-[#da291c] border border-[#303030] px-2 py-0.5 uppercase bg-[#181818]">
                  {p.cat}
                </span>
                <span className="mono text-[11px] text-[#666666]">{p.read}</span>
              </div>
              <h3 className="font-display font-semibold text-white text-[15px] uppercase tracking-[1px] leading-snug mb-3 group-hover:text-[#da291c] transition-colors flex-1">
                {p.title}
              </h3>
              <p className="text-xs text-[#969696] leading-relaxed mb-6">{p.excerpt}</p>
              <div className="flex items-center justify-between pt-4 border-t border-[#303030]">
                <span className="mono text-[11px] text-[#666666]">{p.date}</span>
                <ArrowRight className="w-4 h-4 text-[#969696] group-hover:text-[#da291c] group-hover:translate-x-1 transition-all" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[#181818] border-t border-[#303030]">
      {/* 3D Tubes background behind closing section */}
      <div className="absolute inset-0 z-0">
        <TubesBackground opacity={0.7} enableClickInteraction={true} />
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, #181818 0%, rgba(24,24,24,0.4) 50%, #181818 100%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="pill mb-6 mx-auto w-fit">
            <span className="dot-live" />
            LIVE PROTOCOL READY
          </div>
          <h2 className="font-display font-medium text-4xl sm:text-6xl text-white uppercase tracking-[-1.6px] mb-5 leading-tight">
            PASTE A TARGET URL. <br />
            <span className="gt-red font-bold">EXTRACT FULL ARCHITECTURE.</span>
          </h2>
          <p className="text-[#969696] text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Zero sign-up barrier. Extracts complete web source trees and generates production-ready DESIGN.md files in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 pointer-events-auto">
            <Link href="/dashboard" className="btn-prime text-sm px-9 py-4">
              LAUNCH WEB CRAWLER CONSOLE
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <a
              href="https://github.com/akarshxs/DESIGN.md-Extractor-by-X-Velocity-v0.1.1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm px-8 py-4"
            >
              <Github className="w-4 h-4 mr-1 text-[#da291c]" />
              GET CHROME EXTENSION
            </a>
          </div>

          {/* Luxury-Automotive Architect Credit Card */}
          <div className="card p-6 inline-flex flex-col sm:flex-row items-center gap-6 bg-[#202020] border-[#303030] pointer-events-auto">
            <div className="text-center sm:text-left">
              <div className="label-mono mb-1 text-[#666666]">LEAD ARCHITECT</div>
              <div className="font-display font-bold text-white text-base tracking-[1px] uppercase">
                AKARSH TRIPATHI // X VELOCITY
              </div>
            </div>
            <div className="h-px sm:h-8 w-8 sm:w-px bg-[#303030]" />
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/akarshxs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-[1px] text-[#969696] hover:text-white transition-colors group"
              >
                <Github className="w-4 h-4 group-hover:text-[#da291c] transition-colors" />
                @AKARSHXS
              </a>
              <span className="text-[#303030]">/</span>
              <a
                href="https://instagram.com/akarshxs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-[1px] text-[#969696] hover:text-white transition-colors group"
              >
                <Instagram className="w-4 h-4 group-hover:text-[#da291c] transition-colors" />
                @AKARSHXS
              </a>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

export default BlogSection;
