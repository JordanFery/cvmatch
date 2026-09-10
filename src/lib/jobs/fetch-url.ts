import { lookup } from "node:dns/promises";
import * as cheerio from "cheerio";

const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5 MB
const FETCH_TIMEOUT_MS = 10000;
const MAX_REDIRECTS = 3;

/**
 * True for IPs that must never be reachable from a server-side fetch
 * triggered by user input (loopback, private ranges, link-local, etc.) —
 * blocks the classic SSRF trick of pointing the importer at internal
 * infrastructure instead of a real job posting.
 */
function isPrivateIp(address: string): boolean {
  if (address.includes(":")) {
    const lower = address.toLowerCase();
    return (
      lower === "::1" ||
      lower.startsWith("fe80:") ||
      lower.startsWith("fc") ||
      lower.startsWith("fd") ||
      lower.startsWith("::ffff:127.") ||
      lower.startsWith("::")
    );
  }

  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;
  const [a, b] = parts;
  return (
    a === 127 ||
    a === 10 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

async function assertPublicHost(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Seules les URL http:// et https:// sont acceptées.");
  }
  const { address } = await lookup(url.hostname);
  if (isPrivateIp(address)) {
    throw new Error("Cette URL n'est pas accessible.");
  }
}

/**
 * LinkedIn's own job search UI (`/jobs/search-results/...`, `/jobs/collections/...`)
 * only renders the posting behind a login wall — pasting that URL from the
 * address bar always fails. The same job is also published at a public,
 * SEO-indexable `/jobs/view/{id}` URL that works without a session, so we
 * rewrite to that form whenever we can recover the job id from the query
 * string (LinkedIn always includes it as `currentJobId` on these pages).
 */
function normalizeLinkedInUrl(url: URL): URL {
  if (!/(^|\.)linkedin\.com$/i.test(url.hostname)) return url;
  if (/^\/jobs\/view\//i.test(url.pathname)) return url;

  const jobId = url.searchParams.get("currentJobId");
  if (jobId && /^\d+$/.test(jobId)) {
    return new URL(`https://www.linkedin.com/jobs/view/${jobId}`);
  }
  return url;
}

function isLinkedInLoginWall(url: URL): boolean {
  return /(^|\.)linkedin\.com$/i.test(url.hostname) && /^\/(uas\/login|authwall|checkpoint)/i.test(url.pathname);
}

/**
 * Some job boards (Indeed in particular) sit behind Cloudflare bot
 * management that fingerprints the server-side HTTP client itself — the
 * exact same request that succeeds from a browser or from `curl` comes back
 * 403/503 when made with Node's `fetch()`. There's no reliable, honest way
 * to get past that from a server-side importer, so we detect it and tell
 * the user to paste the text instead rather than surfacing a bare status
 * code. Cloudflare marks intercepted responses with this header regardless
 * of the status code it returns.
 */
function isCloudflareBlock(response: Response): boolean {
  return response.headers.get("cf-mitigated") !== null;
}

/** Fetches a page's visible text content, guarding against SSRF via a private/internal target. */
export async function fetchJobPostingText(rawUrl: string): Promise<string> {
  let current = normalizeLinkedInUrl(new URL(rawUrl));

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    await assertPublicHost(current);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": "CVMatch/1.0 (+job offer import)" },
      });
    } finally {
      clearTimeout(timeout);
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Redirection invalide.");
      current = new URL(location, current);
      if (isLinkedInLoginWall(current)) {
        throw new Error(
          "Cette offre LinkedIn nécessite d'être connecté pour être consultée et ne peut pas être récupérée automatiquement. Copiez-collez plutôt le texte de l'offre.",
        );
      }
      continue;
    }

    if (isCloudflareBlock(response)) {
      throw new Error(
        "Ce site bloque les requêtes automatisées et empêche l'import direct de cette offre. Copiez-collez plutôt le texte de l'offre.",
      );
    }

    if (!response.ok) {
      throw new Error(`La page a répondu avec le statut ${response.status}.`);
    }

    const contentLength = Number(response.headers.get("content-length") ?? 0);
    if (contentLength > MAX_RESPONSE_BYTES) {
      throw new Error("La page est trop volumineuse.");
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_RESPONSE_BYTES) {
      throw new Error("La page est trop volumineuse.");
    }

    const html = Buffer.from(buffer).toString("utf-8");
    const $ = cheerio.load(html);
    $("script, style, noscript, svg, nav, footer").remove();
    const text = $("body").text().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    return text;
  }

  throw new Error("Trop de redirections.");
}
