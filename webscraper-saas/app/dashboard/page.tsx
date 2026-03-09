"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, ArrowLeft, Play, Download, Globe, AlertCircle,
  Loader2, Settings2, ChevronDown, CheckCircle2, XCircle,
  Clock, FileArchive, Layers, Cpu, ImageIcon, Code2, FileCode,
} from "lucide-react";

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
  "https://example.com",
  "https://stripe.com",
  "https://vercel.com",
  "https://tailwindcss.com",
];

export default function DashboardPage() {
  const [url, setUrl]             = useState("");
  const [depth, setDepth]         = useState(2);
  const [pages, setPages]         = useState(20);
  const [status, setStatus]       = useState<Status>("idle");
  const [logs, setLogs]           = useState<LogEntry[]>([]);
  const [stats, setStats]         = useState<Stats | null>(null);
  const [zipBlob, setZipBlob]     = useState<{ blob: Blob; name: string; sizeKb: number } | null>(null);
  const [showOpts, setShowOpts]   = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const logRef                    = useRef<HTMLDivElement>(null);
  const timerRef                  = useRef<ReturnType<typeof setInterval>>();

  const addLog = useCallback((text: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [...prev, { text, type }]);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  // Elapsed timer
  useEffect(() => {
    if (status === "running") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  async function startScan() {
    const trimmed = url.trim();
    if (!trimmed || status === "running") return;

    const target = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

    setStatus("running");
    setLogs([]);
    setStats(null);
    setZipBlob(null);

    const ts = () => `[${new Date().toLocaleTimeString()}]`;

    addLog(`${ts()}  Target    →  ${target}`, "info");
    addLog(`${ts()}  Config    →  depth=${depth}  max_pages=${pages}`, "info");
    addLog(`${ts()}  Checking sitemap & resolving DNS...`, "info");

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

      // Show server-side log lines in the console
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
      addLog(`${ts()}  ✓ Packaging ZIP...`, "success");
      addLog(
        `${ts()}  ✓ Done — ${s.pages} pages · ${totalAssets} assets · ${s.apis} APIs · ${s.errors} errors`,
        "success"
      );

      setStats(s);

      // Decode base64 ZIP → Blob entirely in the browser.
      // This is the fix for Vercel: no separate /api/download call needed,
      // so /tmp being wiped between invocations is irrelevant.
      if (data.zipBase64) {
        const byteChars = atob(data.zipBase64);
        const byteArr = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
        const blob = new Blob([byteArr], { type: "application/zip" });
        setZipBlob({ blob, name: data.zipName ?? "source.zip", sizeKb: data.zipSizeKb ?? 0 });
      }

      setStatus("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      addLog(`${new Date().toLocaleTimeString()}  ✗  ${msg}`, "error");
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setLogs([]);
    setStats(null);
    setZipBlob(null);
    setElapsed(0);
    setUrl("");
  }

  const statusMeta = {
    idle:    { dot: "bg-neutral-700",                        text: "text-neutral-600", label: "idle" },
    running: { dot: "bg-[#00c9a7] animate-pulse",            text: "text-[#00c9a7]",  label: `scanning  ${elapsed}s` },
    done:    { dot: "bg-[#22c55e]",                          text: "text-[#22c55e]",  label: "complete" },
    error:   { dot: "bg-red-400",                            text: "text-red-400",    label: "error" },
  }[status];

  const totalAssets = stats ? stats.images + stats.scripts + stats.styles + stats.fonts : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200">

      {/* ── Topbar ── */}
      <div className="border-b border-white/[0.07] px-6">
        <div className="max-w-7xl mx-auto h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md bg-[#111] border border-white/[0.08] flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-[#00c9a7]" strokeWidth={1.5} />
            </div>
            <span className="font-display font-black text-[0.9rem] text-white">
              Source<span className="text-[#00c9a7]">Pull</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className={`hidden sm:flex items-center gap-1.5 mono text-[11px] ${statusMeta.text}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
              {statusMeta.label}
            </div>
            {status === "running" && (
              <div className="hidden sm:flex items-center gap-1.5 mono text-[11px] text-neutral-600">
                <Clock className="w-3 h-3" />
                {elapsed}s
              </div>
            )}
            <Link href="/" className="btn-ghost text-[0.8rem] py-1.5 px-3">
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-7">
          <h1 className="font-display font-black text-3xl text-white mb-1">Extraction Dashboard</h1>
          <p className="text-neutral-500 text-sm">
            Enter a URL, configure crawl options, and download the complete source package.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5">

          {/* ─── Left panel ─── */}
          <div className="space-y-4">

            {/* URL input */}
            <div className="card p-5">
              <label className="label-mono mb-3 block">Target URL</label>
              <div className="flex items-center gap-2 bg-[#111] border border-white/[0.08] rounded-lg px-3.5 py-2.5 focus-within:border-[rgba(0,201,167,0.35)] transition-colors mb-3">
                <Globe className="w-4 h-4 text-neutral-600 shrink-0" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startScan()}
                  placeholder="https://example.com"
                  className="bg-transparent text-sm text-white placeholder-neutral-700 outline-none flex-1 mono"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              {/* Quick picks */}
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map((u) => (
                  <button
                    key={u}
                    onClick={() => setUrl(u)}
                    className="mono text-[10px] px-2 py-1 rounded border border-white/[0.06] text-neutral-700 hover:text-neutral-300 hover:border-white/[0.15] transition-all"
                  >
                    {u.replace("https://", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Options accordion */}
            <div className="card overflow-hidden">
              <button
                onClick={() => setShowOpts(!showOpts)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-neutral-600" />
                  <span className="text-sm font-semibold text-white">Options</span>
                  <span className="mono text-[10px] text-neutral-600 ml-1">depth={depth} · pages={pages}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-600 transition-transform ${showOpts ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showOpts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-5 border-t border-white/[0.05] pt-4">
                      {/* Depth slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-neutral-400">Crawl Depth</span>
                          <span className="mono text-sm text-[#00c9a7]">{depth}</span>
                        </div>
                        <input
                          type="range" min={1} max={4} value={depth}
                          onChange={(e) => setDepth(+e.target.value)}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-1.5 px-0.5">
                          {["Shallow","","","Deep"].map((l, i) => (
                            <span key={i} className="mono text-[9px] text-neutral-700">{l || (i+1)}</span>
                          ))}
                        </div>
                      </div>

                      {/* Pages slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-neutral-400">Max Pages</span>
                          <span className="mono text-sm text-[#00c9a7]">{pages}</span>
                        </div>
                        <input
                          type="range" min={5} max={100} step={5}
                          value={pages} onChange={(e) => setPages(+e.target.value)}
                          className="w-full"
                        />
                      </div>

                      {/* Info note */}
                      <div className="bg-[#111] rounded-lg p-3">
                        <p className="text-[11px] text-neutral-600 leading-relaxed">
                          Higher depth and more pages = longer extraction time. Start with defaults for most sites.
                          Vercel free tier has a 60s function limit.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Start button */}
            <motion.button
              onClick={startScan}
              disabled={status === "running" || !url.trim()}
              className="btn-prime w-full justify-center py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={{ scale: status !== "running" && url.trim() ? 1.01 : 1 }}
              whileTap={{ scale: 0.99 }}
            >
              {status === "running" ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Scanning ({elapsed}s)...</>
              ) : (
                <><Play className="w-4 h-4" />Start Extraction</>
              )}
            </motion.button>

            {/* Reset */}
            {(status === "done" || status === "error") && (
              <button onClick={reset} className="btn-ghost w-full justify-center text-sm py-3">
                ↺  New Scan
              </button>
            )}

            {/* Download button — uses Blob URL so it works on Vercel (no /tmp dependency) */}
            <AnimatePresence>
              {zipBlob && (
                <motion.button
                  onClick={() => {
                    const objectUrl = URL.createObjectURL(zipBlob.blob);
                    const a = document.createElement("a");
                    a.href = objectUrl;
                    a.download = zipBlob.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-bold text-sm text-[#0a0a0a]"
                  style={{ background: "#22c55e" }}
                  whileHover={{ scale: 1.01, boxShadow: "0 8px 24px rgba(34,197,94,0.35)" }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Download className="w-4 h-4" />
                  Download {zipBlob.name}
                  <span className="opacity-60 font-normal text-xs">({zipBlob.sizeKb} KB)</span>
                  <FileArchive className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Stats breakdown */}
            <AnimatePresence>
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-5"
                >
                  <div className="label-mono mb-4 block">Extraction Results</div>
                  <div className="space-y-2.5">
                    {[
                      { icon: Globe,     label: "Pages",   val: stats.pages,   color: "#00c9a7" },
                      { icon: ImageIcon, label: "Images",  val: stats.images,  color: "#a78bfa" },
                      { icon: Code2,     label: "Scripts", val: stats.scripts, color: "#f59e0b" },
                      { icon: FileCode,  label: "Styles",  val: stats.styles,  color: "#38bdf8" },
                      { icon: Cpu,       label: "APIs",    val: stats.apis,    color: "#00c9a7" },
                      { icon: AlertCircle, label: "Errors", val: stats.errors, color: "#ef4444" },
                    ].map(({ icon: Icon, label, val, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" style={{ color }} />
                          <span className="text-sm text-neutral-400">{label}</span>
                        </div>
                        <span className="mono text-sm font-bold text-white">{val}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/[0.06] pt-2.5 flex justify-between">
                      <span className="text-sm font-semibold text-neutral-300">Total assets</span>
                      <span className="mono text-sm font-bold text-white">{totalAssets}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error banner */}
            {status === "error" && (
              <div className="card p-4 flex items-start gap-3" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}>
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 leading-relaxed">
                  Extraction failed. Some sites block crawlers (Cloudflare protection, auth walls).
                  Check the log for details.
                </p>
              </div>
            )}
          </div>

          {/* ─── Right panel — terminal ─── */}
          <div className="terminal flex flex-col" style={{ minHeight: 520 }}>
            {/* Chrome bar */}
            <div className="terminal-bar shrink-0">
              <div className="terminal-dots">
                <div className="td td-r" />
                <div className="td td-y" />
                <div className="td td-g" />
              </div>
              <span className="mono text-[11px] text-neutral-600 tracking-wide">crawler output</span>
              <div className={`flex items-center gap-1.5 mono text-[11px] ${statusMeta.text}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                {statusMeta.label}
              </div>
            </div>

            {/* Log output */}
            <div
              ref={logRef}
              className="flex-1 p-5 overflow-y-auto mono text-[11.5px] leading-relaxed space-y-1 bg-[#0c0c0c]"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#1e1e1e transparent" }}
            >
              {logs.length === 0 ? (
                <div className="text-neutral-700">
                  <p>$ SourcePull crawler ready.</p>
                  <p className="mt-1">$ Enter a URL above and press Start Extraction.</p>
                  <p className="mt-1">$ The full crawl log will appear here in real time.</p>
                  <span className="inline-block mt-2 animate-blink">█</span>
                </div>
              ) : (
                logs.map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.1 }}
                    className={
                      l.type === "success" ? "text-[#22c55e]" :
                      l.type === "error"   ? "text-red-400" :
                      l.type === "warn"    ? "text-amber-400" :
                      "text-neutral-500"
                    }
                  >
                    {l.text}
                  </motion.div>
                ))
              )}
              {status === "running" && (
                <div className="text-[#00c9a7] animate-blink">█</div>
              )}
            </div>

            {/* Status bar */}
            <div className="shrink-0 border-t border-white/[0.05] bg-[#0e0e0e] px-5 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-1">
              {status === "idle" && (
                <span className="mono text-[11px] text-neutral-700">Awaiting input</span>
              )}
              {status === "running" && (
                <div className="flex items-center gap-2 text-[#00c9a7]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="mono text-[11px]">Running… {elapsed}s elapsed</span>
                </div>
              )}
              {status === "done" && (
                <>
                  <div className="flex items-center gap-2 text-[#22c55e]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="mono text-[11px]">Complete in {elapsed}s</span>
                  </div>
                  {stats && (
                    <span className="mono text-[11px] text-neutral-600">
                      {stats.pages} pages · {totalAssets} assets · {stats.apis} APIs
                    </span>
                  )}
                </>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-3.5 h-3.5" />
                  <span className="mono text-[11px]">Failed after {elapsed}s — see log</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
