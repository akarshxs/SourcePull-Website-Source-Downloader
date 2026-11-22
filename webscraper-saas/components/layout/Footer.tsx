import Link from 'next/link'
import { Globe, Github, Twitter, ExternalLink } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'App', href: '/app' },
  ],
  Developers: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Acceptable Use', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-teal-400/10 bg-[#020b09]">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Source<span className="text-teal-400">Dump</span>
              </span>
            </Link>
            <p className="text-sm text-teal-100/40 leading-relaxed max-w-xs">
              The professional toolkit for extracting, analyzing, and archiving website source code.
              Built for developers, researchers, and security professionals.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[Github, Twitter, ExternalLink].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-teal-100/40 hover:text-teal-400 hover:bg-teal-400/10 transition-all border border-teal-400/10"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="glow-dot" />
              <span className="text-xs text-teal-400 font-mono">All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-xs font-semibold tracking-widest uppercase text-teal-100/30">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-teal-100/50 hover:text-teal-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-teal-400/8 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-teal-100/25">
            © {new Date().getFullYear()} SourceDump. For educational and authorized use only.
          </p>
          <p className="text-xs text-teal-100/25 font-mono">
            v1.0.0 · Made with care
          </p>
        </div>
      </div>
    </footer>
  )
}
