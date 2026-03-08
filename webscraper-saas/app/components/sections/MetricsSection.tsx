"use client";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
  { value: 2_400_000, label: "Pages Analyzed", suffix: "+", prefix: "" },
  { value: 18_700_000, label: "Assets Collected", suffix: "+", prefix: "" },
  { value: 340_000, label: "Scripts Detected", suffix: "+", prefix: "" },
  { value: 89_000, label: "APIs Discovered", suffix: "+", prefix: "" },
];

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent = prefix + Math.floor(v).toLocaleString() + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, prefix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function MetricsSection() {
  return (
    <section className="relative py-20" id="metrics">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-950/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-teal-500/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-5">By the Numbers</div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tight">
            Trusted by researchers<br />
            <span className="text-slate-500">across the globe</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="stat-number mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 glass-card p-5 flex flex-wrap items-center justify-center gap-8"
        >
          {["99.2% Uptime", "< 30s Avg. Extraction", "Zero Data Retention", "Open Source Core", "GDPR Compliant"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
