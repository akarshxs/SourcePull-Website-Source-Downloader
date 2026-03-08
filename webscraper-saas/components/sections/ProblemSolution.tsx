'use client'
import { Clock, AlertTriangle, FolderX, Code2, Download, Zap, CheckCircle2 } from 'lucide-react'

const problems = [
  {
    icon: Clock,
    title: 'Hours of manual copying',
    desc: 'Right-clicking "Save Page As" misses dozens of linked assets, dynamic scripts, and API calls.',
  },
  {
    icon: AlertTriangle,
    title: 'Incomplete captures',
    desc: 'Browser dev tools only show part of the picture — you miss lazy-loaded content, background requests, and sub-pages.',
  },
  {
    icon: FolderX,
    title: 'Broken file structure',
    desc: 'Manually downloaded sites break relative paths, leaving you with a tangle of missing resources and 404 errors.',
  },
]

const solutions = [
  {
    icon: Code2,
    title: 'Full source extraction',
    desc: 'Every HTML page, script, stylesheet, and image downloaded automatically with correct directory structure.',
  },
  {
    icon: Zap,
    title: 'Instant analysis',
    desc: 'Our crawler maps the entire site graph in seconds, detecting APIs, CDN assets, and external dependencies.',
  },
  {
    icon: Download,
    title: 'One-click export',
    desc: 'Receive a clean, organized ZIP archive ready for offline review, security auditing, or archiving.',
  },
]

export default function ProblemSolution() {
  return (
    <>
      {/* ── Problem ── */}
      <section id="problem" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(13,35,32,0.3)] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="section-label">The Problem</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
              Capturing a website manually
              <br />
              <span className="gradient-text">is broken by design.</span>
            </h2>
            <p className="text-teal-100/45 text-lg max-w-2xl mx-auto">
              Traditional methods leave gaps — missing assets, broken paths, and incomplete captures that take hours to fix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 space-y-4 border border-red-500/8 hover:border-red-500/15 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 border border-red-500/15">
                  <p.icon className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-semibold text-white">{p.title}</h3>
                <p className="text-sm text-teal-100/45 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution ── */}
      <section id="solution" className="py-28 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
             style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Visual */}
            <div className="relative">
              {/* Layered card mockup */}
              <div className="relative">
                <div className="glass-card rounded-2xl p-5 border border-teal-400/15 shadow-[0_0_60px_rgba(20,184,166,0.08)]">
                  <div className="font-mono text-xs space-y-2">
                    {[
                      { color: '#5eead4', text: '📁 example_com/' },
                      { color: '#a7f3eb', text: '  📁 pages/' },
                      { color: '#a7f3ab', text: '    └─ index.html, about.html, contact.html' },
                      { color: '#a7f3eb', text: '  📁 assets/' },
                      { color: '#a7f3ab', text: '    ├─ css/  (18 files)' },
                      { color: '#a7f3ab', text: '    ├─ js/   (23 files)' },
                      { color: '#a7f3ab', text: '    └─ img/  (94 files)' },
                      { color: '#a7f3eb', text: '  📁 api_data/' },
                      { color: '#a7f3ab', text: '    └─ endpoints.json' },
                      { color: '#a7f3eb', text: '  📄 site_map.json' },
                      { color: '#a7f3eb', text: '  📄 scrape_log.txt' },
                    ].map((line, i) => (
                      <div key={i} style={{ color: line.color, opacity: 0.8 }}>{line.text}</div>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="mt-4 pt-4 border-t border-teal-400/10 grid grid-cols-3 gap-3">
                    {[['4.2 MB', 'Archive size'], ['0.8s', 'Scan time'], ['100%', 'Asset capture']].map(([val, label]) => (
                      <div key={label} className="text-center">
                        <div className="text-sm font-bold text-teal-300 font-mono">{val}</div>
                        <div className="text-[10px] text-teal-100/30">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2.5 flex items-center gap-2 border border-teal-400/20 shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-white">Source captured!</span>
                </div>
              </div>
            </div>

            {/* Right — Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="section-label">The Solution</div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
                  Automated scanning.
                  <br />
                  <span className="gradient-text">Complete extraction.</span>
                </h2>
                <p className="text-teal-100/45 text-lg leading-relaxed">
                  SourceDump's intelligent crawler traverses every linked page, detects all asset types, and packages
                  everything into a perfectly structured archive — automatically.
                </p>
              </div>

              <div className="space-y-5">
                {solutions.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border border-teal-400/15"
                         style={{ background: 'rgba(20,184,166,0.08)' }}>
                      <s.icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{s.title}</h4>
                      <p className="text-sm text-teal-100/45 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
