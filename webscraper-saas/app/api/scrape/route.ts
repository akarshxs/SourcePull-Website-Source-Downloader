import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { v4 as uuidv4 } from "uuid";

const JOBS_DIR = path.join(os.tmpdir(), "sourcepull-jobs");

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const API_PATTERNS = [/\/api\//i, /\/v\d+\//i, /\.json$/i, /\/graphql/i];

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function extractLinks(html: string, base: string, domain: string): string[] {
  const links: string[] = [];
  const seen = new Set<string>();
  const re = /(?:href|src|action)=["']([^"'#]+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw || raw.startsWith("data:") || raw.startsWith("javascript:") || raw.startsWith("mailto:")) continue;
    try {
      const resolved = raw.startsWith("//") ? "https:" + raw : raw.startsWith("/") ? new URL(raw, base).href : raw.startsWith("http") ? raw : new URL(raw, base).href;
      const key = new URL(resolved).origin + new URL(resolved).pathname;
      if (!seen.has(key)) { seen.add(key); links.push(resolved); }
    } catch {}
  }
  return links;
}

async function fetchPage(url: string): Promise<{ status: number; content: Buffer | null; contentType: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { "User-Agent": USER_AGENT } });
    const buf = Buffer.from(await res.arrayBuffer());
    return { status: res.status, content: buf, contentType: res.headers.get("content-type") || "" };
  } catch { return { status: -1, content: null, contentType: "" }; }
  finally { clearTimeout(timer); }
}

async function scrapeWebsite(targetUrl: string, outDir: string, maxDepth: number, maxPages: number) {
  const parsed = new URL(targetUrl);
  const domain = parsed.hostname;
  const visited = new Set<string>();
  const stats = { pages: 0, images: 0, scripts: 0, styles: 0, apis: 0, errors: 0 };
  const errors: string[] = [];

  for (const d of ["pages", "assets", "api_data", "errors"]) {
    fs.mkdirSync(path.join(outDir, d), { recursive: true });
  }

  async function crawl(url: string, depth: number): Promise<void> {
    const clean = url.split("#")[0].split("?")[0];
    if (visited.has(clean) || depth > maxDepth || visited.size >= maxPages) return;
    try {
      const u = new URL(url);
      if (u.hostname !== domain) return;
    } catch { return; }

    visited.add(clean);

    if (API_PATTERNS.some(p => p.test(url))) {
      const { content } = await fetchPage(url);
      if (content) {
        const fp = path.join(outDir, "api_data", encodeURIComponent(url.replace(/[^a-z0-9]/gi, "_")).slice(0, 80) + ".json");
        fs.writeFileSync(fp, content);
        stats.apis++;
      }
      return;
    }

    const { status, content, contentType } = await fetchPage(url);
    if (status !== 200 || !content) { stats.errors++; errors.push(`${status} — ${url}`); return; }

    const ext = path.extname(clean.split("?")[0]).toLowerCase();
    if ([".jpg",".jpeg",".png",".gif",".webp",".svg",".ico"].includes(ext)) { stats.images++; return; }
    if ([".css",".scss"].includes(ext)) { stats.styles++; return; }
    if ([".js",".mjs"].includes(ext)) { stats.scripts++; return; }

    let pagePath = new URL(url).pathname.replace(/^\/+/, "") || "index.html";
    if (!path.extname(pagePath)) pagePath += ".html";
    const fp = path.join(outDir, "pages", pagePath.replace(/[<>:"|?*\\]/g, "_"));
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(fp, content);
    stats.pages++;

    if (!contentType.includes("html")) return;

    const html = content.toString("utf-8");
    const links = extractLinks(html, url, domain);
    await sleep(300);

    for (let i = 0; i < links.length; i += 5) {
      await Promise.allSettled(links.slice(i, i + 5).map(l => crawl(l, depth + 1)));
    }
  }

  await crawl(targetUrl, 0);

  fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify({
    url: targetUrl, scrapedAt: new Date().toISOString(), stats, errors
  }, null, 2));

  return { stats, errors };
}

async function createZip(sourceDir: string, outputPath: string): Promise<void> {
  const archiver = await import("archiver");
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver.default("zip", { zlib: { level: 9 } });
    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, maxDepth = 2, maxPages = 20 } = body;

    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    let targetUrl: URL;
    try { targetUrl = new URL(url.startsWith("http") ? url : `https://${url}`); }
    catch { return NextResponse.json({ error: "Invalid URL" }, { status: 400 }); }

    const hostname = targetUrl.hostname;
    if (["localhost", "127.0.0.1"].includes(hostname) || hostname.startsWith("192.168.") || hostname.startsWith("10.")) {
      return NextResponse.json({ error: "Private URLs not allowed" }, { status: 403 });
    }

    const jobId = uuidv4();
    const jobDir = path.join(JOBS_DIR, jobId);
    const scrapeDir = path.join(jobDir, "scraped");
    fs.mkdirSync(scrapeDir, { recursive: true });

    const result = await scrapeWebsite(targetUrl.href, scrapeDir, Math.min(maxDepth, 4), Math.min(maxPages, 100));
    const zipName = `${hostname.replace(/\./g, "_")}_source.zip`;
    const zipPath = path.join(jobDir, zipName);
    await createZip(scrapeDir, zipPath);

    setTimeout(() => { try { fs.rmSync(jobDir, { recursive: true, force: true }); } catch {} }, 24 * 60 * 60 * 1000);

    const host = req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";

    return NextResponse.json({
      success: true, jobId,
      downloadUrl: `${proto}://${host}/api/download/${jobId}/${zipName}`,
      stats: result.stats,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "SourcePull API v2", status: "ok" });
}
