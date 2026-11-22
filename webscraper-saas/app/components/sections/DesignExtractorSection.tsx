"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles, Layers, Download, CheckCircle2, Copy, Check,
  ExternalLink, ArrowRight, ShieldCheck, Terminal, Cpu, FileText,
  Globe, Loader2, Play
} from "lucide-react";

const pipelineSteps = [
  {
    step: "01",
    name: "MULTIPLE PAGE CRAWL",
    desc: "Follows internal routes across the target site, opening and harvesting HTML and stylesheet assets from every page.",
    badge: "BFS DOM TRAVERSAL"
  },
  {
    step: "02",
    name: "TOKEN HARVESTING",
    desc: "Scans DOM elements and CSS across all visited pages to extract palette hexes, font stacks, font scales, border radiuses, and spacing.",
    badge: "MULTI-PAGE SYNTHESIS"
  },
  {
    step: "03",
    name: "AI PROFILING & CONTEXT",
    desc: "Infers brand architecture, component density, and visual hierarchy from aggregated heading tags, CTA buttons, and form layouts.",
    badge: "SEMANTIC AGGREGATION"
  },
  {
    step: "04",
    name: "COMBINED BLUEPRINT ASSEMBLY",
    desc: "Generates one unified, comprehensive DESIGN.md specification and SKILL.md agent config representing the entire target site.",
    badge: "COMBINED BLUEPRINT"
  },
  {
    step: "05",
    name: "ONE-CLICK EXPORT",
    desc: "Instant download as standalone markdown files or pre-packaged into source.zip for Claude Code, Codex, and Cursor.",
    badge: "READY TO DEPLOY"
  }
];

const sampleDefaultDesignMd = `# FERRARI EDITORIAL DESIGN SPECIFICATION
Extracted by Web CRAWLer // DESIGN.md Extractor Engine
Target: https://ferrari.com
Pages Crawled & Analyzed: 34
Generated: 2026-11-22T10:00:00.000Z

## Mission
Provide an authoritative, implementation-ready design system specification extracted from all active pages of ferrari.com. Optimized for frontend code generation with Claude Code, OpenAI Codex, and Cursor IDE.

## Brand & Context
- Target URL: https://ferrari.com
- Primary Domain: ferrari.com
- Visual Style: Near-black cinematic canvas (#181818) with pure white display type
- Single Brand Voltage: Rosso Corsa (#da291c)

## Color Palette
- Primary Brand Accent: \`#da291c\` (Rosso Corsa)
- Canvas Background: \`#181818\` (Near-black)
- Canvas Elevated / Cards: \`#303030\`
- Ink (Primary Text): \`#ffffff\`
- Body Text: \`#969696\`
- Hairlines & Borders: \`#303030\`

## Typography Foundations
- Primary Font Stack: \`Inter, -apple-system, BlinkMacSystemFont, sans-serif\`
- Display Weight: 500 (Never bold)
- CTA Letter Spacing: 1.4px uppercase
- Nav Letter Spacing: 0.65px uppercase

## Shape & Border Radius
- Dominant Border Radius: \`0px\` (Sharp luxury-automotive precision across all CTAs & cards)

## Spacing & Grid System
- 8px Ladder: \`4px\`, \`8px\`, \`16px\`, \`24px\`, \`32px\`, \`48px\`, \`64px\`, \`96px\`, \`128px\`

## Sample CTAs & Action Tokens
- "DISCOVER THE MODEL"
- "START CONFIGURATION"
- "LAUNCH CONSOLE"
- "RACING RESULTS"
`;

const sampleDefaultSkillMd = `---
name: design-system-ferrari
description: Strictly applies the extracted Ferrari design system guidelines, color tokens, and components when writing frontend code.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Ferrari Design System Guidelines

Apply this design system when authoring HTML, React, or Tailwind components:

- Primary Accent: \`#da291c\` (Rosso Corsa)
- Canvas: \`#181818\`
- Font Family: \`Inter, sans-serif\`
- Border Radius: \`0px\` (Sharp corners on all buttons and cards)

## Quality Gates
- Use Rosso Corsa (#da291c) scarcely on primary CTAs only.
- Every button must have sharp 0px corners and uppercase 1.4px letter-spacing.
- Display text weight must stay at 500.

<!-- TYPEUI_SH_MANAGED_END -->
`;

