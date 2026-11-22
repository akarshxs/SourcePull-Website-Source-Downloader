"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Terminal } from "lucide-react";

const links = [
  { label: "FEATURES",        href: "#features" },
  { label: "DESIGN EXTRACTOR", href: "#design-extractor" },
  { label: "WORKFLOW",        href: "#how-it-works" },
  { label: "METRICS",         href: "#metrics" },
  { label: "DASHBOARD",       href: "/dashboard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#181818]/95 backdrop-blur-md border-b border-[#303030] shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent border-b border-[#303030]/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">

          {/* Ferrari-style Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="w-8 h-8 rounded-none bg-[#da291c] flex items-center justify-center transition-all group-hover:bg-[#b01e0a]">
              <span className="font-mono font-black text-white text-[13px] tracking-tight">WC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-medium text-[1.05rem] uppercase tracking-[1.4px] text-white leading-tight">
                WEB <span className="text-[#da291c]">CRAWLER</span>
              </span>
              <span className="text-[9px] font-mono tracking-[1.8px] text-[#666666] uppercase">
                BY X VELOCITY
              </span>
            </div>
          </Link>

          {/* Desktop Links - Uppercase with 0.65px tracking */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="relative px-4 py-2 text-[12px] font-semibold text-[#969696] hover:text-white transition-colors tracking-[0.65px] group uppercase"
              >
                {l.label}
                <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-[#da291c] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </Link>
            ))}
          </nav>

          {/* Ferrari Signature Sharp CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex btn-prime text-[12px] py-2.5 px-6"
            >
              LAUNCH CONSOLE
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-none border border-[#303030] text-[#969696] hover:text-white hover:border-white transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-[64px] z-40 lg:hidden bg-[#181818]/98 backdrop-blur-xl border-b border-[#303030] p-6 space-y-2"
          >
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-[13px] font-semibold text-[#969696] hover:text-white hover:bg-[#222222] transition-all tracking-[0.65px] uppercase"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="btn-prime w-full justify-center"
              >
                LAUNCH CONSOLE
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
