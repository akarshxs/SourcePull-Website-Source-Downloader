'use client'
import {
  Archive, Search, Image, Radio, FileCode2, AlertCircle, Package, Network
} from 'lucide-react'

const features = [
  {
    icon: Archive,
    title: 'Full Website Source Export',
    desc: 'Download complete HTML structure of every crawled page with proper directory layout preserved.',
    accent: '#14b8a6',
    tag: 'Core',
  },
  {
    icon: Search,
    title: 'Smart Page Crawling',
    desc: 'Depth-aware link traversal intelligently follows internal links without getting trapped in infinite loops.',
    accent: '#2dd4bc',
    tag: 'Crawler',
  },
  {
    icon: Image,
    title: 'Asset Downloader',
    desc: 'Captures every image, font, video, and binary asset referenced in the page — even lazy-loaded ones.',
    accent: '#5eead4',
    tag: 'Assets',
  },
  {
    icon: Radio,
    title: 'API Endpoint Detection',
    desc: 'Intercepts and logs all fetch/XHR calls, REST endpoints, and GraphQL queries the site makes.',
    accent: '#34d399',
    tag: 'Analysis',
  },
  {
    icon: FileCode2,
    title: 'JavaScript & CSS Extraction',
    desc: 'Saves all inline scripts, external bundles, stylesheets, and source maps for deep inspection.',
    accent: '#14b8a6',
    tag: 'Code',
  },
  {
    icon: AlertCircle,
    title: 'Error Logging',
    desc: 'Every failed request, broken link, and missing resource is catalogued with HTTP status codes.',
    accent: '#fbbf24',
    tag: 'Logs',
  },
  {
    icon: Package,
    title: 'ZIP Packaging',
    desc: 'All captured files are automatically compressed and organized into a structured, downloadable archive.',
    accent: '#2dd4bc',
    tag: 'Export',
  },
  {
    icon: Network,
    title: 'Domain Structure Mapping',
    desc: 'Generates a visual JSON site-map showing page hierarchy, link relationships, and asset dependencies.',
    accent: '#5eead4',
    tag: 'Map',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative">
      {/* Section bg accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(13,35,32,0.25)] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="section-label">Features</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
            Everything you need to
            <br />
            <span className="gradient-text">own any website's source.</span>
          </h2>
          <p className="text-teal-100/45 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit engineered for developers, security researchers, and digital archivists.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, i) => (
            <div key={i} className="feature-card group">
              {/* Top glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ background: `radial-gradient(circle at 50% 0%, ${feat.accent}12 0%, transparent 60%)` }} />

              {/* Tag */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{ background: `${feat.accent}15`, borderColor: `${feat.accent}25`, color: feat.accent }}
                >
                  <feat.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-1 rounded-full"
                      style={{ background: `${feat.accent}10`, color: feat.accent, border: `1px solid ${feat.accent}20` }}>
                  {feat.tag}
                </span>
              </div>

              <h3 className="font-semibold text-white mb-2 group-hover:text-teal-200 transition-colors">{feat.title}</h3>
              <p className="text-sm text-teal-100/40 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
