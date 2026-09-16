import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { locales, defaultLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";

const PROTECTED_PREFIX = "/dashboard";
const AUTH_ROUTE_PATTERN = /^\/(fr|en)\/(login|register)(\/|$)/;
const ALREADY_PREFIXED = /^\/(fr|en)(\/|$)/;
// Never gets a locale prefix — see i18n plan A1 (not indexed, no SEO reason to).
const NEVER_LOCALIZED_PREFIXES = ["/dashboard", "/api", "/auth"];
// Public paths that moved under [locale] (see i18n plan A1/A6) — bare
// requests to these get redirected, never rewritten, so Google's index
// transfers to the new URL instead of treating it as a duplicate.
const LOCALIZED_PUBLIC_PATHS = ["/pricing", "/contact", "/privacy", "/terms", "/login", "/register", "/blog"];

function isBarePublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return LOCALIZED_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Locale for a bare-path redirect: cookie preference first, then Accept-Language, then the site default. */
function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  // Only the first (most-preferred) language tag matters here — good enough
  // for a two-locale site; hreflang + the sitemap are what tell Google about
  // the other language, not this redirect (see i18n plan A4).
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (acceptLanguage.toLowerCase().startsWith("en")) return "en";

  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isNeverLocalized = NEVER_LOCALIZED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isNeverLocalized && !ALREADY_PREFIXED.test(pathname) && isBarePublicPath(pathname)) {
    const locale = detectLocale(request);
    const suffix = pathname === "/" ? "" : pathname;
    const target = new URL(`/${locale}${suffix}`, request.url);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, 308);
  }

  const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX);
  const isAuthRoute = AUTH_ROUTE_PATTERN.test(pathname);

  if (isProtectedRoute && !user) {
    const locale = detectLocale(request);
    const redirectUrl = new URL(`/${locale}/login`, request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest (metadata files)
     * - icon/apple-icon/opengraph-image/twitter-image (generated metadata routes —
     *   static, never personalized, so paying a real network round trip to
     *   Supabase's auth server for these was pure overhead: browsers fetch
     *   several of these per navigation (favicon-ish icons, OG image probes),
     *   each one previously costing 100-400ms for a check whose result was
     *   never even used)
     * - static assets (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|icon|apple-icon|opengraph-image|twitter-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
