import * as fs from "fs";
import * as path from "path";
import { URL } from "url";

export interface ScraperStats {
  pages: number;
  images: number;
  scripts: number;
  styles: number;
  apis: number;
  errors: number;
}

export interface ScraperResult {
  stats: ScraperStats;
  files: string[];
  errors: string[];
  outputDir: string;
}

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const ASSET_EXTENSIONS = {
  images: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".avif"],
  scripts: [".js", ".mjs", ".ts"],
  styles: [".css", ".sass", ".scss"],
  fonts: [".woff", ".woff2", ".ttf", ".eot", ".otf"],
};

const API_PATTERNS = [
  /\/api\//i,
  /\/v\d+\//i,
  /\.json$/i,
  /\/graphql/i,
  /\/rest\//i,
  /\/endpoint/i,
];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function getFileCategory(urlStr: string): keyof typeof ASSET_EXTENSIONS | "api" | "page" | "other" {
  const ext = path.extname(urlStr.split("?")[0]).toLowerCase();

  for (const [cat, exts] of Object.entries(ASSET_EXTENSIONS)) {
    if (exts.includes(ext)) return cat as keyof typeof ASSET_EXTENSIONS;
  }

  if (API_PATTERNS.some((p) => p.test(urlStr))) return "api";
  if (ext === ".html" || ext === ".htm" || ext === "") return "page";
  return "other";
}

