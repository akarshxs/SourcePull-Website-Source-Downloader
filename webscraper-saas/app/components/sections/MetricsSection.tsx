"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Gauge, Shield, Zap } from "lucide-react";

const stats = [
  { raw: 3240000, suffix: "+", label: "PAGES ANALYZED",     key: "DOM_NODES_TOTAL",  dec: 0 },
  { raw: 24800000, suffix: "+", label: "ASSETS DOWNLOADED",  key: "STATIC_ASSETS_ZIP", dec: 0 },
  { raw: 420000,   suffix: "+", label: "API ENDPOINTS FOUND", key: "REST_GQL_RECON",   dec: 0 },
  { raw: 99.8,     suffix: "%", label: "DOM RECON FIDELITY",  key: "PRECISION_RATE",   dec: 1 },
];

function Counter({ target, inView, dec }: { target:number; inView:boolean; dec:number }) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(parseFloat((ease * target).toFixed(dec)));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, target, dec]);

  const fmt = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
    return n.toFixed(dec);
  };
  return <>{fmt(val)}</>;
}

export default function MetricsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });

  return (
    <section className="py-24 px-6 bg-[#181818]" id="metrics">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5 }}
          className="text-center mb-16"
        >
          <div className="pill mb-4 mx-auto w-fit">
            <Gauge className="w-3.5 h-3.5 text-[#da291c]" />
            FLEET TELEMETRY
          </div>
          <h2 className="font-display font-medium text-4xl lg:text-5xl text-white uppercase tracking-[-1.12px] mb-4">
            PROVEN PERFORMANCE AT <br />
            <span className="gt-red font-bold">RACE TRACK SPEED</span>
          </h2>
          <p className="text-[#969696] max-w-md mx-auto text-base">Production crawl benchmarks captured across global live target runs.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity:0, y:20 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.5, delay:i*0.08 }}
              className="card card-hover p-8 text-center bg-[#202020] border-[#303030] relative overflow-hidden"
            >
              <div className="label-mono mb-3 block text-[10px] text-[#666666]">{s.key}</div>
              <div className="mono font-bold text-4xl text-white mb-2 tabular-nums">
                <Counter target={s.raw} inView={inView} dec={s.dec} />{s.suffix}
              </div>
              <div className="font-display font-semibold text-white text-xs uppercase tracking-[1px]">{s.label}</div>
              <div className="mt-6 prog-track mx-1">
                <motion.div
                  className="prog-fill"
                  initial={{ width:"0%" }}
                  animate={inView ? { width:"100%" } : {}}
                  transition={{ duration:1.5, delay:0.3+i*0.08, ease:"easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
