'use client'
import { useEffect, useRef, useState } from 'react'
import { TrendingUp, FileText, Code2, Radio } from 'lucide-react'

const stats = [
  { icon: FileText, label: 'Pages Analyzed',    value: 4_800_000, suffix: '+',  prefix: '' },
  { icon: TrendingUp, label: 'Assets Collected', value: 23_400_000, suffix: '+', prefix: '' },
  { icon: Code2, label: 'Scripts Detected',      value: 9_100_000,  suffix: '+', prefix: '' },
  { icon: Radio, label: 'APIs Discovered',        value: 1_200_000,  suffix: '+', prefix: '' },
]

function useCountUp(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, active])

  return count
}

function StatCard({ icon: Icon, label, value, suffix, prefix, active }: any) {
  const count = useCountUp(value, 2000, active)

  const fmt = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
    return n.toLocaleString()
  }

  return (
    <div className="stat-card group hover:border-teal-400/20 transition-all duration-300 border border-teal-400/8">
      <div className="w-10 h-10 mx-auto mb-4 rounded-xl flex items-center justify-center border border-teal-400/15"
           style={{ background: 'rgba(20,184,166,0.08)' }}>
        <Icon className="w-5 h-5 text-teal-400" />
      </div>
      <div className="font-display font-bold text-4xl text-white mb-1">
        {prefix}{fmt(count)}{suffix}
      </div>
      <div className="text-sm text-teal-100/40">{label}</div>

      {/* Progress bar */}
      <div className="progress-bar mt-4 mx-auto w-16">
        <div
          className="progress-fill"
          style={{ width: active ? '100%' : '0%', transition: 'width 2.2s ease' }}
        />
      </div>
    </div>
  )
}

export default function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="metrics" className="py-28 relative overflow-hidden" ref={ref}>
      {/* Bg accent */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(20,184,166,0.06) 0%, transparent 100%)' }} />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="section-label">By the Numbers</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
            Trusted at scale by
            <br />
            <span className="gradient-text">developers worldwide.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} active={active} />
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-teal-100/25 mt-8 font-mono">
          Cumulative statistics across all scans since launch.
        </p>
      </div>
    </section>
  )
}
