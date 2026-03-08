"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Terminal } from "lucide-react";

const links = [
  { label: "Features",     href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Metrics",      href: "#metrics" },
  { label: "Docs",         href: "/docs" },
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
            ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-8 h-8 rounded-lg bg-[#0e0e0e] border border-white/10 flex items-center justify-center transition-all group-hover:border-[#00c9a7]/40 group-hover:bg-[#00c9a7]/05">
              <Terminal className="w-4 h-4 text-[#00c9a7]" strokeWidth={1.5} />
            </div>
            <span className="font-display font-black text-[1rem] tracking-tight text-white">
              Source<span className="text-[#00c9a7]">Pull</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="relative px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04] group"
              >
                {l.label}
                <span className="absolute bottom-1.5 left-4 right-4 h-px bg-[#00c9a7] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden md:inline-flex btn-prime text-sm py-2 px-5">
              <Download className="w-3.5 h-3.5" />
              Launch App
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg border border-white/[0.08] text-neutral-400 hover:text-white transition-colors"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-[60px] z-40 md:hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-white/[0.07] p-6 space-y-1"
          >
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/dashboard" className="btn-prime w-full justify-center">
                <Download className="w-4 h-4" />
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
