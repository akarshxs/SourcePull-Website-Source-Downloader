"use client";
import { motion } from "framer-motion";
import { Check, Zap, Building2, Rocket } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    desc: "For individuals exploring web intelligence tools.",
    features: [
      "10 scans per day",
      "Max 2 depth crawl",
      "Up to 20 pages per scan",
      "HTML & asset extraction",
      "ZIP download",
      "Community support",
    ],
    cta: "Start Free",
    href: "/app",
    highlighted: false,
    badge: null,
  },
  {
    name: "Pro",
    icon: Rocket,
    price: "$29",
    period: "per month",
    desc: "For serious researchers and power users.",
    features: [
      "500 scans per month",
      "Max 5 depth crawl",
      "Up to 200 pages per scan",
      "API endpoint detection",
      "Priority processing",
      "Email support",
      "48-hour archive retention",
      "Bulk URL processing",
    ],
    cta: "Start Pro Trial",
    href: "/app",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "contact us",
    desc: "For teams and large-scale operations.",
    features: [
      "Unlimited scans",
      "Custom crawl depth",
      "Unlimited pages",
      "Full API access",
      "Dedicated infrastructure",
      "SLA guarantee",
      "SSO & team management",
      "Custom retention policy",
    ],
    cta: "Contact Sales",
    href: "mailto:hello@sourcepull.dev",
    highlighted: false,
    badge: null,
  },
];

export default function PricingSection() {
  return (
    <section className="relative py-28 overflow-hidden" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-5">Pricing</div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            Simple, transparent<br />
            <span className="gradient-text">pricing for every team</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more power. No surprise charges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative glass-card p-7 flex flex-col ${
                plan.highlighted
                  ? "border-teal-500/40 bg-gradient-to-b from-teal-500/10 to-transparent shadow-[0_0_40px_rgba(20,184,166,0.15)]"
                  : "glass-card-hover"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500 text-slate-900">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${plan.highlighted ? "bg-teal-500/20 border border-teal-500/30" : "bg-white/[0.06] border border-white/[0.08]"}`}>
                  <plan.icon className={`w-4.5 h-4.5 ${plan.highlighted ? "text-teal-400" : "text-slate-400"}`} />
                </div>
                <span className="font-display font-bold text-white text-lg">{plan.name}</span>
              </div>

              <div className="mb-2">
                <span className="font-display text-4xl font-black text-white">{plan.price}</span>
                <span className="text-sm text-slate-500 ml-2">/ {plan.period}</span>
              </div>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">{plan.desc}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-400">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={plan.highlighted ? "btn-primary w-full justify-center" : "btn-ghost w-full justify-center"}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
