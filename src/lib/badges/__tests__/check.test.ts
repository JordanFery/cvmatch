import { describe, it, expect, vi, beforeEach } from "vitest";
import { Sparkles } from "lucide-react";

let totalCreditsGranted = 0;
// Models the DB's real unique index on (user_id, badge_id): the *first*
// $queryRaw call to claim a given key wins; every later one — concurrent
// or not — sees it already taken. No `await` before the check-and-mark,
// same reasoning as the credits.test.ts mock: this is what makes it a
// faithful stand-in for a single atomic `INSERT ... ON CONFLICT DO NOTHING`.
const awardedBadges = new Set<string>();

vi.mock("@/lib/badges/catalog", () => ({
  BADGE_CATALOG: [
    {
      id: "test-badge",
      name: "Test Badge",
      description: "",
      icon: Sparkles,
      category: "usage",
      check: () => true,
      reward: { creditsBonus: 10, description: "+10 crédits offerts" },
    },
  ],
}));

vi.mock("@/lib/billing/credits", () => ({
  getOrCreateSubscription: vi.fn(() => Promise.resolve({ creditsUsedLifetime: 0 })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    cv: { count: vi.fn(() => Promise.resolve(0)) },
    jobOffer: { count: vi.fn(() => Promise.resolve(0)) },
    atsAnalysis: { count: vi.fn(() => Promise.resolve(0)) },
    tailoredCv: { count: vi.fn(() => Promise.resolve(0)) },
    userBadge: { findMany: vi.fn(() => Promise.resolve([])) },
    subscription: {
      update: vi.fn(({ data }: { data: { creditsRemaining: { increment: number } } }) => {
        totalCreditsGranted += data.creditsRemaining.increment;
        return Promise.resolve({});
      }),
    },
    $queryRaw: vi.fn((_strings: unknown, userId: string, badgeId: string) => {
      const key = `${userId}:${badgeId}`;
      if (awardedBadges.has(key)) return Promise.resolve([]);
      awardedBadges.add(key);
      return Promise.resolve([{ badge_id: badgeId }]);
    }),
  },
}));

const { checkAndAwardBadges } = await import("@/lib/badges/check");

beforeEach(() => {
  totalCreditsGranted = 0;
  awardedBadges.clear();
});

describe("checkAndAwardBadges", () => {
  it("security: a badge's credit bonus is granted exactly once, even under concurrent calls for the same user", async () => {
    const userId = "user-1";

    // Simulates a user firing several parallel requests (e.g. two tabs, or
    // a script) that all cross the same badge's threshold at once.
    const results = await Promise.all(Array.from({ length: 5 }, () => checkAndAwardBadges(userId)));

    const totalNewlyEarnedAcrossCalls = results.reduce((sum, r) => sum + r.length, 0);
    expect(totalNewlyEarnedAcrossCalls).toBe(1); // only one of the 5 calls "wins" the badge
    expect(totalCreditsGranted).toBe(10); // its bonus is applied exactly once, not up to 5 times
  });
});
