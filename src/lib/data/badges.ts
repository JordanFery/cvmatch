import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/data/profile";
import { getBadgeStats } from "@/lib/badges/check";
import { BADGE_CATALOG, type BadgeDefinition } from "@/lib/badges/catalog";

export type BadgeView = {
  badge: BadgeDefinition;
  earned: boolean;
  earnedAt: Date | null;
  progress: { current: number; target: number };
};

/** Every badge in the catalog, annotated with whether the current user has earned it and their live progress towards it. */
export const getUserBadges = cache(async (): Promise<BadgeView[]> => {
  const user = await requireAuthUser();

  const [stats, earned] = await Promise.all([
    getBadgeStats(user.id),
    prisma.userBadge.findMany({ where: { userId: user.id } }),
  ]);
  const earnedByBadgeId = new Map(earned.map((row) => [row.badgeId, row.earnedAt]));

  return BADGE_CATALOG.map((badge) => ({
    badge,
    earned: earnedByBadgeId.has(badge.id),
    earnedAt: earnedByBadgeId.get(badge.id) ?? null,
    progress: badge.progress(stats),
  }));
});

export const countEarnedBadges = cache(async () => {
  const badges = await getUserBadges();
  return { earned: badges.filter((b) => b.earned).length, total: badges.length };
});
