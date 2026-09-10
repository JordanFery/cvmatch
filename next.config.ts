import type { NextConfig } from "next";

// This project's Vercel team has a policy blocking any environment variable
// named with a public framework prefix (NEXT_PUBLIC_) from being saved at
// all, even for values — like the Supabase anon key — that are genuinely
// meant to reach the browser. Vercel env vars are therefore stored WITHOUT
// the prefix (e.g. SUPABASE_URL), and re-exposed under the NEXT_PUBLIC_
// name the app code expects via the `env` field below, which inlines them
// into the JS bundle at build time exactly like a real NEXT_PUBLIC_ var
// would — see node_modules/next/dist/docs/.../config/env.md. Every one of
// these six is genuinely safe to expose (Supabase anon key/URL, the site's
// own public URL, an analytics id, a support email, a legal entity name)
// — none of them are secrets.
const PUBLIC_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.SITE_URL,
  NEXT_PUBLIC_GA_ID: process.env.GA_ID,
  NEXT_PUBLIC_SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
  NEXT_PUBLIC_LEGAL_ENTITY_NAME: process.env.LEGAL_ENTITY_NAME,
};

const supabaseUrl = PUBLIC_ENV.NEXT_PUBLIC_SUPABASE_URL;

// Deliberately not nonce-based/strict-dynamic: that requires threading a
// per-request nonce through proxy.ts into every inline script (including
// the one @next/third-parties/google injects for GA config) and would need
// live testing across every route to avoid silently breaking something.
// 'unsafe-inline' for script/style is a real weakening vs. a strict CSP,
// but this header set still blocks framing (clickjacking), restricts what
// origins can be fetched/connected to, and forbids <object>/<embed> —
// meaningfully better than no CSP at all, with zero runtime performance
// cost either way (it's headers, not code that runs).
// React/Turbopack's dev-mode debugging tools (stack-trace reconstruction,
// HMR) call eval() — never in a production build, only in `next dev`. Scope
// 'unsafe-eval' to non-production so the real, deployed CSP stays strict.
const scriptSrcEval = process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${scriptSrcEval} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    supabaseUrl,
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://www.googletagmanager.com",
  ]
    .filter(Boolean)
    .join(" "),
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Only meaningful over HTTPS (which is all production traffic goes over);
  // harmless to send in local HTTP dev since browsers ignore it there.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  env: PUBLIC_ENV,
  // pdfjs-dist (used by pdf-parse) dynamically imports its worker script by
  // file path at runtime; bundling it breaks that resolution ("Setting up
  // fake worker failed"). Keeping it external lets Node load it straight
  // from node_modules, where the worker file actually exists.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  experimental: {
    serverActions: {
      // CV uploads go straight to a Server Action as FormData; the default
      // 1 MB cap is well under our MAX_CV_FILE_SIZE (10 MB, see
      // src/lib/validations/cv.ts) — actual size is still enforced there.
      bodySizeLimit: "12mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
