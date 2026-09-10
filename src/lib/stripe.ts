import "server-only";
import Stripe from "stripe";

// Enforced by the "server-only" import above (build fails if a Client
// Component ends up pulling this module in) — the secret key never reaches the browser.
//
// Lazily constructed rather than a top-level `new Stripe(...)`: Next.js's
// build-time "collect page data" step imports every route module — even
// ones that only ever run dynamically at request time — just to inspect
// their config. A top-level construction would run right then, crashing
// the *entire build* the moment STRIPE_SECRET_KEY isn't set in that
// environment (e.g. a preview deployment that doesn't have every secret
// configured yet). Deferring construction to first real use means a
// missing key only breaks the one feature that actually needs Stripe, at
// the moment it's actually called — not the build.
let cached: Stripe | undefined;

export function getStripe(): Stripe {
  if (!cached) {
    cached = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return cached;
}
