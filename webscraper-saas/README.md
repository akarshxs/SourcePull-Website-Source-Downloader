# SourcePull — Website Source Downloader

A production-grade SaaS application for crawling websites and downloading their complete source code as structured ZIP archives.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Clone or unzip the project
cd sourcepull

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Run development server
npm run dev
```

Visit **http://localhost:3000** for the landing page.  
Visit **http://localhost:3000/app** for the scraper tool.

---

## 📁 Project Structure

```
sourcepull/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── app/
│   │   ├── layout.tsx          # App layout
│   │   └── page.tsx            # Scraper dashboard
│   ├── api/
│   │   └── scrape/
│   │       └── route.ts        # POST /api/scrape
│   └── components/
│       ├── layout/
│       │   ├── Navbar.tsx
│       │   └── Footer.tsx
│       └── sections/
│           ├── Hero.tsx
│           ├── ProblemSection.tsx
│           ├── FeaturesSection.tsx
│           ├── HowItWorksSection.tsx
│           ├── MetricsSection.tsx
│           ├── DashboardPreview.tsx
│           ├── PricingSection.tsx
│           └── BlogCTASection.tsx
├── styles/
│   └── globals.css
├── public/
│   └── downloads/              # Auto-created, stores ZIPs temporarily
├── tailwind.config.ts
├── next.config.js
├── vercel.json
├── netlify.toml
└── package.json
```

---

## 🔌 API Reference

### `POST /api/scrape`

Crawl a website and return a download link.

**Request:**
```json
{
  "url": "https://example.com",
  "maxDepth": 2,
  "maxPages": 20
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "uuid-here",
  "downloadUrl": "/downloads/sourcepull_example_com_abc12345.zip",
  "stats": {
    "pages": 8,
    "images": 24,
    "scripts": 12,
    "styles": 4,
    "apis": 3,
    "errors": 1
  }
}
```

**ZIP Archive Contents:**
```
sourcepull_example_com/
├── pages/          # All crawled HTML pages
├── api_hints/      # Discovered API endpoints (JSON)
├── errors.log      # Failed requests log
└── summary.json    # Complete scrape report
```

---

## 🌍 Deploy to Vercel

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Vercel auto-detects Next.js — just click **Deploy**
4. Set any environment variables under **Settings > Environment Variables**

Or via CLI:
```bash
npm i -g vercel
vercel
```

> **Note:** The scrape function is set to 60s max duration in `vercel.json`. Vercel Hobby plan is limited to 10s. Upgrade to Pro for longer scrapes, or use Netlify.

---

## 🌐 Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

Or connect via [app.netlify.com](https://app.netlify.com) → **Import from Git**.

The `netlify.toml` is pre-configured with the `@netlify/plugin-nextjs` plugin.

---

## ⚙️ Configuration

### Scraper Limits (edit `app/api/scrape/route.ts`)

```typescript
const MAX_DEPTH = 2;   // Max crawl depth (1 = homepage only, 5 = deep crawl)
const MAX_PAGES = 20;  // Max pages per scrape
```

### ZIP Retention

ZIPs are auto-deleted after 24 hours via `setTimeout`. For persistent storage, integrate with S3:

```typescript
// Replace local file save with S3 upload
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
```

---

## 🛡 Ethics & Legal

SourcePull is intended for:
- Security research and OSINT
- Offline archiving of your own sites
- Academic and educational use
- Competitive analysis of public information

**Always:**
- Respect `robots.txt` (planned feature)
- Obtain permission before scraping private sites
- Follow the target site's Terms of Service

---

## 🔮 Roadmap

- [ ] robots.txt compliance
- [ ] JavaScript rendering (Puppeteer/Playwright)
- [ ] Scheduled recurring scans
- [ ] S3/R2 storage integration
- [ ] API key authentication
- [ ] Team dashboard
- [ ] Site diff / change detection
