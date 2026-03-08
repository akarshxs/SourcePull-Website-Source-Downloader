import Link from "next/link";
import { Code2, Github, Twitter, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "/changelog" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Blog", href: "#blog" },
    { label: "Examples", href: "/examples" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Security", href: "/security" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#020817]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand col */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Source<span className="text-teal-400">Pull</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
              The most powerful web source extractor for developers, researchers, and security professionals.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/akarshxs" target="_blank" rel="noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/akarshxs" target="_blank" rel="noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:xoxoakarsh.com"
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} SourcePull. Built for educational and research purposes.
          </p>
          <p className="text-xs text-slate-600 font-mono">
            v2.1.0 — MIT License
          </p>
        </div>
      </div>
    </footer>
  );
}