export default function DesignExtractorSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeTab, setActiveTab] = useState<"design" | "skill">("design");
  const [copied, setCopied] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedDesign, setExtractedDesign] = useState(sampleDefaultDesignMd);
  const [extractedSkill, setExtractedSkill] = useState(sampleDefaultSkillMd);
  const [extractStatus, setExtractStatus] = useState<string | null>(null);
  const [agentToast, setAgentToast] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === "design" ? extractedDesign : extractedSkill);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openAgentUrl = (agent: "claude" | "codex" | "cursor") => {
    const content = activeTab === "skill" ? extractedSkill : extractedDesign;
    navigator.clipboard.writeText(content);
    const names = { claude: "CLAUDE CODE", codex: "OPENAI CODEX", cursor: "CURSOR IDE" };
    setAgentToast(`✓ Copied design tokens to clipboard! Opening ${names[agent]}...`);
    setTimeout(() => setAgentToast(null), 3500);

    const urls = {
      claude: "https://claude.ai/new",
      codex: "https://chatgpt.com",
      cursor: "https://cursor.com",
    };
    window.open(urls[agent], "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    const text = activeTab === "design" ? extractedDesign : extractedSkill;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeTab === "design" ? "DESIGN.md" : "SKILL.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const runLiveExtraction = async () => {
    const target = inputUrl.trim();
    if (!target) return;
    setIsExtracting(true);
    setExtractStatus("Connecting to target site and crawling pages...");

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target, maxDepth: 2, maxPages: 10 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Extraction failed");
      }

      if (data.designMd) setExtractedDesign(data.designMd);
      if (data.skillMd) setExtractedSkill(data.skillMd);
      setExtractStatus(`✓ Extracted combined design system from ${data.stats?.pages || "all"} pages!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Extraction failed";
      setExtractStatus(`✗ ${msg} — using preview tokens`);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <section id="design-extractor" className="relative py-28 px-6 bg-[#181818] border-t border-[#303030]">
      <div className="max-w-7xl mx-auto" ref={ref}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="pill mb-4 mx-auto w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#da291c]" />
            BUILT-IN EXTRACTION ENGINE
          </div>
          <h2 className="font-display font-medium text-4xl lg:text-5xl text-white uppercase tracking-[-1.12px] mb-4">
            EXTRACT ANY SITE'S <br />
            <span className="gt-red font-bold">DESIGN.MD & SKILL.MD</span>
          </h2>
          <p className="text-[#969696] text-base lg:text-lg leading-relaxed">
            Crawls all pages of the target site, extracts design tokens, and outputs a combined, production-ready <strong className="text-white">DESIGN.md</strong> and <strong className="text-white">SKILL.md</strong> specification ready for Claude Code, OpenAI Codex, and Cursor.
          </p>
        </motion.div>

        {/* Live URL Extraction Bar */}
        <div className="max-w-3xl mx-auto mb-14">
          <div className="card p-2 bg-[#202020] border-[#303030] flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-3 bg-[#181818] border border-[#303030] px-4 py-3 flex-1">
              <Globe className="w-4 h-4 text-[#da291c] shrink-0" />
              <input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runLiveExtraction()}
                placeholder="https://ferrari.com (or any target site)"
                className="bg-transparent text-sm text-white placeholder-[#666666] outline-none flex-1 mono"
              />
            </div>
            <button
              onClick={runLiveExtraction}
              disabled={isExtracting || !inputUrl.trim()}
              className="btn-prime py-3 px-6 text-xs whitespace-nowrap"
            >
              {isExtracting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-1" />CRAWLING SITE...</>
              ) : (
                <><Play className="w-4 h-4 mr-1 fill-current" />EXTRACT DESIGN SYSTEM</>
              )}
            </button>
          </div>
          {extractStatus && (
            <div className="text-xs font-mono mt-2 text-center text-[#da291c]">
              {extractStatus}
            </div>
          )}
        </div>

        {/* 2-Column Split: Pipeline Architecture & Interactive Code Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">

          {/* Left: 5-Step Pipeline Architecture */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-[11px] font-mono tracking-[1.4px] text-[#666666] uppercase mb-4">
              // MULTI-PAGE EXTRACTION PIPELINE
            </div>

            {pipelineSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="card p-5 bg-[#202020] border-[#303030] hover:border-[#da291c] transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#da291c]">{step.step}</span>
                    <h3 className="font-display font-semibold text-white text-[13px] tracking-[1px] uppercase group-hover:text-white transition-colors">
                      {step.name}
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono tracking-[1px] text-[#969696] border border-[#303030] px-2 py-0.5 uppercase bg-[#181818]">
                    {step.badge}
                  </span>
                </div>
                <p className="text-xs text-[#969696] mt-2.5 leading-relaxed pl-7">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right: Live Interactive Code Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="text-[11px] font-mono tracking-[1.4px] text-[#666666] uppercase mb-4">
              // COMBINED TARGET BLUEPRINT ARTIFACT
            </div>

            <div className="terminal border border-[#303030] bg-[#181818]">
              {/* Terminal Chrome with Tab Controls */}
              <div className="terminal-bar bg-[#202020] border-b border-[#303030]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("design")}
                    className={`text-xs font-mono tracking-[1px] px-3 py-1.5 uppercase transition-all ${activeTab === "design"
                      ? "bg-[#da291c] text-white font-bold"
                      : "text-[#969696] hover:text-white"
                      }`}
                  >
                    DESIGN.MD
                  </button>
                  <button
                    onClick={() => setActiveTab("skill")}
                    className={`text-xs font-mono tracking-[1px] px-3 py-1.5 uppercase transition-all ${activeTab === "skill"
                      ? "bg-[#da291c] text-white font-bold"
                      : "text-[#969696] hover:text-white"
                      }`}
                  >
                    SKILL.MD
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[11px] font-mono text-[#969696] hover:text-white border border-[#303030] px-2.5 py-1 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#03904a]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "COPIED" : "COPY"}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 text-[11px] font-mono text-white bg-[#303030] hover:bg-[#da291c] px-2.5 py-1 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>SAVE</span>
                  </button>
                </div>
              </div>

              {/* Code Output Viewer */}
              <div suppressHydrationWarning className="p-6 h-[410px] overflow-y-auto font-mono text-[12px] text-[#dcdcdc] leading-relaxed bg-[#181818] whitespace-pre-wrap selection:bg-[#da291c]">
                {activeTab === "design" ? extractedDesign : extractedSkill}
              </div>

              {/* Quick Install Bar for AI coding platforms */}
              <div className="p-4 border-t border-[#303030] bg-[#202020] relative">
                {/* Toast Notification */}
                {agentToast && (
                  <div className="absolute -top-12 left-4 right-4 z-50 bg-[#181818] border border-[#da291c] px-4 py-2.5 shadow-2xl text-[11px] font-mono text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#da291c] shrink-0" />
                    <span className="truncate">{agentToast}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-mono tracking-[1.4px] text-[#666666] uppercase">
                    EXPORT FOR AI AGENTS
                  </div>
                  <span className="text-[9px] font-mono text-[#da291c]">COPIES PROMPT & OPENS APP</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openAgentUrl("claude")}
                    className="btn-ghost py-2 text-[11px] justify-center tracking-[1px] hover:border-[#da291c] hover:text-white flex items-center gap-1.5"
                  >
                    <span>CLAUDE CODE</span>
                    <ExternalLink className="w-3 h-3 text-[#da291c]" />
                  </button>
                  <button
                    onClick={() => openAgentUrl("codex")}
                    className="btn-ghost py-2 text-[11px] justify-center tracking-[1px] hover:border-[#da291c] hover:text-white flex items-center gap-1.5"
                  >
                    <span>OPENAI CODEX</span>
                    <ExternalLink className="w-3 h-3 text-[#da291c]" />
                  </button>
                  <button
                    onClick={() => openAgentUrl("cursor")}
                    className="btn-ghost py-2 text-[11px] justify-center tracking-[1px] hover:border-[#da291c] hover:text-white flex items-center gap-1.5"
                  >
                    <span>CURSOR IDE</span>
                    <ExternalLink className="w-3 h-3 text-[#da291c]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Feature highlight strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[#303030]">
          <div className="card p-6 bg-[#202020] border-[#303030]">
            <ShieldCheck className="w-6 h-6 text-[#da291c] mb-3" />
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-[1px] mb-2">
              ALL-PAGES RECONCILIATION
            </h4>
            <p className="text-xs text-[#969696] leading-relaxed">
              Crawls every discoverable subpage of the target site to prevent missed styles or isolated page exceptions.
            </p>
          </div>

          <div className="card p-6 bg-[#202020] border-[#303030]">
            <Cpu className="w-6 h-6 text-white mb-3" />
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-[1px] mb-2">
              COMBINED SYSTEM SYNTHESIS
            </h4>
            <p className="text-xs text-[#969696] leading-relaxed">
              Synthesizes colors, typography scales, and border radii into one cohesive DESIGN.md and SKILL.md ruleset.
            </p>
          </div>

          <div className="card p-6 bg-[#202020] border-[#303030]">
            <Terminal className="w-6 h-6 text-[#da291c] mb-3" />
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-[1px] mb-2">
              PACKAGED INSIDE SOURCE.ZIP
            </h4>
            <p className="text-xs text-[#969696] leading-relaxed">
              Included automatically inside the downloaded source.zip root and design_system/ subfolder.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
