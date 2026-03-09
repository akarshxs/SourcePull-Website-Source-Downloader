'use client'
import { Link2, Globe, Layers, PackageOpen } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: Link2,
    title: 'Enter Target URL',
    desc: 'Paste any public website URL into the scanner. Supports HTTP, HTTPS, subdomains, and custom ports.',
    detail: 'https://target-website.com',
    isCode: true,
  },
  {
    num: '02',
    icon: Globe,
    title: 'Crawl Website Structure',
    desc: 'The crawler traverses every reachable page up to the configured depth, following internal links automatically.',
    detail: '47 pages · 2 levels deep · 3.2s',
    isCode: true,
  },
  {
    num: '03',
    icon: Layers,
    title: 'Extract All Assets',
    desc: 'HTML, CSS, JS, images, fonts, API responses — every detectable resource is captured and catalogued.',
    detail: '138 assets captured',
    isCode: true,
  },
  {
    num: '04',
    icon: PackageOpen,
    title: 'Download Source Package',
    desc: 'Receive a structured ZIP archive containing the complete source with a JSON map and error log.',
    detail: 'example_com.zip · 4.2 MB',
    isCode: true,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden">
      {/* Left side gradient accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-64 pointer-events-none"
           style={{ background: 'linear-gradient(180deg, transparent, rgba(20,184,166,0.4), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="section-label">Workflow</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
            From URL to archive
            <br />
            <span className="gradient-text">in four steps.</span>
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px pointer-events-none"
               style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.3), rgba(20,184,166,0.3), transparent)' }} />

          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="glass-card-hover rounded-2xl p-6 space-y-4 h-full">
                {/* Number + icon */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-teal-400/20 relative"
                       style={{ background: 'rgba(20,184,166,0.08)' }}>
                    <step.icon className="w-6 h-6 text-teal-400" />
                    {/* Active indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                  <span className="font-display font-bold text-3xl text-teal-400/15">{step.num}</span>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-teal-100/40 leading-relaxed">{step.desc}</p>
                </div>

                {/* Detail chip */}
                <div className="font-mono text-xs px-3 py-2 rounded-lg text-teal-300/70"
                     style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.1)' }}>
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-16 text-center">
          <a href="/app"
             className="btn-primary px-10 py-4 rounded-xl text-sm inline-flex items-center gap-2 font-semibold">
            <PackageOpen className="w-4 h-4" />
            Try It Now — Free
          </a>
          <p className="mt-3 text-xs text-teal-100/25">No signup required · Educational use · Respects robots.txt</p>
        </div>
      </div>
    </section>
  )
}
