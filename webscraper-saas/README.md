# SourcePull

**A modern, full-stack SaaS web application for extracting and downloading complete website source code.**

SourcePull crawls any public URL and exports the entire source — HTML pages, stylesheets, JavaScript bundles, image assets, fonts, and discovered API endpoints — packaged as a clean, structured ZIP archive, delivered in seconds.

Built by [Akarsh](https://github.com/akarshxs) · GitHub: [@akarshxs](https://github.com/akarshxs) · Instagram: [@akarshxs](https://instagram.com/akarshxs)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [How the Scraper Works](#how-the-scraper-works)
- [Deploying to Vercel](#deploying-to-vercel)
- [Deploying to Netlify](#deploying-to-netlify)
- [Scraper Configuration](#scraper-configuration)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Legal Notice](#legal-notice)

---

## Overview

SourcePull converts a Telegram bot-based website downloader into a full production SaaS platform. The original Python scraper logic has been re-implemented as a server-side TypeScript API route inside Next.js App Router, eliminating all Python and bot dependencies while preserving the core crawling behavior.

The application has two primary user-facing surfaces:

| Route | Purpose |
|---|---|
| `/` | Landing page — marketing site |
| `/dashboard` | The working extraction tool |
| `/api/scrape` | POST endpoint — runs the crawler, returns download URL |
| `/api/download/[jobId]/[filename]` | GET endpoint — serves the generated ZIP file |

---

## Features

- **BFS web crawler** — breadth-first page traversal with configurable depth (1–4) and page limit (up to 100)
- **Full asset extraction** — HTML pages, CSS stylesheets, JavaScript bundles, images, fonts, SVGs
- **API endpoint detection** — pattern-matching against `/api/`, `/v1/`, `/graphql`, and `.json` routes
- **ZIP packaging** — all extracted files compressed and organized using the original site's directory tree
- **Error logging** — failed requests and non-200 responses recorded in `errors/error.log`
- **Domain structure map** — `index.json` generated per job with URL list, crawl stats, and timestamp
- **24-hour auto-cleanup** — job files automatically deleted from the server after 24 hours
- **Live dashboard** — real-time log output, elapsed timer, per-category stats, and one-click download
- **Private IP blocking** — requests to `localhost`, `127.0.0.1`, `192.168.*`, and `10.*` are rejected
- **Responsive UI** — works on desktop, tablet, and mobile
- **Framer Motion animations** — scroll-reveal, hover states, terminal typing simulation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Animations | Framer Motion |
| Fonts | Bricolage Grotesque + IBM Plex Mono |
| ZIP packaging | `archiver` |
| Unique job IDs | `uuid` |
| Icons | `lucide-react` |
| Runtime | Node.js 18+ |

No database required. No external API keys. No auth layer. Runs immediately after `npm install`.

---

## Project Structure

```
sourcepull/
├── app/
│   ├── layout.tsx                      Root layout — font imports, metadata
│   ├── globals.css                     Global styles (synced from styles/)
│   ├── page.tsx                        Landing page  /
│   │
│   ├── dashboard/
│   │   └── page.tsx                    Extraction tool  /dashboard
│   │
│   ├── app/
│   │   └── page.tsx                    Redirects /app → /dashboard
│   │
│   ├── api/
│   │   ├── scrape/
│   │   │   └── route.ts                POST /api/scrape
│   │   └── download/
│   │       └── [jobId]/
│   │           └── [filename]/
│   │               └── route.ts        GET /api/download/:jobId/:file
│   │
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
│           └── BlogCTASection.tsx
│
├── scraper/
│   └── WebScraper.ts                   Standalone crawler class (reference impl)
│
├── styles/
│   └── globals.css                     Source-of-truth global CSS
│
├── lib/
│   └── utils.ts                        Shared utilities
│
├── public/                             Static assets
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── vercel.json                         Vercel deployment config
├── netlify.toml                        Netlify deployment config
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

```bash
# 1. Enter the project directory
cd sourcepull

# 2. Install all dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Start the dev server
npm run dev
```

| URL | Description |
|---|---|
| http://localhost:3000 | Landing page |
| http://localhost:3000/dashboard | Extraction tool |
| http://localhost:3000/api/scrape | API endpoint (POST) |

### Production build

```bash
npm run build
npm start
```

---

## Environment Variables

Copy `.env.example` to `.env.local`. All variables are optional — the app works without them.

```env
# Max scans per IP per hour (not enforced by default — add middleware to enable)
SCRAPE_RATE_LIMIT=10

# Max simultaneous scrape jobs
MAX_CONCURRENT_JOBS=5

# Hours before job ZIP files are auto-deleted
JOB_TTL_HOURS=24
```

No API keys are required. The scraper uses Node.js native `fetch` with a standard browser User-Agent.

---

## API Reference

### POST `/api/scrape`

Starts a crawl job and returns a download link once complete.

**Request body:**

```json
{
  "url": "https://example.com",
  "maxDepth": 2,
  "maxPages": 20
}
```

| Field | Type | Default | Notes |
|---|---|---|---|
| `url` | `string` | required | Must be a valid `http://` or `https://` URL |
| `maxDepth` | `number` | `2` | Hard cap at 4 |
| `maxPages` | `number` | `20` | Hard cap at 100 |

**Successful response `200`:**

```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "downloadUrl": "https://yourapp.com/api/download/550e8400-.../example_com_source.zip",
  "stats": {
    "pages": 12,
    "images": 34,
    "scripts": 8,
    "styles": 4,
    "apis": 3,
    "errors": 1
  }
}
```

**Error responses:**

| Status | Cause |
|---|---|
| `400` | URL missing or invalid format |
| `403` | Private or local IP address |
| `500` | Unhandled crawler error |

---

### GET `/api/download/:jobId/:filename`

Downloads the ZIP archive for a completed job.

- Available for **24 hours** after the job completes
- Returns `404` if the file has expired or the job ID is invalid
- Responds with `Content-Disposition: attachment` to trigger browser download

---

## How the Scraper Works

The crawler is implemented inside `/api/scrape/route.ts`. The sequence on each POST request:

```
1. Validate URL format
2. Reject private IPs  (localhost, 127.0.0.1, 192.168.x, 10.x)
3. Generate UUID job ID
4. Create temp directory:  /tmp/sourcepull-jobs/{uuid}/scraped/

5. BFS crawl loop:
   ├── Fetch page (20s timeout, browser User-Agent)
   ├── Skip if: already visited, depth exceeded, page limit reached
   ├── Skip if: hostname !== target domain
   ├── Detect API endpoints by URL pattern
   ├── Save HTML → scraped/pages/{path}.html
   ├── Count asset types (images, scripts, styles)
   ├── Extract all href / src / action links from raw HTML
   ├── Sleep 300ms  (polite crawling)
   └── Recurse in parallel batches of 5

6. Write scraped/index.json  (stats + timestamp)
7. Write scraped/errors/error.log  (if any errors)

8. Create ZIP:  /tmp/sourcepull-jobs/{uuid}/{hostname}_source.zip
9. Schedule cleanup: fs.rmSync after 24 hours
10. Return { success, jobId, downloadUrl, stats }
```

**Link extraction pattern used:**

```
/(?:href|src|action)=["']([^"'#]+)["']/gi
```

This captures `<a href>`, `<img src>`, `<script src>`, `<link href>`, and `<form action>` from raw HTML.

**API detection patterns:**

```
/\/api\//i
/\/v\d+\//i
/\.json$/i
/\/graphql/i
```

---

## Deploying to Vercel

### Via Vercel Dashboard

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → **Import from Git**
3. Framework preset auto-detects as **Next.js**
4. Click **Deploy** — no additional configuration needed

### Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Vercel-specific notes

The included `vercel.json` sets a **60-second function timeout** for `/api/scrape`. For larger crawls:

- Keep `maxPages` ≤ 20 on Hobby tier
- Upgrade to **Vercel Pro** for 300-second timeouts
- For production at scale, move scraping to a background queue:
  - [Inngest](https://inngest.com) — serverless background jobs
  - [Upstash QStash](https://upstash.com/docs/qstash) — HTTP-based queues
  - [Trigger.dev](https://trigger.dev) — long-running background tasks

ZIP files are written to `/tmp` on Vercel's ephemeral filesystem. For production persistence, replace the local file writes with object storage:
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [AWS S3](https://aws.amazon.com/s3/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)

---

## Deploying to Netlify

### Via Netlify UI

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Build command: `npm run build`
4. Publish directory: `.next`
5. The `@netlify/plugin-nextjs` plugin declared in `netlify.toml` installs automatically

### Via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## Scraper Configuration

### Changing default limits

Edit the request handler in `app/api/scrape/route.ts`:

```ts
// Change default values here
const { url, maxDepth = 2, maxPages = 20 } = body;

// Change hard caps here
const result = await scrapeWebsite(
  targetUrl.href,
  scrapeDir,
  Math.min(maxDepth, 4),   // ← raise to allow deeper crawls
  Math.min(maxPages, 100)  // ← raise to allow more pages
);
```

### Changing the request timeout

```ts
// Inside fetchPage()
const timer = setTimeout(() => controller.abort(), 20000); // ← milliseconds
```

### Changing the polite delay

```ts
await sleep(300); // ← milliseconds between page fetches
```

### Changing parallel batch size

```ts
for (let i = 0; i < links.length; i += 5) { // ← links per batch
  await Promise.allSettled(links.slice(i, i + 5).map(l => crawl(l, depth + 1)));
}
```

### Adding API detection patterns

```ts
const API_PATTERNS = [
  /\/api\//i,
  /\/v\d+\//i,
  /\.json$/i,
  /\/graphql/i,
  /\/rpc\//i,      // ← add new patterns here
  /\/webhook/i,
];
```

---

## Security Considerations

| Concern | Mitigation |
|---|---|
| SSRF via private IPs | `localhost`, `127.0.0.1`, `192.168.*`, `10.*` rejected with 403 |
| Path traversal | Job IDs and filenames sanitized before constructing file paths |
| Persistent data | Files stored in OS temp, auto-deleted after 24 hours |
| No auth | Endpoint is public — add IP rate limiting or session auth for production |
| robots.txt | Not respected by design — user is responsible for compliance |

### Adding basic rate limiting (optional)

Use [Upstash Redis](https://upstash.com) with the `@upstash/ratelimit` package:

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});

// In your POST handler:
const ip = req.headers.get("x-forwarded-for") ?? "unknown";
const { success } = await ratelimit.limit(ip);
if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });
```

---

## Troubleshooting

### `/dashboard` returns 404

The dashboard page is at `app/dashboard/page.tsx`. If it's missing, restart the dev server after confirming the file exists:

```bash
ls app/dashboard/page.tsx
npm run dev
```

### `npm run build` exits with code 1

Most commonly caused by missing `node_modules`. Run:

```bash
npm install
npm run build
```

If TypeScript errors appear, check that `tsconfig.json` has `"strict": false` (the project does not use strict mode).

### ZIP file contains only partial content

Most modern sites use client-side rendering (React, Vue, Angular). SourcePull fetches raw HTTP responses only — it does not execute JavaScript. Sites that render content entirely in the browser will return only the initial HTML shell. Server-side rendered (Next.js, Nuxt, Laravel) and static sites are captured fully.

### The scraper times out on Vercel

Vercel Hobby has a 60-second function timeout. Reduce `maxPages` to 10–15 for large sites, or upgrade to Vercel Pro.

### Target site returns 403 Forbidden

Some sites block known bot User-Agents or require cookies. SourcePull uses a generic Chrome User-Agent but does not handle cookies or JavaScript challenges (e.g., Cloudflare Turnstile).

### Port 3000 is already in use

```bash
npm run dev -- -p 3001
```

---

## Legal Notice

SourcePull is provided for **educational and legitimate research purposes only**.

By using this tool you agree that:

- You have explicit or implied permission to access and archive the target website
- Your use complies with the target site's Terms of Service
- Your use respects the `robots.txt` directives of the target site
- Your use complies with applicable laws, including the Computer Fraud and Abuse Act (CFAA), GDPR, and relevant data protection regulations in your jurisdiction

The author assumes no liability for misuse of this software.

---

## Author

Built by **Akarsh**

- GitHub: [github.com/akarshxs](https://github.com/akarshxs)
- Instagram: [instagram.com/akarshxs](https://instagram.com/akarshxs)
