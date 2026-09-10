import "server-only";
import { prisma } from "@/lib/prisma";
import { getOrCreateSubscription } from "@/lib/billing/credits";
import { BADGE_CATALOG, type BadgeDefinition, type BadgeStats } from "@/lib/badges/catalog";

export async function getBadgeStats(userId: string): Promise<BadgeStats> {
  const [cvCount, jobOfferCount, atsAnalysisCount, tailoredCvCount, sentApplicationsCount, interviewCount, subscription] =
    await Promise.all([
      prisma.cv.count({ where: { userId } }),
      prisma.jobOffer.count({ where: { userId } }),
      prisma.atsAnalysis.count({ where: { userId, status: "READY" } }),
      prisma.tailoredCv.count({ where: { userId, status: "READY" } }),
      prisma.jobOffer.count({ where: { userId, applicationStatus: { not: "NOT_SENT" } } }),
      prisma.jobOffer.count({ where: { userId, applicationStatus: "INTERVIEW" } }),
      getOrCreateSubscription(userId),
    ]);

  return {
    cvCount,
    jobOfferCount,
    atsAnalysisCount,
    tailoredCvCount,
    sentApplicationsCount,
    interviewCount,
    creditsUsedLifetime: subscription.creditsUsedLifetime,
  };
}

/**
 * Evaluates the full badge catalog against the user's current stats and
 * awards any newly-earned ones. Idempotent — already-earned ids are
 * skipped via the (userId, badgeId) unique index.
 *
 * Each award is a single `INSERT ... ON CONFLICT (user_id, badge_id) DO
 * NOTHING RETURNING badge_id` — never a plain create — specifically so two
 * concurrent calls that both cross the same badge's threshold at once
 * (e.g. two parallel requests finishing the action that earns it) can't
 * both apply its credit bonus. Whichever call's INSERT actually lands the
 * row is the one whose `RETURNING` isn't empty; only that call adds the
 * bonus. A plain `createMany({ skipDuplicates: true })` looked idempotent
 * but wasn't: it silently no-ops the duplicate *row*, yet gives no signal
 * to skip the credit increment that used to run unconditionally alongside
 * it — so both concurrent calls would still grant the bonus.
 */
export async function checkAndAwardBadges(userId: string): Promise<BadgeDefinition[]> {
  const [stats, earned] = await Promise.all([
    getBadgeStats(userId),
    prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
  ]);
  const earnedIds = new Set(earned.map((b) => b.badgeId));

  const candidates = BADGE_CATALOG.filter((badge) => !earnedIds.has(badge.id) && badge.check(stats));
  if (candidates.length === 0) return [];

  const newlyEarned: BadgeDefinition[] = [];
  for (const badge of candidates) {
    const inserted = await prisma.$queryRaw<{ badge_id: string }[]>`
      INSERT INTO user_badges (id, user_id, badge_id, earned_at)
      VALUES (gen_random_uuid(), ${userId}::uuid, ${badge.id}, now())
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING badge_id
    `;
    if (inserted.length > 0) newlyEarned.push(badge);
  }
  if (newlyEarned.length === 0) return [];

  const totalBonus = newlyEarned.reduce((sum, badge) => sum + (badge.reward?.creditsBonus ?? 0), 0);
  if (totalBonus > 0) {
    await prisma.subscription.update({ where: { userId }, data: { creditsRemaining: { increment: totalBonus } } });
  }

  return newlyEarned;
}
