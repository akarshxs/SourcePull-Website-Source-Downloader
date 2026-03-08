"use client";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag } from "lucide-react";
import Link from "next/link";

const posts = [
  {
    category: "Tutorial",
    title: "How to Extract Complete API Schemas from Any Web App",
    excerpt: "Modern SPAs expose their entire data model through network requests. Here's how to systematically capture every endpoint and response schema.",
    readTime: "8 min read",
    date: "Jun 12, 2025",
    gradient: "from-teal-500/10 to-blue-500/5",
    border: "border-teal-500/20",
  },
  {
    category: "OSINT",
    title: "Web Scraping for Security Research: A Legal & Ethical Guide",
    excerpt: "Understanding what's publicly accessible, what's protected, and how to conduct responsible web intelligence gathering without crossing legal lines.",
    readTime: "12 min read",
    date: "Jun 4, 2025",
    gradient: "from-blue-500/10 to-purple-500/5",
    border: "border-blue-500/20",
  },
  {
    category: "Deep Dive",
    title: "The Architecture Behind Fast, Polite Web Crawlers",
    excerpt: "Rate limiting, robots.txt parsing, session management, and distributed crawl queues — what it takes to build a production-grade crawler.",
    readTime: "15 min read",
    date: "May 27, 2025",
    gradient: "from-purple-500/10 to-pink-500/5",
    border: "border-purple-500/20",
  },
];

export function BlogSection() {
  return (
    <section className="relative py-28" id="blog">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <div className="section-label mb-5">Insights</div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tight">
              Learn web intelligence<br />
              <span className="text-slate-500">from practitioners</span>
            </h2>
          </div>
          <Link href="/blog" className="btn-ghost hidden md:flex">
            All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card glass-card-hover p-6 bg-gradient-to-br ${post.gradient} ${post.border} cursor-pointer group`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="section-label text-[10px]">
                  <Tag className="w-2.5 h-2.5" /> {post.category}
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-base leading-snug mb-3 group-hover:text-teal-300 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-950/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-500/8 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label mx-auto mb-6">Get Started Free</div>
          <h2 className="font-display text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.05]">
            Stop copying files by hand.<br />
            <span className="gradient-text">Let SourcePull do it.</span>
          </h2>
          <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Paste a URL, click extract, and have a complete source archive in under 30 seconds. No sign-up required to get started.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app" className="btn-primary text-base px-8 py-4">
              Start Downloading Source
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/docs" className="btn-ghost text-base px-7 py-4">
              Read the Docs
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-600">
            Free tier includes 10 scans/day · No credit card required · Open source core
          </p>
        </motion.div>
      </div>
    </section>
  );
}
