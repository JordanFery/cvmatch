// Every caller appends its own leading slash (`${SITE_URL}/path`), so a
// trailing slash left in the env var (an easy typo on a hosting platform's
// dashboard) would otherwise silently produce double-slash URLs — broken
// canonical tags, sitemap entries, and Stripe/Supabase redirect URLs that
// no longer match an exact-match allowlist.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
