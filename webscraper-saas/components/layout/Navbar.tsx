'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Zap, Menu, X, Globe } from 'lucide-react'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#metrics', label: 'Metrics' },
  { href: '#blog', label: 'Insights' },
  { href: '#pricing', label: 'Pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'py-3 bg-[rgba(2,11,9,0.88)] backdrop-blur-xl border-b border-[rgba(20,184,166,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'py-5 bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
            <Globe className="w-4 h-4 text-white" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Source<span className="text-teal-400">Dump</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm text-teal-100/60 hover:text-teal-100 hover:bg-teal-400/5 transition-all duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/app" className="text-sm text-teal-100/60 hover:text-teal-100 transition-colors">
            Sign in
          </Link>
          <Link href="/app" className="btn-primary text-xs px-5 py-2.5 rounded-lg">
            <Zap className="w-3.5 h-3.5" />
            Start Scanning
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-teal-300 hover:bg-teal-400/10 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={cn(
        'md:hidden overflow-hidden transition-all duration-300',
        mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="px-6 pb-6 pt-2 space-y-1 border-t border-teal-400/10 bg-[rgba(2,11,9,0.95)] backdrop-blur-xl">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm text-teal-100/60 hover:text-teal-100 hover:bg-teal-400/5 transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3">
            <Link href="/app" className="btn-primary w-full justify-center text-xs py-3 rounded-xl">
              <Zap className="w-3.5 h-3.5" />
              Start Scanning Free
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
