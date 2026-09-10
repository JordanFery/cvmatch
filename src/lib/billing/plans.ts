/**
 * Pricing model.
 *
 * Every paid AI action runs on Claude Opus 5 ($5 / MTok input, $25 / MTok
 * output — see the Claude API skill's pricing table). Estimated real-world
 * cost per action (input + output tokens, including the model's own
 * thinking, which bills as output):
 *
 *   - CV parsing (src/lib/cv/parse-with-llm.ts):            ~$0.07–0.10
 *   - Job offer parsing (src/lib/jobs/parse-with-llm.ts):    ~$0.04–0.06
 *   - ATS analysis (src/lib/ats/analyze-with-llm.ts):        ~$0.04–0.06
 *   - Tailored CV generation (src/lib/tailored-cv/...):      ~$0.12–0.20
 *     (highest cost: sends the full CV twice — as text and as JSON — to a
 *     high-effort call that regenerates the entire document)
 *   - Cover letter generation (src/lib/cover-letter/...):     ~$0.08–0.15
 *     (adds web_search/web_fetch server-tool calls on top of the base
 *     generation cost — roughly $0.01 per search/fetch use, up to a few
 *     uses per letter — so this is a rougher estimate than the others;
 *     revisit once real usage.server_tool_use numbers exist)
 *
 * These are estimates from prompt/response size, not measured billing data
 * — revisit with real `response.usage` numbers once there's production
 * traffic (see CREDIT_COSTS below for the per-action credit price, sized
 * with headroom over the estimates above).
 *
 * 1 credit is priced to cover ~$0.05 USD of API cost. Plan prices are in
 * CAD (~1.38 CAD/USD, ~0.069 CAD per credit of cost — an approximate rate,
 * revisit against the actual rate at charge time). They target a
 * comfortable gross margin even if a subscriber used their entire monthly
 * allowance (which real users rarely do in full), after Stripe fees
 * (~3%) and infra (Supabase/Vercel, a few dollars/month, amortized):
 *
 *   - ESSENTIAL: 100 credits × $0.069 CAD ≈ $6.90 CAD cost → priced at
 *     $14.99 CAD, ~54% gross margin.
 *   - PRO: 300 credits × $0.069 CAD ≈ $20.70 CAD cost → priced at $39.99
 *     CAD, ~48% gross margin (a straight EUR→CAD conversion of the old
 *     19,99 € sticker would have landed near $29 CAD, only ~30% margin —
 *     too thin once Stripe fees and infra are subtracted).
 *
 * NOTE: these prices only drive the UI and the credit ledger. The actual
 * amount charged comes from the Stripe Price objects referenced by
 * STRIPE_PRICE_ESSENTIAL/STRIPE_PRICE_PRO — those must be updated (or
 * recreated as CAD prices) in the Stripe dashboard to match.
 */

export const CREDIT_COSTS = {
  CV_PARSE: 2,
  JOB_PARSE: 1,
  ATS_ANALYSIS: 1,
  TAILORED_CV: 3,
  COVER_LETTER: 3,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export type PlanIdValue = "FREE" | "ESSENTIAL" | "PRO" | "VIP";

/** Sentinel monthly allowance for the VIP plan — not actually infinite (an Int column needs a value), just large enough that no real usage pattern could exhaust it. */
export const UNLIMITED_CREDITS = 1_000_000;

export type Plan = {
  id: PlanIdValue;
  name: string;
  priceLabel: string;
  priceCents: number;
  monthlyCredits: number;
  description: string;
  features: string[];
  /** Name of the env var holding this plan's Stripe Price ID. Undefined for plans with no checkout (free, VIP). */
  stripePriceEnvVar?: "STRIPE_PRICE_ESSENTIAL" | "STRIPE_PRICE_PRO";
  highlighted?: boolean;
  /** True for plans that never run out and never decrement credits — currently VIP only, granted manually, never purchasable. */
  unlimited?: boolean;
};

export const PLANS: Record<PlanIdValue, Plan> = {
  VIP: {
    id: "VIP",
    name: "VIP",
    priceLabel: "—",
    priceCents: 0,
    monthlyCredits: UNLIMITED_CREDITS,
    description: "Accès illimité, réservé en interne.",
    unlimited: true,
    features: ["Crédits illimités", "Tout déverrouillé"],
  },
  FREE: {
    id: "FREE",
    name: "Gratuit",
    priceLabel: "0 $ CA",
    priceCents: 0,
    monthlyCredits: 10,
    description: "Pour découvrir CVMatch.",
    features: [
      "10 crédits IA par mois",
      "CV maître et offres illimités",
      "Suivi des candidatures",
    ],
  },
  ESSENTIAL: {
    id: "ESSENTIAL",
    name: "Essentiel",
    priceLabel: "14,99 $ CA",
    priceCents: 1499,
    monthlyCredits: 100,
    description: "Pour une recherche d'emploi active.",
    stripePriceEnvVar: "STRIPE_PRICE_ESSENTIAL",
    features: [
      "100 crédits IA par mois",
      "~10 CV adaptés générés par mois",
      "Analyses ATS illimitées dans la limite des crédits",
      "Support par e-mail",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    priceLabel: "39,99 $ CA",
    priceCents: 3999,
    monthlyCredits: 300,
    description: "Pour une recherche intensive ou plusieurs profils.",
    stripePriceEnvVar: "STRIPE_PRICE_PRO",
    highlighted: true,
    features: [
      "300 crédits IA par mois",
      "~30 CV adaptés générés par mois",
      "Traitement prioritaire",
      "Support par e-mail",
    ],
  },
};

/** Plans shown on /pricing and the "change plan" cards — VIP is never purchasable or advertised. */
export const PUBLIC_PLANS: Plan[] = [PLANS.FREE, PLANS.ESSENTIAL, PLANS.PRO];

export const CREDIT_ACTION_LABELS: Record<CreditAction, string> = {
  CV_PARSE: "Analyse de CV",
  JOB_PARSE: "Analyse d'offre",
  ATS_ANALYSIS: "Analyse ATS",
  TAILORED_CV: "Génération de CV adapté",
  COVER_LETTER: "Génération de lettre de motivation",
};

export function getStripePriceId(planId: "ESSENTIAL" | "PRO"): string {
  const envVar = PLANS[planId].stripePriceEnvVar!;
  const value = process.env[envVar];
  if (!value) {
    throw new Error(`Missing environment variable ${envVar} for plan ${planId}.`);
  }
  return value;
}

export function getPlanByStripePriceId(priceId: string): PlanIdValue | null {
  for (const plan of Object.values(PLANS)) {
    if (plan.stripePriceEnvVar && process.env[plan.stripePriceEnvVar] === priceId) {
      return plan.id;
    }
  }
  return null;
}
