"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Rss, Github, Instagram } from "lucide-react";

const posts = [
  { cat:"Deep Dive", title:"Mapping a Target's Full API Surface from JS Bundles",         excerpt:"How to surface every REST and GraphQL endpoint embedded in minified frontend code automatically.",        date:"Mar 2025", read:"8 min" },
  { cat:"Technique", title:"Recursive Crawling Strategies for Modern SPAs",                excerpt:"Single-page apps lazy-load routes and assets. Here's how to intercept them all before they slip past.", date:"Feb 2025", read:"6 min" },
  { cat:"OSINT",     title:"What a Website's Source Code Reveals About Its Stack",         excerpt:"Framework fingerprinting, CDN detection, dependency graphs, and version leakage — a field guide.",      date:"Jan 2025", read:"10 min" },
];

export function BlogSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });

  return (
    <section className="py-24 px-6" id="blog">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="pill mb-5"><Rss className="w-3 h-3" />Insights</div>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white leading-tight">
              From the <span className="gt">field notes</span>
            </h2>
          </div>
          <a href="/blog" className="btn-ghost shrink-0 self-start sm:self-auto">
            All articles <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity:0, y:24 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.5, delay:i*0.08 }}
              className="card card-hover p-6 flex flex-col group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="pill text-[10px]">{p.cat}</span>
                <span className="mono text-[11px] text-neutral-600">{p.read} read</span>
              </div>
              <h3 className="font-display font-bold text-white text-[0.95rem] leading-snug mb-3 group-hover:text-[#00c9a7] transition-colors flex-1">
                {p.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-5">{p.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] text-neutral-700">{p.date}</span>
                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-[#00c9a7] group-hover:translate-x-1 transition-all" />
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
  const inView = useInView(ref, { once:true, margin:"-60px" });

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,201,167,0.06) 0%, transparent 70%)" }}
      />
      <div className="relative max-w-3xl mx-auto text-center" ref={ref}>
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.6 }}
        >
          <div className="pill mb-7 mx-auto w-fit">
            <span className="dot-live" />
            Ready to extract?
          </div>
          <h2 className="font-display font-black text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Paste a URL.<br /><span className="gt">Get the source.</span>
          </h2>
          <p className="text-neutral-400 text-xl mb-10 leading-relaxed">
            No sign-up required. Works on any public website. Free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link href="/dashboard" className="btn-prime text-base px-8 py-3.5">
              <span className="dot-live" />
              Launch SourcePull
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="/docs" className="btn-ghost text-base px-8 py-3.5">
              <BookOpen className="w-4 h-4" />
              Read the Docs
            </a>
          </div>

          {/* Developer credit */}
          <div className="card p-5 inline-flex flex-col sm:flex-row items-center gap-5">
            <div className="text-center sm:text-left">
              <div className="label-mono mb-1">built by</div>
              <div className="font-display font-bold text-white text-lg">Akarsh</div>
            </div>
            <div className="h-px sm:h-8 w-8 sm:w-px bg-white/[0.08]" />
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/akarshxs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group"
              >
                <Github className="w-4 h-4 group-hover:text-[#00c9a7] transition-colors" />
                @akarshxs
              </a>
              <span className="text-neutral-700">·</span>
              <a
                href="https://instagram.com/akarshxs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group"
              >
                <Instagram className="w-4 h-4 group-hover:text-[#00c9a7] transition-colors" />
                @akarshxs
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BlogSection;
