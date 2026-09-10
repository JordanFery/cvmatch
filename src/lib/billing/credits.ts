import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { CREDIT_ACTION_LABELS, CREDIT_COSTS, PLANS, type CreditAction } from "@/lib/billing/plans";
import type { AuthUser } from "@/lib/data/profile";

/** Minimum time between one user's credit-consuming AI actions — well under
 * normal human click speed, but enough to blunt a scripted burst-loop. */
const AI_ACTION_COOLDOWN_MS = 2000;

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Returns the user's subscription, creating a free-tier row on first use and
 * lazily rolling the monthly credit allowance forward if the reset date has
 * passed. This is the only place credits get refilled for free-tier users;
 * paid tiers are also refilled precisely by the Stripe webhook on renewal.
 */
export async function getOrCreateSubscription(userId: string) {
  let subscription = await prisma.subscription.findUnique({ where: { userId } });

  if (!subscription) {
    // Concurrent server-rendered requests (e.g. the sidebar and the dashboard
    // page) can both reach this branch for a brand-new user at the same
    // time. Whichever loses the race to insert hits a unique constraint
    // violation (P2002) instead of erroring the request — it just reads
    // back the row the winner created.
    try {
      subscription = await prisma.subscription.create({
        data: {
          userId,
          plan: "FREE",
          status: "ACTIVE",
          creditsRemaining: PLANS.FREE.monthlyCredits,
          creditsResetAt: addMonths(new Date(), 1),
        },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
      subscription = await prisma.subscription.findUniqueOrThrow({ where: { userId } });
    }
  }

  if (subscription.creditsResetAt.getTime() <= Date.now()) {
    subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        creditsRemaining: PLANS[subscription.plan].monthlyCredits,
        creditsResetAt: addMonths(new Date(), 1),
      },
    });
  }

  return subscription;
}

type ConsumeResult = { ok: true } | { ok: false; error: string };

/**
 * Checks and deducts credits for an AI action. Call this immediately before
 * invoking the LLM — never after — so a blocked user never triggers (and
 * never gets billed for) an API call.
 *
 * Also enforces two abuse-prevention checks that belong here rather than in
 * every caller, since every credit-consuming action already goes through
 * this single choke point: the account's email must be confirmed (blocks
 * disposable/unverified accounts from farming free credits), and a short
 * per-user cooldown (blocks a scripted burst loop; invisible at normal
 * human speed).
 *
 * The "enough credits?" check and the deduction are done as a single
 * conditional `updateMany` (its `where` re-checks `creditsRemaining >=
 * cost` and the cooldown) rather than a separate read followed by a write.
 * Postgres serializes concurrent updates to the same row, so this closes a
 * real race: with a plain read-then-write, N parallel requests can all
 * read the same "sufficient" balance before any of them commits, each
 * deduct on top of that stale read, and collectively spend far more than
 * the account actually has (even driving `creditsRemaining` negative). A
 * conditional `updateMany` makes each request re-evaluate the *current*
 * row, so only as many of the N requests succeed as the balance actually
 * covers — the rest get `count: 0` and are correctly rejected.
 */
export async function consumeCredits(user: AuthUser, action: CreditAction): Promise<ConsumeResult> {
  const userId = user.id;
  const cost = CREDIT_COSTS[action];

  if (!user.emailConfirmed) {
    return {
      ok: false,
      error: "Confirmez votre adresse e-mail pour utiliser les fonctionnalités IA. Vérifiez votre boîte de réception.",
    };
  }

  const subscription = await getOrCreateSubscription(userId);
  const cooldownOk = { OR: [{ lastAiActionAt: null }, { lastAiActionAt: { lte: new Date(Date.now() - AI_ACTION_COOLDOWN_MS) } }] };

  if (PLANS[subscription.plan].unlimited) {
    // Still tracked even though it's never billed — lifetime usage drives badges/rewards regardless of plan.
    const result = await prisma.subscription.updateMany({
      where: { userId, ...cooldownOk },
      data: { creditsUsedLifetime: { increment: cost }, lastAiActionAt: new Date() },
    });
    if (result.count === 0) {
      return { ok: false, error: "Trop de requêtes en peu de temps. Merci de patienter quelques secondes." };
    }
    return { ok: true };
  }

  const result = await prisma.subscription.updateMany({
    where: { userId, creditsRemaining: { gte: cost }, ...cooldownOk },
    data: {
      creditsRemaining: { decrement: cost },
      creditsUsedLifetime: { increment: cost },
      lastAiActionAt: new Date(),
    },
  });

  if (result.count === 0) {
    // The atomic update was rejected — re-read to tell the caller *why*
    // (insufficient credits vs. cooldown). Only happens on the rejection
    // path, so it costs nothing on the (much more common) success path.
    const fresh = await prisma.subscription.findUniqueOrThrow({ where: { userId } });
    if (fresh.lastAiActionAt && Date.now() - fresh.lastAiActionAt.getTime() < AI_ACTION_COOLDOWN_MS) {
      return { ok: false, error: "Trop de requêtes en peu de temps. Merci de patienter quelques secondes." };
    }
    return {
      ok: false,
      error: `Crédits insuffisants pour "${CREDIT_ACTION_LABELS[action]}" (${cost} requis, ${fresh.creditsRemaining} restants). Passez à un forfait supérieur pour continuer.`,
    };
  }

  return { ok: true };
}
