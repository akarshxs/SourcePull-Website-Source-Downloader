'use client'
import { Wifi, CheckCircle2, Clock, Download } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPreview() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="section-label">App Preview</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
            A clean interface for
            <br />
            <span className="gradient-text">powerful extraction.</span>
          </h2>
          <p className="text-teal-100/45 text-base max-w-xl mx-auto">
            The SourceDump dashboard gives you real-time crawl logs, live stats, and instant download when the scan completes.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="glass-card rounded-3xl border border-teal-400/15 overflow-hidden shadow-[0_0_100px_rgba(20,184,166,0.08)]">
          {/* Window chrome */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-teal-400/10 bg-[rgba(2,11,9,0.6)]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono text-teal-300/50 border border-teal-400/10 bg-teal-400/5">
                <Wifi className="w-3 h-3" />
                sourcedump.app/dashboard
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="glow-dot" style={{ width: 6, height: 6 }} />
              <span className="text-xs font-mono text-teal-400">Scanning...</span>
            </div>
          </div>

          {/* App content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-teal-400/10">
            {/* Left panel — URL input */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-teal-100/70">Target URL</h3>

              {/* URL field */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-teal-400/15 bg-teal-400/5 font-mono text-xs text-teal-300/70">
                  <span className="text-teal-400/50">https://</span>
                  example.com
                </div>
                <button className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
                  Scan
                </button>
              </div>

              {/* Config */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-teal-100/40">Crawl Depth</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(n => (
                      <button key={n}
                        className={`w-7 h-7 rounded-lg text-xs font-mono transition-all ${n === 2 ? 'bg-teal-400/20 text-teal-300 border border-teal-400/30' : 'text-teal-100/30 hover:bg-teal-400/5'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-teal-100/40">Max Pages</span>
                  <span className="text-xs font-mono text-teal-300">20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-teal-100/40">Include Assets</span>
                  <div className="w-8 h-4 rounded-full bg-teal-400/30 flex items-center justify-end pr-0.5 cursor-pointer">
                    <div className="w-3 h-3 rounded-full bg-teal-400" />
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-teal-100/40">Progress</span>
                  <span className="text-teal-300 font-mono">73%</span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-fill" style={{ width: '73%' }} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {[['Pages', '34'], ['Scripts', '17'], ['Styles', '11'], ['Images', '62']].map(([k, v]) => (
                  <div key={k} className="rounded-lg p-2.5 text-center border border-teal-400/8 bg-teal-400/3">
                    <div className="text-sm font-bold font-mono text-teal-300">{v}</div>
                    <div className="text-[10px] text-teal-100/30">{k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle — Live logs */}
            <div className="p-6 space-y-3 lg:col-span-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-teal-100/70">Live Logs</h3>
                <span className="text-[10px] font-mono text-teal-400 px-2 py-0.5 rounded bg-teal-400/10">STREAMING</span>
              </div>

              <div className="space-y-0.5 font-mono text-[11px] h-56 overflow-hidden">
                {[
                  ['ok',   '✓ /index.html — 200'],
                  ['ok',   '✓ /about — 200'],
                  ['ok',   '✓ /products — 200'],
                  ['info', '⠿ Parsing /products...'],
                  ['ok',   '✓ style.css — 200'],
                  ['ok',   '✓ main.js — 200'],
                  ['warn', '⚠ /old-page — 301 redirect'],
                  ['ok',   '✓ logo.png — 200'],
                  ['ok',   '✓ hero.webp — 200'],
                  ['info', '⠿ API: /api/products detected'],
                  ['ok',   '✓ /contact — 200'],
                  ['info', '⠿ Scanning /contact...'],
                ].map(([type, text], i) => (
                  <div key={i}
                    className={`log-entry ${type === 'ok' ? 'log-ok' : type === 'warn' ? 'log-warn' : 'log-info'}`}>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Download ready mockup */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-teal-100/70">Completed Scans</h3>

              <div className="space-y-3">
                {[
                  { url: 'stripe.com',  size: '8.4 MB',  pages: 63, time: '2m ago',   done: true },
                  { url: 'vercel.com',  size: '5.1 MB',  pages: 41, time: '15m ago',  done: true },
                  { url: 'linear.app',  size: '3.7 MB',  pages: 28, time: '1h ago',   done: true },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-3 border border-teal-400/10 bg-teal-400/3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-sm font-mono text-teal-200">{item.url}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-teal-100/30">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 text-[10px] text-teal-100/40 font-mono">
                        <span>{item.pages} pages</span>
                        <span>{item.size}</span>
                      </div>
                      <button className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg text-teal-300 border border-teal-400/20 hover:bg-teal-400/10 transition-colors">
                        <Download className="w-3 h-3" />
                        .zip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/app" className="btn-primary px-8 py-3.5 rounded-xl inline-flex items-center gap-2 text-sm font-semibold">
            Open the App
            <span className="text-white/50">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
