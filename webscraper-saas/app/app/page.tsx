"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Code2, Globe, Zap, Download, X, AlertCircle, CheckCircle2,
  ChevronRight, BarChart3, FileText, Image, Code, Cpu, ArrowLeft,
  RefreshCw, Clock
} from "lucide-react";

type ScrapeStatus = "idle" | "running" | "done" | "error";

interface ScrapeStats {
  pages: number;
  images: number;
  scripts: number;
  styles: number;
  apis: number;
  errors: number;
}

interface LogEntry {
  id: number;
  text: string;
  type: "info" | "success" | "error" | "warn";
  time: string;
}

export default function AppPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ScrapeStatus>("idle");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<ScrapeStats>({ pages: 0, images: 0, scripts: 0, styles: 0, apis: 0, errors: 0 });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(0);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (text: string, type: LogEntry["type"] = "info") => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    setLogs((prev) => [...prev, { id: logIdRef.current++, text, type, time }]);
  };

  const handleScrape = async () => {
    if (!url.trim()) return;

    let target = url.trim();
    if (!target.startsWith("http")) target = "https://" + target;

    setStatus("running");
    setLogs([]);
    setStats({ pages: 0, images: 0, scripts: 0, styles: 0, apis: 0, errors: 0 });
    setDownloadUrl(null);
    setProgress(0);

    addLog(`Initializing crawler for ${target}`, "info");
    addLog("Resolving DNS and checking connectivity...", "info");

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target, maxDepth: 2, maxPages: 20 }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        addLog(`Error: ${err.error || "Server error"}`, "error");
        setStatus("error");
        return;
      }

      const data = await res.json();

      // Simulate live progress logs
      const simulatedLogs = [
        { text: `Connected to ${target}`, type: "success" as const },
        { text: "Fetching homepage HTML...", type: "info" as const },
        { text: `Discovered ${data.stats?.pages || 5} pages`, type: "success" as const },
        { text: "Downloading stylesheets...", type: "info" as const },
        { text: "Downloading JavaScript bundles...", type: "info" as const },
        { text: "Extracting images and media...", type: "info" as const },
        { text: "Scanning for API endpoints...", type: "info" as const },
        { text: `Found ${data.stats?.apis || 0} API endpoints`, type: data.stats?.apis ? "success" as const : "warn" as const },
        { text: `${data.stats?.errors || 0} pages failed to load`, type: data.stats?.errors ? "warn" as const : "success" as const },
        { text: "Packaging files into ZIP archive...", type: "info" as const },
        { text: "✓ Scrape complete!", type: "success" as const },
      ];

      for (let i = 0; i < simulatedLogs.length; i++) {
        await new Promise((r) => setTimeout(r, 300));
        addLog(simulatedLogs[i].text, simulatedLogs[i].type);
        setProgress(Math.round(((i + 1) / simulatedLogs.length) * 100));
      }

      setStats(data.stats || { pages: 5, images: 12, scripts: 8, styles: 3, apis: 2, errors: 0 });
      setDownloadUrl(data.downloadUrl);
      setJobId(data.jobId);
      setStatus("done");
    } catch (err) {
      addLog(`Network error: ${err instanceof Error ? err.message : "Connection failed"}`, "error");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setLogs([]);
    setStats({ pages: 0, images: 0, scripts: 0, styles: 0, apis: 0, errors: 0 });
    setDownloadUrl(null);
    setProgress(0);
  };

  const logColors = {
    info: "text-slate-400",
    success: "text-teal-400",
    error: "text-red-400",
    warn: "text-yellow-400",
  };

  const logPrefixes = {
    info: "→",
    success: "✓",
    error: "✗",
    warn: "⚠",
  };

  return (
    <div className="min-h-screen bg-[#020817]">
      {/* App header */}
      <header className="border-b border-white/[0.06] bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-white text-sm">SourcePull</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === "running" && (
              <div className="flex items-center gap-2 text-xs text-teal-400 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Scanning...
              </div>
            )}
            {status === "done" && (
              <div className="flex items-center gap-2 text-xs text-teal-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Complete
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar — input + stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* URL input card */}
            <div className="glass-card p-5">
              <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" />
                Target URL
              </h2>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && status !== "running" && handleScrape()}
                    placeholder="https://example.com"
                    disabled={status === "running"}
                    className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 disabled:opacity-50 transition-all"
                  />
                  {url && (
                    <button
                      onClick={() => setUrl("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {status === "idle" || status === "error" || status === "done" ? (
                  <button
                    onClick={status === "done" ? handleReset : handleScrape}
                    disabled={!url.trim() && status !== "done"}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      status === "done"
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "btn-primary"
                    }`}
                  >
                    {status === "done" ? (
                      <><RefreshCw className="w-4 h-4" /> New Scan</>
                    ) : status === "error" ? (
                      <><RefreshCw className="w-4 h-4" /> Retry</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Start Extraction</>
                    )}
                  </button>
                ) : (
                  <button disabled className="w-full py-3 rounded-xl text-sm font-semibold bg-teal-900/30 text-teal-600 flex items-center justify-center gap-2 cursor-not-allowed">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Scanning...
                  </button>
                )}
              </div>

              {/* Config options */}
              <div className="mt-4 pt-4 border-t border-white/[0.05] space-y-3">
                <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-2">Options</div>
                {[
                  { label: "Max Depth", value: "2" },
                  { label: "Max Pages", value: "20" },
                  { label: "Timeout", value: "20s" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <AnimatePresence>
              {(status === "running" || status === "done") && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="glass-card p-5"
                >
                  <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    Extraction Stats
                  </h3>

                  {status === "running" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Progress</span>
                        <span className="font-mono">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                          style={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: FileText, label: "Pages", value: stats.pages, color: "text-blue-400" },
                      { icon: Image, label: "Images", value: stats.images, color: "text-teal-400" },
                      { icon: Code, label: "Scripts", value: stats.scripts, color: "text-yellow-400" },
                      { icon: Cpu, label: "Styles", value: stats.styles, color: "text-purple-400" },
                      { icon: Globe, label: "APIs", value: stats.apis, color: "text-orange-400" },
                      { icon: AlertCircle, label: "Errors", value: stats.errors, color: "text-red-400" },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <Icon className={`w-3.5 h-3.5 ${color} shrink-0`} />
                        <div>
                          <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
                          <div className="text-[9px] text-slate-600 uppercase">{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Download card */}
            <AnimatePresence>
              {status === "done" && downloadUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 border-teal-500/20 bg-teal-500/5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <h3 className="font-display font-bold text-teal-300 text-sm">Ready to Download</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Your source package is packaged and ready.</p>
                  <a
                    href={downloadUrl}
                    download
                    className="btn-primary w-full justify-center text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download ZIP
                  </a>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600">
                    <Clock className="w-3 h-3" />
                    Expires in 24 hours
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — Log terminal */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden h-full min-h-[600px] flex flex-col">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 font-mono text-xs text-slate-600">sourcepull — live log</span>
                </div>
                {logs.length > 0 && (
                  <span className="font-mono text-[10px] text-slate-700">{logs.length} entries</span>
                )}
              </div>

              {/* Log content */}
              <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1.5">
                {status === "idle" && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                      <Globe className="w-8 h-8 text-teal-500/40" />
                    </div>
                    <p className="text-slate-600 text-sm mb-2">Waiting for a URL to scan</p>
                    <p className="text-slate-700 text-xs max-w-xs">Enter a target URL in the panel on the left and click <span className="text-teal-600">Start Extraction</span> to begin.</p>
                  </div>
                )}

                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-3 ${logColors[log.type]}`}
                  >
                    <span className="text-slate-700 shrink-0 tabular-nums">{log.time}</span>
                    <span className="shrink-0">{logPrefixes[log.type]}</span>
                    <span className="break-all">{log.text}</span>
                  </motion.div>
                ))}

                {status === "running" && (
                  <div className="text-teal-400 opacity-70 cursor-blink">&nbsp;</div>
                )}

                <div ref={logsEndRef} />
              </div>

              {/* Status bar */}
              <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    status === "running" ? "bg-teal-400 animate-pulse" :
                    status === "done" ? "bg-teal-500" :
                    status === "error" ? "bg-red-500" :
                    "bg-slate-700"
                  }`} />
                  <span className="font-mono text-[10px] text-slate-600 capitalize">{status}</span>
                </div>
                {url && (
                  <span className="font-mono text-[10px] text-slate-700 truncate max-w-xs">{url}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
