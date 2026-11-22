"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, ArrowLeft, Play, Download, Globe, AlertCircle,
  Loader2, Settings2, ChevronDown, CheckCircle2, XCircle,
  Clock, FileArchive, Layers, Cpu, ImageIcon, Code2, FileCode,
  Sparkles, FileText, Share2, ExternalLink, Check, Copy
} from "lucide-react";
import TubesBackground from "../components/ui/TubesBackground";

type Status = "idle" | "running" | "done" | "error";

interface Stats {
  pages: number;
  images: number;
  scripts: number;
  styles: number;
  fonts: number;
  apis: number;
  errors: number;
}

interface LogEntry {
  text: string;
  type: "info" | "success" | "warn" | "error";
}

const EXAMPLES = [
  "https://ferrari.com",
  "https://stripe.com",
  "https://vercel.com",
  "https://linear.app",
];

export default function DashboardPage() {
  const [url, setUrl]             = useState("");
  const [depth, setDepth]         = useState(2);
  const [pages, setPages]         = useState(15);
  const [status, setStatus]       = useState<Status>("idle");
  const [logs, setLogs]           = useState<LogEntry[]>([]);
  const [stats, setStats]         = useState<Stats | null>(null);
  const [zipBlob, setZipBlob]     = useState<{ blob: Blob; name: string; sizeKb: number } | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [designZipBlob, setDesignZipBlob] = useState<{ blob: Blob; name: string } | null>(null);
  const [skillZipBlob, setSkillZipBlob] = useState<{ blob: Blob; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"console" | "design" | "skill">("console");
  const [extractedDesignMd, setExtractedDesignMd] = useState<string>("");
  const [extractedSkillMd, setExtractedSkillMd] = useState<string>("");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState("STANDBY");
  const [agentToast, setAgentToast] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showOpts, setShowOpts]   = useState(false);
  const [elapsed, setElapsed]     = useState(0);

  const logRef                    = useRef<HTMLDivElement>(null);
  const timerRef                  = useRef<ReturnType<typeof setInterval>>();
  const progressTimerRef          = useRef<ReturnType<typeof setInterval>>();

  const addLog = useCallback((text: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [...prev, { text, type }]);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (status === "running") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const triggerDownload = (urlToUse?: string) => {
    const finalUrl = urlToUse || downloadUrl;
    if (finalUrl) {
  const downloadZip = (targetObj?: { blob: Blob; name: string } | null) => {
    const toUse = targetObj || zipBlob;
    if (toUse) {
      const objectUrl = URL.createObjectURL(toUse.blob);
      const a = document.createElement("a");
      a.href = finalUrl;
      a.download = zipBlob?.name || "source.zip";
      a.href = objectUrl;
      a.download = toUse.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
      return;
    }
    if (zipBlob) {
      const objectUrl = URL.createObjectURL(zipBlob.blob);
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = zipBlob.name;
      a.href = downloadUrl;
      a.download = "source.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    }
  };

  const openAgentUrl = (agent: "claude" | "codex" | "cursor") => {
    const content = activeTab === "skill" ? extractedSkillMd : extractedDesignMd || "/* Extracted design system */";
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

  const handleCopyCode = () => {
    const content = activeTab === "skill" ? extractedSkillMd : extractedDesignMd;
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  async function startScan() {
    const trimmed = url.trim();
    if (!trimmed || status === "running") return;

    const target = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

    setStatus("running");
    setLogs([]);
    setStats(null);
    setZipBlob(null);
    setDownloadUrl(null);
    setDesignZipBlob(null);
    setSkillZipBlob(null);
    setActiveTab("console");

    // Dynamic live progress simulation
    setScanProgress(10);
    setScanPhase("PHASE 1: PROBING ORIGIN DNS & PROTOCOL");

    let currentP = 10;
    progressTimerRef.current = setInterval(() => {
      currentP += Math.floor(Math.random() * 9) + 4;
      if (currentP > 94) currentP = 94;
      setScanProgress(currentP);

      if (currentP > 78) {
        setScanPhase("PHASE 4: SYNTHESIZING DESIGN.MD & SKILL.MD");
      } else if (currentP > 52) {
        setScanPhase("PHASE 3: HARVESTING STYLESHEETS & ASSET CHUNKS");
      } else if (currentP > 24) {
        setScanPhase("PHASE 2: RECURSIVE BFS ROUTE HARVESTING");
      }
    }, 500);

    const ts = () => `[${new Date().toLocaleTimeString()}]`;

    addLog(`${ts()}  TARGET       →  ${target}`, "info");
    addLog(`${ts()}  CONFIG       →  depth=${depth}  max_pages=${pages}`, "info");
    addLog(`${ts()}  DNS RESOLVE  →  Connecting to origin node...`, "info");

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target, maxDepth: depth, maxPages: pages }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Extraction failed");
      }

      if (Array.isArray(data.logLines) && data.logLines.length > 0) {
        for (const line of data.logLines as string[]) {
          const type: LogEntry["type"] =
            line.startsWith("✓") ? "success" :
            line.startsWith("✗") ? "error" :
            line.startsWith("!") ? "warn" : "info";
          addLog(`${ts()}  ${line}`, type);
        }
      }

      const s: Stats = {
        pages:   data.stats.pages   ?? 0,
        images:  data.stats.images  ?? 0,
        scripts: data.stats.scripts ?? 0,
        styles:  data.stats.styles  ?? 0,
        fonts:   data.stats.fonts   ?? 0,
        apis:    data.stats.apis    ?? 0,
        errors:  data.stats.errors  ?? 0,
      };

      const totalAssets = s.images + s.scripts + s.styles + s.fonts;
      addLog(`${ts()}  ✓ Packaging full source tree into archive...`, "success");
      addLog(`${ts()}  ★ Generated combined DESIGN.md & SKILL.md specs...`, "success");
      addLog(
        `${ts()}  ✓ Complete — ${s.pages} pages · ${totalAssets} assets · ${s.apis} APIs`,
        "success"
      );

      setStats(s);

      // Stop simulated progress and lock at 100%
      clearInterval(progressTimerRef.current);
      setScanProgress(100);
      setScanPhase("PHASE 5: COMPILATION COMPLETE // ZIP READY");

      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
      }

      let createdZipBlob: { blob: Blob; name: string; sizeKb: number } | null = null;
      if (data.zipBase64) {
        try {
          const byteChars = atob(data.zipBase64);
          const byteArr = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
          const blob = new Blob([byteArr], { type: "application/zip" });
          setZipBlob({ blob, name: data.zipName ?? "source.zip", sizeKb: data.zipSizeKb ?? 0 });
        } catch {
          // Fall back to direct downloadUrl
          const sliceSize = 1024 * 512;
          const byteArrays: Uint8Array[] = [];
          for (let offset = 0; offset < byteChars.length; offset += sliceSize) {
            const slice = byteChars.slice(offset, offset + sliceSize);
            const byteNumbers = new Uint8Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(byteNumbers);
          }
          const blob = new Blob(byteArrays, { type: "application/zip" });
          createdZipBlob = { blob, name: data.zipName ?? "source.zip", sizeKb: data.zipSizeKb ?? 0 };
          setZipBlob(createdZipBlob);
        } catch (e) {
          console.error("Base64 to blob conversion failed:", e);
        }
      }

      // Save extracted DESIGN.md & SKILL.md
      const domainName = target.replace(/https?:\/\//, '').replace(/\/.*$/, '').replace(/[^a-z0-9]+/gi, '_');
      if (data.designMd) {
        setExtractedDesignMd(data.designMd);
        const designBlob = new Blob([data.designMd], { type: "text/markdown" });
        setDesignZipBlob({ blob: designBlob, name: `${domainName}_DESIGN.md` });
      }
      if (data.skillMd) {
        setExtractedSkillMd(data.skillMd);
        const skillBlob = new Blob([data.skillMd], { type: "text/markdown" });
        setSkillZipBlob({ blob: skillBlob, name: `${domainName}_SKILL.md` });
      }

      setStatus("done");

      // Auto-trigger the download
      setTimeout(() => {
        triggerDownload(data.downloadUrl);
      }, 600);
      // Auto-trigger the download directly from in-memory Blob (safe on Vercel/serverless!)
      if (createdZipBlob) {
        setTimeout(() => {
          downloadZip(createdZipBlob);
        }, 500);
      } else if (data.downloadUrl) {
        setTimeout(() => {
          downloadZip();
        }, 500);
      }

    } catch (err: unknown) {
      clearInterval(progressTimerRef.current);
      setScanProgress(0);
      setScanPhase("ORIGIN BLOCKED OR TIMEOUT");
      const msg = err instanceof Error ? err.message : "Extraction failed";
      addLog(`${new Date().toLocaleTimeString()}  ✗  ${msg}`, "error");
      setStatus("error");
    }
  }

  function reset() {
    clearInterval(progressTimerRef.current);
    setStatus("idle");
    setLogs([]);
    setStats(null);
    setZipBlob(null);
    setDownloadUrl(null);
    setDesignZipBlob(null);
    setSkillZipBlob(null);
    setScanProgress(0);
    setScanPhase("STANDBY");
    setElapsed(0);
    setUrl("");
  }

  const statusMeta = {
    idle:    { dot: "bg-[#666666]", text: "text-[#666666]", label: "STANDBY" },
    running: { dot: "bg-[#da291c] animate-pulse", text: "text-[#da291c]", label: `ACTIVE // ${elapsed}s` },
    done:    { dot: "bg-[#03904a]", text: "text-[#03904a]", label: "EXTRACTION COMPLETE" },
    error:   { dot: "bg-[#da291c]", text: "text-[#da291c]", label: "ORIGIN BLOCKED" },
  }[status];

  return (
    <div className="relative min-h-screen text-white bg-[#181818] overflow-hidden">

      {/* 3D Tubes background with Ferrari Rosso Corsa voltage */}
      <div className="fixed inset-0 z-0">
        <TubesBackground opacity={0.65} enableClickInteraction={true} />
      </div>

      {/* Atmospheric dark tint */}
      <div className="fixed inset-0 bg-[#181818]/80 pointer-events-none z-[1]" />

      {/* Toast Notification */}
      <AnimatePresence>
        {agentToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#202020] border border-[#da291c] px-6 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.9)] text-xs font-mono text-white flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-[#da291c]" />
            <span>{agentToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Topbar ── */}
      <div className="relative z-10 border-b border-[#303030] px-6 bg-[#181818]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-none bg-[#da291c] flex items-center justify-center">
              <span className="font-mono font-black text-white text-[13px]">WC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-medium text-[0.95rem] tracking-[1.4px] uppercase text-white">
                WEB <span className="text-[#da291c]">CRAWLER</span>
              </span>
              <span className="text-[9px] font-mono tracking-[1.5px] text-[#666666] uppercase">EXTRACTION ENGINE</span>
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <div className={`hidden sm:flex items-center gap-2 mono text-[11px] tracking-[1.2px] ${statusMeta.text}`}>
              <div className={`w-2 h-2 ${statusMeta.dot}`} />
              {statusMeta.label}
            </div>
            {status === "running" && (
              <div className="hidden sm:flex items-center gap-1.5 mono text-[11px] text-[#969696]">
                <Clock className="w-3.5 h-3.5 text-[#da291c]" />
                {elapsed}s
              </div>
            )}
            <Link href="/" className="btn-ghost text-[11px] py-2 px-4">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              BACK TO HOME
            </Link>
          </div>
        </div>
      </div>

      {/* ── Dashboard Body ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="pill mb-3">
            <span className="dot-accent" />
            CONSOLE V2.4 // HIGH-SPEED PIPELINE
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl uppercase tracking-[-0.8px] text-white">
            TARGET RECON & SYSTEM EXTRACTOR
          </h1>
          <p className="text-[#969696] text-sm mt-1 max-w-2xl">
            Input any public website endpoint. The high-speed crawler harvests HTML pages, CSS stylesheets, images, scripts, and exports a unified DESIGN.md + SKILL.md system in seconds.
          </p>
        </div>

        {/* ── Real-Time Animated Progress Bar Deck ── */}
        <div className="card p-5 mb-8 bg-[#202020] border-[#303030]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="mono text-xs font-bold text-[#da291c]">[{scanProgress}%]</span>
              <span className="text-xs font-mono tracking-[1px] text-white uppercase">{scanPhase}</span>
            </div>
            {status === "running" && (
              <span className="mono text-[11px] text-[#969696]">ELAPSED: {elapsed}S</span>
            )}
          </div>
          <div className="prog-track w-full h-[6px] bg-[#181818]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#9d2211] via-[#da291c] to-[#ff4136]"
              animate={{ width: `${scanProgress}%` }}
              transition={{ duration: 0.3 }}
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

          {/* Left Control Panel */}
          <div className="space-y-4 pointer-events-auto">

            {/* Target Input Card */}
            <div className="card p-6 bg-[#202020] border-[#303030]">
              <label className="label-mono mb-3 block text-white font-medium">TARGET DOMAIN URL</label>
              <div className="flex items-center gap-3 bg-[#181818] border border-[#303030] rounded-none px-4 py-3 focus-within:border-[#da291c] transition-colors mb-4">
                <Globe className="w-4 h-4 text-[#da291c] shrink-0" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startScan()}
                  placeholder="https://example.com"
                  className="bg-transparent text-sm text-white placeholder-[#666666] outline-none flex-1 mono"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              {/* Sample Targets */}
              <div className="label-mono text-[10px] mb-2 text-[#666666]">QUICK SELECT</div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((u) => (
                  <button
                    key={u}
                    onClick={() => setUrl(u)}
                    className="mono text-[10px] px-2.5 py-1.5 border border-[#303030] bg-[#181818] text-[#969696] hover:text-white hover:border-[#da291c] transition-all uppercase"
                  >
                    {u.replace("https://", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Crawl Parameters */}
            <div className="card bg-[#202020] border-[#303030]">
              <button
                onClick={() => setShowOpts(!showOpts)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#252525] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Settings2 className="w-4 h-4 text-[#da291c]" />
                  <span className="text-[13px] font-semibold text-white uppercase tracking-[1px]">CRAWLER OPTIONS</span>
                  <span className="mono text-[10px] text-[#969696]">D:{depth} · P:{pages}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#969696] transition-transform ${showOpts ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showOpts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden border-t border-[#303030]"
                  >
                    <div className="p-5 space-y-5 bg-[#181818]">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs uppercase font-mono text-[#969696]">RECURSIVE DEPTH</span>
                          <span className="mono text-xs font-bold text-[#da291c]">{depth}</span>
                        </div>
                        <input
                          type="range" min={1} max={3} value={depth}
                          onChange={(e) => setDepth(+e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs uppercase font-mono text-[#969696]">MAX PAGE LIMIT</span>
                          <span className="mono text-xs font-bold text-[#da291c]">{pages}</span>
                        </div>
                        <input
                          type="range" min={5} max={40} step={5}
                          value={pages} onChange={(e) => setPages(+e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Launch Primary CTA Button - Rosso Corsa, sharp corners, bold */}
            <motion.button
              onClick={startScan}
              disabled={status === "running" || !url.trim()}
              className="btn-prime w-full justify-center py-4 text-sm"
              whileHover={{ scale: status !== "running" && url.trim() ? 1.01 : 1 }}
              whileTap={{ scale: 0.99 }}
            >
              {status === "running" ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-1" />CRAWLING SITE ({scanProgress}%)...</>
              ) : (
                <><Play className="w-4 h-4 mr-1 fill-current" />START EXTRACTION</>
              )}
            </motion.button>

            {/* Reset */}
            {(status === "done" || status === "error") && (
              <button onClick={reset} className="btn-ghost w-full justify-center text-xs py-3">
                ↺ RESET ENGINE
              </button>
            )}

            {/* Download Buttons - Sharp Rosso Corsa styling */}
            <AnimatePresence>
              {(downloadUrl || zipBlob) && (
                <div className="space-y-2">
                  <motion.button
                    onClick={() => triggerDownload()}
                    onClick={() => downloadZip()}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 w-full py-4 text-xs font-bold text-white bg-[#da291c] hover:bg-[#b01e0a] transition-all uppercase tracking-[1.4px]"
                  >
                    <Download className="w-4 h-4" />
                    DOWNLOAD SOURCE.ZIP {zipBlob?.sizeKb ? `(${zipBlob.sizeKb} KB)` : ""}
                    <FileArchive className="w-4 h-4 ml-1" />
                  </motion.button>

                  {designZipBlob && (
                    <motion.button
                      onClick={() => {
                        const objectUrl = URL.createObjectURL(designZipBlob.blob);
                        const a = document.createElement("a");
                        a.href = objectUrl;
                        a.download = designZipBlob.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
                      }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-2 w-full py-3 text-xs font-bold text-white border border-[#303030] bg-[#242424] hover:border-white transition-all uppercase tracking-[1.4px]"
                    >
                      <FileText className="w-4 h-4 text-[#da291c]" />
                      DOWNLOAD DESIGN.MD SPEC
                    </motion.button>
                  )}

                  {skillZipBlob && (
                    <motion.button
                      onClick={() => {
                        const objectUrl = URL.createObjectURL(skillZipBlob.blob);
                        const a = document.createElement("a");
                        a.href = objectUrl;
                        a.download = skillZipBlob.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
                      }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-2 w-full py-3 text-xs font-bold text-white border border-[#303030] bg-[#242424] hover:border-white transition-all uppercase tracking-[1.4px]"
                    >
                      <Sparkles className="w-4 h-4 text-[#da291c]" />
                      DOWNLOAD SKILL.MD AGENT RULESET
                    </motion.button>
                  )}

                  {/* Export Directly to AI Agent URL */}
                  <div className="card p-4 bg-[#202020] border-[#303030] mt-4">
                    <div className="text-[10px] font-mono tracking-[1.2px] text-[#666666] uppercase mb-2.5">
                      EXPORT TO AI AGENT (OPENS AGENT URL)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => openAgentUrl("claude")}
                        className="btn-ghost py-2.5 text-[10px] justify-center tracking-[1px] flex-col gap-1 hover:border-[#da291c]"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#da291c]" />
                        <span>CLAUDE</span>
                      </button>
                      <button
                        onClick={() => openAgentUrl("codex")}
                        className="btn-ghost py-2.5 text-[10px] justify-center tracking-[1px] flex-col gap-1 hover:border-[#da291c]"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#da291c]" />
                        <span>CODEX</span>
                      </button>
                      <button
                        onClick={() => openAgentUrl("cursor")}
                        className="btn-ghost py-2.5 text-[10px] justify-center tracking-[1px] flex-col gap-1 hover:border-[#da291c]"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#da291c]" />
                        <span>CURSOR</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Results breakdown */}
            <AnimatePresence>
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-5 bg-[#202020] border-[#303030]"
                >
                  <div className="label-mono mb-4 block text-white">EXTRACTION TELEMETRY</div>
                  <div className="space-y-3">
                    {[
                      { icon: Globe,     label: "Pages Crawled",  val: stats.pages,   color: "#ffffff" },
                      { icon: ImageIcon, label: "Images Scraped",  val: stats.images,  color: "#969696" },
                      { icon: Code2,     label: "Scripts Parsed", val: stats.scripts, color: "#da291c" },
                      { icon: FileCode,  label: "Stylesheets",    val: stats.styles,  color: "#ffffff" },
                      { icon: Cpu,       label: "API Endpoints",  val: stats.apis,    color: "#da291c" },
                    ].map(({ icon: Icon, label, val, color }) => (
                      <div key={label} className="flex items-center justify-between border-b border-[#303030] pb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" style={{ color }} />
                          <span className="text-xs text-[#969696] uppercase">{label}</span>
                        </div>
                        <span className="mono text-xs font-bold text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Console Terminal Panel */}
          <div className="terminal flex flex-col bg-[#181818] border-[#303030] shadow-[0_32px_64px_rgba(0,0,0,0.9)]" style={{ minHeight: 560 }}>
            <div className="terminal-bar bg-[#202020] border-b border-[#303030]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("console")}
                  className={`text-[11px] font-mono tracking-[1px] px-3 py-1.5 uppercase transition-all ${
                    activeTab === "console" ? "bg-[#da291c] text-white font-bold" : "text-[#969696] hover:text-white"
                  }`}
                >
                  CONSOLE
                </button>
                <button
                  onClick={() => setActiveTab("design")}
                  className={`text-[11px] font-mono tracking-[1px] px-3 py-1.5 uppercase transition-all ${
                    activeTab === "design" ? "bg-[#da291c] text-white font-bold" : "text-[#969696] hover:text-white"
                  }`}
                >
                  DESIGN.MD
                </button>
                <button
                  onClick={() => setActiveTab("skill")}
                  className={`text-[11px] font-mono tracking-[1px] px-3 py-1.5 uppercase transition-all ${
                    activeTab === "skill" ? "bg-[#da291c] text-white font-bold" : "text-[#969696] hover:text-white"
                  }`}
                >
                  SKILL.MD
                </button>
              </div>

              <div className="flex items-center gap-3">
                {activeTab !== "console" && (
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 text-[10px] font-mono text-[#969696] hover:text-white border border-[#303030] px-2.5 py-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#03904a]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "COPIED" : "COPY"}</span>
                  </button>
                )}
                <div className={`flex items-center gap-1.5 mono text-[11px] ${statusMeta.text}`}>
                  <div className={`w-2 h-2 ${statusMeta.dot}`} />
                  {statusMeta.label}
                </div>
              </div>
            </div>

            {/* Content Display */}
            {activeTab === "console" ? (
              <div
                ref={logRef}
                className="flex-1 p-6 overflow-y-auto mono text-[12px] leading-relaxed space-y-1.5 bg-[#181818]"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#303030 transparent" }}
              >
                {logs.length === 0 ? (
                  <div className="text-[#666666] space-y-2">
                    <p className="text-white font-medium">$ WEB CRAWLER ENGINE V2.4 READY</p>
                    <p>$ Enter a public endpoint above and trigger Start Extraction.</p>
                    <p>$ Complete directory reconstruction and tokenization will stream here.</p>
                    <span className="inline-block mt-3 text-[#da291c] animate-blink font-black">■</span>
                  </div>
                ) : (
                  logs.map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.1 }}
                      className={
                        l.type === "success" ? "text-white font-semibold" :
                        l.type === "error"   ? "text-[#da291c] font-bold" :
                        l.type === "warn"    ? "text-[#f6e500]" :
                        "text-[#969696]"
                      }
                    >
                      {l.text}
                    </motion.div>
                  ))
                )}
                {status === "running" && (
                  <div className="text-[#da291c] animate-blink">■</div>
                )}
              </div>
            ) : (
              <div className="flex-1 p-6 overflow-y-auto mono text-[12px] leading-relaxed text-[#dcdcdc] bg-[#181818] whitespace-pre-wrap selection:bg-[#da291c]">
                {activeTab === "design"
                  ? extractedDesignMd || "/* Run extraction above to generate combined DESIGN.md for all crawled pages */"
                  : extractedSkillMd || "/* Run extraction above to generate SKILL.md for AI coding agents */"}
              </div>
            )}

            {/* Bottom Status Hairline Bar */}
            <div className="shrink-0 border-t border-[#303030] bg-[#202020] px-6 py-3 flex items-center justify-between text-xs font-mono">
              <span className="text-[#969696]">STATUS: {statusMeta.label}</span>
              <span className="text-white">WEB CRAWLER // X VELOCITY PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
