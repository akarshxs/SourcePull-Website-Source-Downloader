import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { PassThrough } from "stream";   // top-level import — dynamic import fails in Vercel edge
import { v4 as uuidv4 } from "uuid";

// /tmp used only as within-invocation scratch space (createZipBuffer keeps zip in memory)

/* ─────────────────────────────── Headers ─────────────────────────────── */

const BASE_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const NAV_HEADERS: Record<string, string> = {
  "User-Agent": BASE_UA,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

function subpageHeaders(referer: string): Record<string, string> {
  return {
    ...NAV_HEADERS,
    Referer: referer,
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?0",
  };
}

const ASSET_HEADERS: Record<string, string> = {
  "User-Agent": BASE_UA,
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-Fetch-Dest": "script",
  "Sec-Fetch-Mode": "no-cors",
  "Sec-Fetch-Site": "same-origin",
};

/* ─────────────────────────────── Constants ───────────────────────────── */

const API_PATTERNS = [/\/api\//i, /\/v\d+\//i, /\.json$/i, /\/graphql/i, /\/rest\//i, /\/trpc\//i];
const IMG_EXTS   = new Set([".jpg",".jpeg",".png",".gif",".webp",".svg",".ico",".avif",".bmp"]);
const JS_EXTS    = new Set([".js",".mjs",".cjs"]);
const CSS_EXTS   = new Set([".css",".scss",".sass"]);
const FONT_EXTS  = new Set([".woff",".woff2",".ttf",".eot",".otf"]);
const SKIP_EXTS  = new Set([".pdf",".zip",".tar",".gz",".exe",".dmg",".mp4",".mp3",".mov",".avi",".mkv"]);

/* Bare hostname: strips www. and port */
function bareHost(h: string) { return h.replace(/^www\./, "").toLowerCase(); }

/* ─────────────────────────────── Fetch ───────────────────────────────── */

interface FetchResult {
  status: number;
  content: Buffer | null;
  contentType: string;
  finalUrl: string;   // URL after all redirects
}

async function doFetch(
  url: string,
  headers: Record<string, string>,
  timeoutMs = 25000,
): Promise<FetchResult> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers, redirect: "follow" });
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      status:      res.status,
      content:     buf.length > 0 ? buf : null,
      contentType: res.headers.get("content-type") ?? "",
      finalUrl:    res.url ?? url,          // native fetch exposes final URL
    };
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException;
    // Surface useful error codes for logging
    const code = e.cause ? (e.cause as NodeJS.ErrnoException).code ?? "" : "";
    return { status: code === "ECONNREFUSED" ? -2 : -1, content: null, contentType: "", finalUrl: url };
  } finally {
    clearTimeout(t);
  }
}

async function fetchWithRetry(
  url: string,
  headers: Record<string, string>,
  retries = 2,
): Promise<FetchResult> {
  for (let i = 0; i <= retries; i++) {
    if (i > 0) await sleep(600 * i);
    const r = await doFetch(url, headers, i === 0 ? 20000 : 30000);
    if (r.status !== -1) return r;           // got a real response (even 4xx/5xx)
  }
  return { status: -1, content: null, contentType: "", finalUrl: url };
}

/* ─────────────────────────────── Link extraction ─────────────────────── */

