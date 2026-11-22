'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Globe, ChevronDown } from 'lucide-react'

const terminalLines = [
  { type: 'cmd',   text: '$ sourcedump scan https://example.com' },
  { type: 'info',  text: '⠿ Initializing crawler engine...' },
  { type: 'ok',    text: '✓ Domain resolved · 142ms' },
  { type: 'info',  text: '⠿ Crawling page structure...' },
  { type: 'ok',    text: '✓ Found 47 internal links' },
  { type: 'info',  text: '⠿ Extracting assets...' },
  { type: 'ok',    text: '✓ 23 scripts detected' },
  { type: 'ok',    text: '✓ 18 stylesheets captured' },
  { type: 'ok',    text: '✓ 94 images indexed' },
  { type: 'info',  text: '⠿ Packaging source bundle...' },
  { type: 'ok',    text: '✓ ZIP created · 4.2 MB' },
  { type: 'done',  text: '✦ Download ready!' },
]

function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0)

  useEffect(() => {
    if (visibleLines >= terminalLines.length) return
    const timer = setTimeout(() => setVisibleLines(v => v + 1), visibleLines === 0 ? 500 : 250)
    return () => clearTimeout(timer)
  }, [visibleLines])

  const colorMap: Record<string, string> = {
    cmd:  '#e2faf7',
    info: '#5eead4',
    ok:   '#34d399',
    warn: '#fbbf24',
    done: '#14b8a6',
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-teal-400/15 shadow-[0_0_80px_rgba(20,184,166,0.08)]">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-teal-400/10 bg-[rgba(2,11,9,0.5)]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="ml-2 text-xs font-mono text-teal-300/50">sourcedump — terminal</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="glow-dot" style={{ width: 6, height: 6 }} />
          <span className="text-[10px] font-mono text-teal-400">LIVE</span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-4 space-y-1 min-h-[280px] bg-[rgba(2,11,9,0.7)] relative overflow-hidden">
        {/* Scan line */}
        <div className="scanning-line" />

        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="font-mono text-xs leading-6 transition-all duration-300"
            style={{ color: colorMap[line.type] || '#a7f3eb', opacity: 0, animation: `fadeIn 0.3s ease forwards` }}
          >
            {line.text}
          </div>
        ))}

        {visibleLines < terminalLines.length && (
          <div className="font-mono text-xs text-teal-400/70 flex items-center gap-1">
            <span className="cursor-blink" />
          </div>
        )}

        {visibleLines >= terminalLines.length && (
          <div className="mt-3 p-2.5 rounded-lg bg-teal-400/5 border border-teal-400/15">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-teal-400">📦 example_com.zip</span>
              <button className="font-mono text-[10px] px-3 py-1 rounded bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors">
                ↓ Download
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 divide-x divide-teal-400/10 border-t border-teal-400/10">
        {[['Pages', '47'], ['Scripts', '23'], ['Styles', '18'], ['Images', '94']].map(([label, val]) => (
          <div key={label} className="p-3 text-center">
            <div className="text-sm font-bold font-mono text-teal-300">{val}</div>
            <div className="text-[10px] text-teal-100/30 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-10">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />

      {/* Orbital glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                 style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', color: '#2dd4bc' }}>
              <div className="glow-dot" style={{ width: 6, height: 6 }} />
              Scan any website in seconds
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                <span className="text-white">Download the</span>
                <br />
                <span className="gradient-text">entire source</span>
                <br />
                <span className="text-white">of any website.</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-teal-100/50 leading-relaxed max-w-xl">
              SourceDump crawls any public URL and exports a complete bundle — HTML pages, stylesheets, scripts, images,
              and API endpoints — packaged into a single downloadable ZIP archive.
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              {[
                [Shield, 'Ethical Scraping'],
                [Zap, 'Sub-second Analysis'],
                [Globe, 'Any Domain'],
              ].map(([Icon, label]: any) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-teal-400/10 text-teal-300/60">
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/app" className="btn-primary px-8 py-4 rounded-xl text-sm font-semibold">
                <Zap className="w-4 h-4" />
                Start Downloading Source
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <a href="#how-it-works" className="btn-ghost px-8 py-4 rounded-xl text-sm">
                See how it works
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['#14b8a6', '#0d9488', '#2dd4bc', '#5eead4'].map((color, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[#020b09] flex items-center justify-center text-[9px] font-bold text-white"
                       style={{ background: color }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-teal-100/40">
                <span className="text-teal-300 font-semibold">2,400+</span> developers trust SourceDump
              </p>
            </div>
          </div>

          {/* Right — Terminal preview */}
          <div className="animate-float">
            <AnimatedTerminal />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-20">
          <a href="#problem" className="flex flex-col items-center gap-2 text-teal-100/25 hover:text-teal-300 transition-colors group">
            <span className="text-xs font-mono">scroll to explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}
