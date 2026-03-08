"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";

const stats = [
  { raw:2840000, suffix:"+", label:"Pages Analyzed",   key:"pages.total",  dec:0 },
  { raw:18700000,suffix:"+", label:"Assets Extracted",  key:"assets.count", dec:0 },
  { raw:340000,  suffix:"+", label:"APIs Discovered",   key:"apis.found",   dec:0 },
  { raw:99.7,    suffix:"%", label:"Success Rate",      key:"uptime.pct",   dec:1 },
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
    <section className="py-24 px-6" id="metrics">
      <div className="divider max-w-7xl mx-auto mb-20" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5 }}
          className="text-center mb-14"
        >
          <div className="pill mb-5 mx-auto w-fit">
            <TrendingUp className="w-3 h-3" />
            Platform Scale
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4 leading-tight">
            Trusted at <span className="gt">production scale</span>
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto text-lg">Real numbers from real extraction jobs.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity:0, y:20 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.5, delay:i*0.08 }}
              className="card card-hover p-7 text-center group relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background:"radial-gradient(ellipse at center, rgba(0,201,167,0.04) 0%, transparent 65%)" }}
              />
              <div className="label-mono mb-3 block">{s.key}</div>
              <div className="mono font-black text-4xl text-white mb-2 tabular-nums">
                <Counter target={s.raw} inView={inView} dec={s.dec} />{s.suffix}
              </div>
              <div className="font-display font-semibold text-neutral-400 text-sm">{s.label}</div>
              <div className="mt-5 prog-track mx-2">
                <motion.div
                  className="prog-fill"
                  initial={{ width:"0%" }}
                  animate={inView ? { width:"100%" } : {}}
                  transition={{ duration:1.6, delay:0.4+i*0.08, ease:"easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
