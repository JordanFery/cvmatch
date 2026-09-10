import "server-only";
import Stripe from "stripe";

// Enforced by the "server-only" import above (build fails if a Client
// Component ends up pulling this module in) — the secret key never reaches the browser.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