function sanitizePath(urlPath: string): string {
  return urlPath
    .replace(/^\/+/, "")
    .replace(/[?#].*$/, "")
    .replace(/[<>:"|?*\\]/g, "_")
    .replace(/\/{2,}/g, "/")
    .substring(0, 200);
}

async function fetchWithTimeout(url: string, timeoutMs = 20000): Promise<{ status: number; content: Buffer | null; contentType: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const buffer = Buffer.from(await res.arrayBuffer());
    return { status: res.status, content: buffer, contentType };
  } catch {
    return { status: -1, content: null, contentType: "" };
  } finally {
    clearTimeout(timer);
  }
}

function extractLinks(html: string, baseUrl: string, domain: string): string[] {
  const links: string[] = [];
  const seen = new Set<string>();

  // Extract href and src attributes
  const patterns = [
    /href=["']([^"'#]+)["']/gi,
    /src=["']([^"']+)["']/gi,
    /action=["']([^"']+)["']/gi,
    /fetch\(["']([^"']+)["']/gi,
    /axios\.[a-z]+\(["']([^"']+)["']/gi,
    /url:\s*["']([^"']+)["']/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const raw = match[1].trim();
      if (!raw || raw.startsWith("data:") || raw.startsWith("javascript:") || raw.startsWith("mailto:")) continue;

      try {
        const resolved = raw.startsWith("//")
          ? `https:${raw}`
          : raw.startsWith("/")
          ? new URL(raw, baseUrl).href
          : raw.startsWith("http")
          ? raw
          : new URL(raw, baseUrl).href;

        const parsed = new URL(resolved);
        const key = parsed.origin + parsed.pathname;

        if (!seen.has(key)) {
          seen.add(key);
          links.push(resolved);
        }
      } catch {
        // ignore invalid URLs
      }
    }
  }

  return links;
}

export class WebScraper {
  private targetUrl: string;
  private domain: string;
  private origin: string;
  private maxDepth: number;
  private maxPages: number;
  private outputDir: string;
  private visitedUrls = new Set<string>();
  private downloadedFiles = new Set<string>();
  private apiEndpoints = new Set<string>();
  private errorLog: string[] = [];
  private fileList: string[] = [];
  public stats: ScraperStats = {
    pages: 0, images: 0, scripts: 0, styles: 0, apis: 0, errors: 0,
  };

  constructor(url: string, outputDir: string, maxDepth = 2, maxPages = 20) {
    const parsed = new URL(url);
    this.targetUrl = url;
    this.domain = parsed.hostname;
    this.origin = parsed.origin;
    this.maxDepth = maxDepth;
    this.maxPages = maxPages;
    this.outputDir = outputDir;

    // Create directory structure
    for (const dir of ["pages", "assets/images", "assets/scripts", "assets/styles", "assets/fonts", "api_data", "errors"]) {
      fs.mkdirSync(path.join(outputDir, dir), { recursive: true });
    }
  }

  private writeFile(subPath: string, content: Buffer | string): void {
    const fullPath = path.join(this.outputDir, subPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
    this.fileList.push(subPath);
  }

  private async downloadAsset(assetUrl: string, category: string): Promise<void> {
    if (this.downloadedFiles.has(assetUrl)) return;
    this.downloadedFiles.add(assetUrl);

    const { status, content, contentType } = await fetchWithTimeout(assetUrl);
    if (status !== 200 || !content) return;

    try {
      const parsed = new URL(assetUrl);
      let filePath = sanitizePath(parsed.pathname);
      if (!filePath) filePath = "index" + (contentType.includes("css") ? ".css" : ".js");

      const subPath = `assets/${category}/${filePath}`;
      this.writeFile(subPath, content);

      if (category === "images") this.stats.images++;
      else if (category === "scripts") this.stats.scripts++;
      else if (category === "styles") this.stats.styles++;
    } catch {
      this.stats.errors++;
    }
  }

  private async scrapePage(url: string, depth: number): Promise<void> {
    // Normalise URL (remove hash/query for dedup)
    const cleanUrl = url.split("#")[0].split("?")[0];

    if (this.visitedUrls.has(cleanUrl)) return;
    if (depth > this.maxDepth) return;
    if (this.visitedUrls.size >= this.maxPages) return;

    // Check domain
    try {
      const parsed = new URL(url);
      if (parsed.hostname !== this.domain) {
        // Still download same-origin assets even from subpaths
        const cat = getFileCategory(url);
        if (cat !== "page" && cat !== "other") {
          await this.downloadAsset(url, cat as string);
        }
        return;
      }
    } catch {
      return;
    }

    this.visitedUrls.add(cleanUrl);

    const { status, content, contentType } = await fetchWithTimeout(url);

    if (status !== 200 || !content) {
      this.stats.errors++;
      this.errorLog.push(`${status} — ${url}`);
      return;
    }

    // Detect API endpoints
    if (API_PATTERNS.some((p) => p.test(url))) {
      this.apiEndpoints.add(url);
      this.stats.apis++;
      const parsed = new URL(url);
      const filePath = `api_data/${sanitizePath(parsed.pathname)}.json`;
      this.writeFile(filePath, content);
      return;
    }

    // Save HTML page
    const parsedUrl = new URL(url);
    let pagePath = sanitizePath(parsedUrl.pathname);
    if (!pagePath || pagePath.endsWith("/")) {
      pagePath = path.join(pagePath, "index.html");
    } else if (!path.extname(pagePath)) {
      pagePath += ".html";
    }

    this.writeFile(`pages/${pagePath}`, content);
    this.stats.pages++;

    // Only parse HTML
    if (!contentType.includes("html")) return;

    const html = content.toString("utf-8");
    const links = extractLinks(html, url, this.domain);

    await sleep(300); // polite crawl delay

    const promises: Promise<void>[] = [];
    for (const link of links) {
      try {
        const cat = getFileCategory(link);
        if (cat === "page" || cat === "other") {
          promises.push(this.scrapePage(link, depth + 1));
        } else if (cat !== "fonts") {
          promises.push(this.downloadAsset(link, cat));
        }
      } catch {
        // ignore
      }
    }

    // Process in batches of 5 for concurrency
    for (let i = 0; i < promises.length; i += 5) {
      await Promise.allSettled(promises.slice(i, i + 5));
    }
  }

  async run(): Promise<ScraperResult> {
    await this.scrapePage(this.targetUrl, 0);

    // Write index and error log
    this.writeFile(
      "index.json",
      JSON.stringify({ url: this.targetUrl, scrapedAt: new Date().toISOString(), stats: this.stats, files: this.fileList }, null, 2)
    );

    if (this.errorLog.length > 0) {
      this.writeFile("errors/error.log", this.errorLog.join("\n"));
    }

    if (this.apiEndpoints.size > 0) {
      this.writeFile(
        "api_data/endpoints.json",
        JSON.stringify({ discovered: [...this.apiEndpoints] }, null, 2)
      );
    }

    return {
      stats: this.stats,
      files: this.fileList,
      errors: this.errorLog,
      outputDir: this.outputDir,
    };
  }
}
