import { ArrowRight, Clock, Tag } from 'lucide-react'

const posts = [
  {
    tag: 'Tutorial',
    title: 'How to legally archive websites for research',
    excerpt: 'A deep-dive into robots.txt compliance, scraping ethics, and building responsible crawlers that respect server load.',
    readTime: '8 min read',
    date: 'Mar 4, 2025',
    color: '#14b8a6',
  },
  {
    tag: 'Analysis',
    title: "What your site's JS bundles reveal about your tech stack",
    excerpt: 'Modern SPAs leak surprising amounts of architectural detail through their bundled scripts. Here is what to look for.',
    readTime: '6 min read',
    date: 'Feb 28, 2025',
    color: '#2dd4bc',
  },
  {
    tag: 'Security',
    title: 'Detecting exposed API keys in publicly scraped sites',
    excerpt: 'A practical guide to identifying accidentally committed credentials, tokens, and sensitive config values in public source.',
    readTime: '10 min read',
    date: 'Feb 19, 2025',
    color: '#5eead4',
  },
]

export default function BlogSection() {
  return (
    <section id="blog" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="section-label">Insights</div>
            <h2 className="font-display text-4xl font-bold text-white leading-tight">
              From the <span className="gradient-text">SourceDump blog.</span>
            </h2>
          </div>
          <a href="#" className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors group shrink-0">
            All articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <article
              key={i}
              className="glass-card-hover rounded-2xl overflow-hidden group cursor-pointer"
            >
              {/* Image placeholder */}
              <div className="h-44 relative overflow-hidden"
                   style={{ background: `linear-gradient(135deg, rgba(13,35,32,1), ${post.color}20)` }}>
                {/* Decorative grid */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                {/* Decorative element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center border border-teal-400/20 font-display font-bold text-4xl"
                    style={{ background: `${post.color}10`, color: post.color }}
                  >
                    {i === 0 ? '🕸' : i === 1 ? '🔍' : '🔐'}
                  </div>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,11,9,0.8)] to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                       style={{ background: `${post.color}12`, color: post.color, border: `1px solid ${post.color}20` }}>
                    <Tag className="w-2.5 h-2.5" />
                    {post.tag}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-teal-100/30">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="font-semibold text-white leading-snug group-hover:text-teal-200 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-teal-100/40 leading-relaxed line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-2 border-t border-teal-400/8">
                  <span className="text-[11px] text-teal-100/25">{post.date}</span>
                  <span className="text-xs text-teal-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
