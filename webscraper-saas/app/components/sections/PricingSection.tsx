"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Check, Zap, Rocket, Building2, Tag } from "lucide-react";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    desc: "Explore the tool risk-free.",
    features: ["10 scans per day", "Max 2-level crawl", "Up to 20 pages", "HTML & asset extraction", "ZIP download"],
    cta: "Start Free",
    href: "/app",
  },
  {
    name: "Pro",
    icon: Rocket,
    price: "$29",
    period: "per month",
    desc: "For developers and researchers who need depth.",
    features: ["Unlimited scans", "Max 4-level crawl", "Up to 100 pages", "API endpoint detection", "Priority queue", "Persistent job history", "Email support"],
    cta: "Upgrade to Pro",
    href: "/app?plan=pro",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "per seat",
    desc: "Custom limits for teams with serious needs.",
    features: ["Unlimited depth & pages", "Team workspaces", "Self-hosted option", "SAML SSO", "SLA + dedicated support", "Custom retention policy"],
    cta: "Contact Sales",
    href: "/contact",
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 px-6" id="pricing">
      <div className="hr max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="pill mb-5 mx-auto w-fit">
            <Tag className="w-3 h-3" />
            Pricing
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-5 leading-tight">
            Simple, <span className="gt">transparent pricing</span>
          </h2>
          <p className="text-[#5a9e76] max-w-md mx-auto text-lg">Start free. Upgrade when you need more power.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`card p-7 flex flex-col relative ${plan.highlight ? "border-[rgba(0,255,136,0.3)] shadow-[0_0_48px_rgba(0,255,136,0.08)]" : ""}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 pill text-[10px] px-3 py-1" style={{ background: "#00ff88", color: "#050a06", borderColor: "#00ff88" }}>
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${plan.highlight ? "bg-[rgba(0,255,136,0.12)] border-[rgba(0,255,136,0.3)]" : "bg-[rgba(0,255,136,0.05)] border-[rgba(0,255,136,0.12)]"} border`}>
                    <Icon className={`w-4 h-4 ${plan.highlight ? "text-[#00ff88]" : "text-[#2a5c37]"}`} strokeWidth={1.5} />
                  </div>
                  <span className="font-display font-bold text-white text-lg">{plan.name}</span>
                </div>

                <div className="mb-2">
                  <span className="font-mono font-black text-4xl text-white">{plan.price}</span>
                  {plan.period && <span className="font-mono text-sm text-[#2a5c37] ml-2">/ {plan.period}</span>}
                </div>
                <p className="text-sm text-[#5a9e76] mb-6">{plan.desc}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#7ecf9f]">
                      <Check className="w-3.5 h-3.5 text-[#00ff88] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={plan.highlight ? "btn-prime justify-center" : "btn-ghost justify-center"}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
