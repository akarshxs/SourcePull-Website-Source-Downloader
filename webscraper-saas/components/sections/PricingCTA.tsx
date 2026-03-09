import Link from 'next/link'
import { Zap, Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for trying out SourceDump or occasional use.',
    features: ['5 scans per day', '10 pages per scan', 'Depth 1 crawl', 'ZIP export', 'Basic logs'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    desc: 'For developers and researchers who need full power.',
    features: ['Unlimited scans', '200 pages per scan', 'Depth 3 crawl', 'API detection', 'Full logs + error report', 'Priority queue', 'API access'],
    cta: 'Start Pro',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    desc: 'For security teams and organizations at scale.',
    features: ['Everything in Pro', '10 concurrent scans', '1,000 pages per scan', 'Depth 5 crawl', 'Team dashboard', 'SSO / SAML', 'SLA & support'],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export default function PricingCTA() {
  return (
    <>
      {/* ── Pricing ── */}
      <section id="pricing" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(13,35,32,0.3)] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="section-label">Pricing</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
              Simple, transparent
              <br />
              <span className="gradient-text">pricing that scales.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 space-y-6 relative overflow-hidden ${
                  plan.highlight
                    ? 'border-2 border-teal-400/40 shadow-[0_0_50px_rgba(20,184,166,0.15)]'
                    : 'border border-teal-400/10'
                }`}
                style={{ background: plan.highlight ? 'rgba(20,184,166,0.06)' : 'rgba(13,35,32,0.5)' }}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
                )}
                {plan.highlight && (
                  <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-400 text-black">
                    POPULAR
                  </div>
                )}

                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold font-mono text-white">{plan.price}</span>
                    <span className="text-sm text-teal-100/40">{plan.period}</span>
                  </div>
                  <p className="text-sm text-teal-100/40">{plan.desc}</p>
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="text-teal-100/70">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/app"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    plan.highlight
                      ? 'btn-primary'
                      : 'border border-teal-400/20 text-teal-100/60 hover:text-white hover:bg-teal-400/5'
                  }`}
                >
                  {plan.cta}
                  {plan.highlight && <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(20,184,166,0.1) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight">
              Ready to export
              <br />
              <span className="gradient-text">your first site?</span>
            </h2>
            <p className="text-teal-100/45 text-lg max-w-xl mx-auto">
              No setup, no signup required. Paste a URL, hit scan, and download your archive in under a minute.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app" className="btn-primary px-10 py-4 rounded-xl text-base font-semibold">
              <Zap className="w-5 h-5" />
              Start Downloading Source
            </Link>
            <a href="#" className="btn-ghost px-10 py-4 rounded-xl text-base">
              Read the docs
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-xs text-teal-100/25">
            {['Free to start', 'No credit card', 'Educational use'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-teal-400/50" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