function extractLinks(html: string, baseUrl: string): string[] {
  const found = new Set<string>();

  function add(raw: string) {
    if (!raw) return;
    raw = raw.trim();
    if (
      !raw ||
      raw.startsWith("data:") ||
      raw.startsWith("javascript:") ||
      raw.startsWith("mailto:") ||
      raw.startsWith("tel:") ||
      raw.startsWith("#") ||
      raw.startsWith("blob:")
    ) return;
    try {
      const u = new URL(raw.startsWith("//") ? "https:" + raw : raw, baseUrl);
      u.hash = "";
      found.add(u.href);
    } catch {}
  }

  // 1. HTML attributes: href, src, action, data-href, data-src, content
  const attrRe = /(?:href|src|action|data-href|data-src)\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(html)) !== null) add(m[1] ?? m[2]);

  // 2. Next.js __NEXT_DATA__ — mine all string values starting with /
  const ndMatch = html.match(/<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (ndMatch) {
    try {
      const walk = (v: unknown) => {
        if (typeof v === "string" && v.startsWith("/") && !v.includes("\n")) add(v);
        else if (Array.isArray(v)) v.forEach(walk);
        else if (v && typeof v === "object") Object.values(v).forEach(walk);
      };
      walk(JSON.parse(ndMatch[1]));
    } catch {}
  }

  // 3. JSON-embedded href/url/path/to keys anywhere in page
  const jsonKeyRe = /["'](?:href|url|path|to|link)["']\s*:\s*["']([^"']{1,300})["']/gi;
  while ((m = jsonKeyRe.exec(html)) !== null) add(m[1]);

  // 4. Anchor tags with data-wf-* (Webflow)
  const wfRe = /data-wf-[^=]*=["'][^"']*["'][^>]*href=["']([^"']+)["']/gi;
  while ((m = wfRe.exec(html)) !== null) add(m[1]);

  // 5. window.location = "..." or router.push("...")
  const jsNavRe = /(?:location\.(?:href|assign|replace)|router\.push|navigate)\s*\(\s*["']([^"']{1,300})["']/gi;
  while ((m = jsNavRe.exec(html)) !== null) add(m[1]);

  return [...found];
}

/* ─────────────────────────────── Robots + Sitemap ───────────────────── */

async function getRobotsDisallowed(origin: string): Promise<Set<string>> {
  const disallowed = new Set<string>();
  try {
    const r = await doFetch(`${origin}/robots.txt`, NAV_HEADERS, 8000);
    if (r.status === 200 && r.content) {
      for (const line of r.content.toString().split("\n")) {
        const t = line.trim();
        if (t.toLowerCase().startsWith("disallow:")) {
          disallowed.add(t.slice(9).trim());
        }
      }
    }
  } catch {}
  return disallowed;
}

async function getSitemapUrls(origin: string, allowedBareHost: string): Promise<string[]> {
  const urls: string[] = [];
  const tryUrls = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/sitemap/sitemap.xml`];

  for (const su of tryUrls) {
    try {
      const r = await doFetch(su, NAV_HEADERS, 10000);
      if (r.status !== 200 || !r.content) continue;
      const xml = r.content.toString();
      const locRe = /<loc>\s*([^<]+)\s*<\/loc>/gi;
      let m: RegExpExecArray | null;
      while ((m = locRe.exec(xml)) !== null) {
        try {
          const u = new URL(m[1].trim());
          if (bareHost(u.hostname) === allowedBareHost) urls.push(u.href);
        } catch {}
      }
      if (urls.length > 0) break;   // found a working sitemap
    } catch {}
  }
  return urls;
}

/* ─────────────────────────────── Helpers ────────────────────────────── */

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function safeFilename(s: string, maxLen = 180): string {
  return s.replace(/[<>:"|?*\\]/g, "_").replace(/\/+/g, "/").slice(0, maxLen) || "file";
}

/* ─────────────────────────────── Core scraper ───────────────────────── */

async function scrapeWebsite(
  targetUrl: string,
  outDir: string,
  maxDepth: number,
  maxPages: number,
) {
  const origin0  = new URL(targetUrl).origin;
  const domain0  = new URL(targetUrl).hostname;
  const bareDomain = bareHost(domain0);

  /* We discover the "real" origin after following the root redirect */
  let realOrigin = origin0;
  let realDomain = domain0;

  const visited    = new Set<string>();   // page URLs we've processed
  const assetSeen  = new Set<string>();   // asset URLs enqueued
  const stats      = { pages:0, images:0, scripts:0, styles:0, fonts:0, apis:0, errors:0 };
  const errors:    string[] = [];
  const logLines:  string[] = [];
  const log = (msg: string) => { logLines.push(msg); console.log(msg); };

  // Create dirs
  for (const d of ["pages","assets/images","assets/scripts","assets/styles","assets/fonts","assets/other","api_data","errors"]) {
    fs.mkdirSync(path.join(outDir, d), { recursive: true });
  }

  /* ── Step 1: probe root to discover real domain (www redirect etc.) ── */
  log("→ Probing root URL...");
  const rootProbe = await fetchWithRetry(targetUrl, NAV_HEADERS);

  if (rootProbe.status === -1) {
    log("✗ Root fetch failed — DNS error or connection refused");
    errors.push(`Cannot reach ${targetUrl}`);
    stats.errors++;
    return { stats, errors, logLines };
  }

  // If redirected (e.g. qualytics.ai → www.qualytics.ai), update real domain
  if (rootProbe.finalUrl && rootProbe.finalUrl !== targetUrl) {
    try {
      const fu = new URL(rootProbe.finalUrl);
      realOrigin = fu.origin;
      realDomain = fu.hostname;
      log(`→ Followed redirect → ${rootProbe.finalUrl}`);
    } catch {}
  }

  const realBareDomain = bareHost(realDomain);

  /* Helper: is this URL on our target site? */
  function isSameSite(url: string): boolean {
    try {
      const h = bareHost(new URL(url).hostname);
      return h === bareDomain || h === realBareDomain;
    } catch { return false; }
  }

  /* ── Step 2: robots.txt + sitemap ── */
  log("→ Fetching robots.txt...");
  const disallowed = await getRobotsDisallowed(realOrigin);
  log(`→ Robots: ${disallowed.size} disallowed paths`);

  log("→ Fetching sitemap...");
  const sitemapUrls = await getSitemapUrls(realOrigin, realBareDomain);
  log(`→ Sitemap: ${sitemapUrls.length} URLs found`);

  /* ── Step 3: BFS queue ── */
  interface QItem { url: string; depth: number; referer: string }
  const queue: QItem[] = [
    { url: rootProbe.finalUrl || targetUrl, depth: 0, referer: realOrigin },
    ...sitemapUrls.slice(0, 50).map(u => ({ url: u, depth: 1, referer: targetUrl })),
  ];
  const assetQueue: string[] = [];

  /* ── Save root HTML immediately (we already fetched it) ── */
  if (rootProbe.status >= 200 && rootProbe.status < 400 && rootProbe.content) {
    const rawHtml = rootProbe.content.toString("utf-8");
    const fp = path.join(outDir, "pages", "index.html");
    fs.writeFileSync(fp, rootProbe.content);
    stats.pages++;
    visited.add((rootProbe.finalUrl || targetUrl).split("#")[0]);
    log(`✓ / → HTTP ${rootProbe.status}  ${Math.round(rootProbe.content.length / 1024)}kb`);

    // Queue links from root
    const links = extractLinks(rawHtml, rootProbe.finalUrl || targetUrl);
    for (const link of links) {
      if (!isSameSite(link)) continue;
      const ext = path.extname(new URL(link).pathname).toLowerCase();
      if (IMG_EXTS.has(ext) || JS_EXTS.has(ext) || CSS_EXTS.has(ext) || FONT_EXTS.has(ext)) {
        if (!assetSeen.has(link)) { assetSeen.add(link); assetQueue.push(link); }
      } else if (!visited.has(link.split("#")[0])) {
        queue.push({ url: link, depth: 1, referer: rootProbe.finalUrl || targetUrl });
      }
    }
  } else {
    log(`! Root returned HTTP ${rootProbe.status} — will still attempt subpages`);
  }

  /* ── Crawl a single page ── */
  async function crawlPage({ url, depth, referer }: QItem): Promise<void> {
    const cleanUrl = url.split("#")[0];
    if (visited.has(cleanUrl)) return;
    if (visited.size >= maxPages) return;
    if (depth > maxDepth) return;
    if (!isSameSite(cleanUrl)) return;

    let parsedUrl: URL;
    try { parsedUrl = new URL(cleanUrl); } catch { return; }

    const ext = path.extname(parsedUrl.pathname).toLowerCase();
    if (SKIP_EXTS.has(ext)) return;

    // Route assets to asset queue
    if (IMG_EXTS.has(ext) || JS_EXTS.has(ext) || CSS_EXTS.has(ext) || FONT_EXTS.has(ext)) {
      if (!assetSeen.has(cleanUrl)) { assetSeen.add(cleanUrl); assetQueue.push(cleanUrl); }
      return;
    }

    visited.add(cleanUrl);

    // Check robots
    for (const dp of disallowed) {
      if (dp && parsedUrl.pathname.startsWith(dp)) {
        log(`→ Skipped (robots)  ${parsedUrl.pathname}`);
        return;
      }
    }

    log(`→ ${parsedUrl.pathname || "/"}`);

    // API endpoint
    if (API_PATTERNS.some(p => p.test(cleanUrl))) {
      const r = await fetchWithRetry(cleanUrl, subpageHeaders(referer));
      if (r.content && r.status >= 200 && r.status < 400) {
        const fname = safeFilename(parsedUrl.pathname.replace(/\//g, "_")).slice(0,80) + ".json";
        fs.writeFileSync(path.join(outDir, "api_data", fname), r.content);
        stats.apis++;
        log(`✓ API  ${parsedUrl.pathname}`);
      }
      return;
    }

    const r = await fetchWithRetry(cleanUrl, depth === 0 ? NAV_HEADERS : subpageHeaders(referer));

    if (r.status === -1) {
      stats.errors++;
      errors.push(`TIMEOUT — ${cleanUrl}`);
      log(`✗ Timeout  ${parsedUrl.pathname}`);
      return;
    }

    // 3xx redirects are followed by fetch() automatically — if we get here it's final
    // Accept any 2xx; also accept 403 content (sometimes contains partial HTML)
    const ok = r.status >= 200 && r.status < 400;
    if (!ok || !r.content) {
      stats.errors++;
      errors.push(`HTTP ${r.status} — ${cleanUrl}`);
      log(`✗ HTTP ${r.status}  ${parsedUrl.pathname}`);
      return;
    }

    // Build page file path
    let pagePath = parsedUrl.pathname.replace(/^\/+/, "") || "index";
    if (!path.extname(pagePath)) pagePath += ".html";
    pagePath = safeFilename(pagePath);
    const fp = path.join(outDir, "pages", pagePath);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(fp, r.content);
    stats.pages++;
    log(`✓ ${parsedUrl.pathname}  HTTP ${r.status}  ${Math.round(r.content.length / 1024)}kb`);

    if (!r.contentType.includes("html")) return;

    const html = r.content.toString("utf-8");

    // Warn about JS-only shells
    if (r.content.length < 2000 && html.includes("<div id=")) {
      log(`! ${parsedUrl.pathname} — looks like a JS-only shell (${r.content.length} bytes)`);
    }

    const links = extractLinks(html, r.finalUrl || cleanUrl);
    for (const link of links) {
      if (!isSameSite(link)) continue;
      const lext = path.extname(new URL(link).pathname).toLowerCase();
      if (IMG_EXTS.has(lext) || JS_EXTS.has(lext) || CSS_EXTS.has(lext) || FONT_EXTS.has(lext)) {
        if (!assetSeen.has(link)) { assetSeen.add(link); assetQueue.push(link); }
      } else {
        const clean2 = link.split("#")[0];
        if (!visited.has(clean2) && depth + 1 <= maxDepth) {
          queue.push({ url: link, depth: depth + 1, referer: cleanUrl });
        }
      }
    }
  }

  /* ── BFS loop ── */
  while (queue.length > 0 && visited.size < maxPages) {
    const batch = queue.splice(0, 4);
    await Promise.allSettled(batch.map(item => crawlPage(item)));
    if (queue.length > 0) await sleep(150);
  }

  /* ── Download assets ── */
  log(`\n→ Downloading ${assetQueue.length} assets...`);

  async function downloadAsset(assetUrl: string): Promise<void> {
    const ext = path.extname(new URL(assetUrl).pathname).toLowerCase();
    if (SKIP_EXTS.has(ext)) return;

    const r = await doFetch(assetUrl, ASSET_HEADERS, 20000);
    if (!r.content || r.status < 200 || r.status >= 400) return;

    let cat = "other";
    if (IMG_EXTS.has(ext) || r.contentType.startsWith("image/"))        { cat = "images";  stats.images++;  }
    else if (JS_EXTS.has(ext)  || r.contentType.includes("javascript")) { cat = "scripts"; stats.scripts++; }
    else if (CSS_EXTS.has(ext) || r.contentType.includes("css"))        { cat = "styles";  stats.styles++;  }
    else if (FONT_EXTS.has(ext) || r.contentType.includes("font"))      { cat = "fonts";   stats.fonts++;   }

    try {
      const u = new URL(assetUrl);
      let fp = (u.hostname !== realDomain ? u.hostname + "/" : "") + u.pathname;
      fp = safeFilename(fp.replace(/^\/+/, ""));
      if (!path.extname(fp)) {
        const extMap: Record<string, string> = {
          "text/css": ".css", "application/javascript": ".js", "text/javascript": ".js",
          "image/svg+xml": ".svg", "image/png": ".png", "image/jpeg": ".jpg",
          "image/webp": ".webp", "font/woff2": ".woff2", "font/woff": ".woff",
        };
        for (const [ct, ex] of Object.entries(extMap)) {
          if (r.contentType.includes(ct)) { fp += ex; break; }
        }
      }
      const fullPath = path.join(outDir, "assets", cat, fp.slice(0, 200));
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, r.content);
    } catch {}
  }

  for (let i = 0; i < assetQueue.length; i += 8) {
    await Promise.allSettled(assetQueue.slice(i, i + 8).map(downloadAsset));
  }

  const totalAssets = stats.images + stats.scripts + stats.styles + stats.fonts;
  log(`\n✓ Done — ${stats.pages} pages · ${totalAssets} assets · ${stats.apis} APIs · ${stats.errors} errors`);

  // Manifest
  fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify({
    url: targetUrl, finalUrl: rootProbe.finalUrl, domain: realDomain,
    scrapedAt: new Date().toISOString(), stats,
    pagesVisited: [...visited], errors, crawlLog: logLines,
  }, null, 2));

  if (errors.length) {
    fs.writeFileSync(path.join(outDir, "errors", "error.log"), errors.join("\n"));
  }

  return { stats, errors, logLines };
}

/* ─────────────────────────────── ZIP ────────────────────────────────── */

/* createZipBuffer — in-memory ZIP, no file write.
   Key fix: PassThrough imported at top level (dynamic import breaks in Vercel Node runtime).
   archiver is also required synchronously via serverExternalPackages config. */
async function createZipBuffer(sourceDir: string): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const archiver = require("archiver");

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const passthrough = new PassThrough();

    passthrough.on("data", (chunk: unknown) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as ArrayBuffer));
    });
    passthrough.on("end", () => resolve(Buffer.concat(chunks)));
    passthrough.on("error", reject);

    const archive = archiver("zip", { zlib: { level: 6 } });
    archive.on("error", reject);
    archive.pipe(passthrough);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

/* ─────────────────────────────── Route handlers ─────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, maxDepth = 2, maxPages = 20 } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Block private addresses
    const h = targetUrl.hostname;
    if (
      h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" ||
      h.startsWith("192.168.") || h.startsWith("10.") || h.startsWith("172.16.") ||
      h.endsWith(".local") || h.endsWith(".internal")
    ) {
      return NextResponse.json({ error: "Private/local URLs are not allowed" }, { status: 403 });
    }

    // Use /tmp only as scratch space within this single function call
    const jobId     = uuidv4();
    const scrapeDir = path.join(os.tmpdir(), "sp-" + jobId);
    fs.mkdirSync(scrapeDir, { recursive: true });

    const result = await scrapeWebsite(
      targetUrl.href, scrapeDir,
      Math.max(1, Math.min(maxDepth, 4)),
      Math.max(1, Math.min(maxPages, 100)),
    );

    // Build ZIP entirely in memory — no separate download endpoint needed.
    // Fixes "File wasn't available on site" on Vercel: /tmp is per-invocation
    // so a second request (GET /api/download) would always find an empty /tmp.
    const zipName   = `${h.replace(/\./g, "_")}_source.zip`;
    const zipBuffer = await createZipBuffer(scrapeDir);
    const zipBase64 = zipBuffer.toString("base64");

    // Clean up scratch dir immediately
    try { fs.rmSync(scrapeDir, { recursive: true, force: true }); } catch {}

    return NextResponse.json({
      success:   true,
      jobId,
      zipName,
      zipBase64,                       // client decodes this into a Blob and downloads
      zipSizeKb: Math.round(zipBuffer.length / 1024),
      stats:     result?.stats    ?? { pages:0, images:0, scripts:0, styles:0, fonts:0, apis:0, errors:0 },
      logLines:  result?.logLines ?? [],
    });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "SourcePull Scraper API v3", status: "ok" });
}
