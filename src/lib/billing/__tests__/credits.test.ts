import { describe, it, expect, vi, beforeEach } from "vitest";

type PlanId = "FREE" | "ESSENTIAL" | "PRO" | "VIP";
type SubscriptionStatus = "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "INCOMPLETE";

type SubscriptionRow = {
  userId: string;
  plan: PlanId;
  status: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  cancelAtPeriodEnd: boolean;
  creditsRemaining: number;
  creditsResetAt: Date;
  creditsUsedLifetime: number;
  lastAiActionAt: Date | null;
};

const db = new Map<string, SubscriptionRow>();

function applyFieldUpdate(current: number, value: unknown): number {
  if (value && typeof value === "object" && "increment" in value) {
    return current + (value as { increment: number }).increment;
  }
  if (value && typeof value === "object" && "decrement" in value) {
    return current - (value as { decrement: number }).decrement;
  }
  return value as number;
}

/**
 * Evaluates a Prisma-shaped `where` clause against one in-memory row.
 * Supports exactly the shapes consumeCredits uses (equality, `gte`, `lte`,
 * `null`, `OR`) — this is what lets the mock stand in for real Postgres's
 * per-statement atomicity in the concurrency test below: a real `UPDATE
 * ... WHERE <this>` re-evaluates the condition against the row as it is
 * *at the moment the statement runs*, not a value read earlier. The mock's
 * `updateMany` does the same — read, evaluate, write, all synchronously,
 * no `await` in between — so it can't be interrupted mid-operation either.
 */
function matchesWhere(row: SubscriptionRow, where: Record<string, unknown>): boolean {
  for (const [key, condition] of Object.entries(where)) {
    if (key === "userId") continue;
    if (key === "OR") {
      const clauses = condition as Array<Record<string, unknown>>;
      if (!clauses.some((clause) => matchesWhere(row, clause))) return false;
      continue;
    }
    const value = (row as unknown as Record<string, unknown>)[key];
    if (condition === null) {
      if (value !== null) return false;
      continue;
    }
    if (typeof condition === "object") {
      const cond = condition as { gte?: number; lte?: Date };
      if (cond.gte !== undefined && !((value as number) >= cond.gte)) return false;
      if (cond.lte !== undefined) {
        const current = value as Date | null;
        if (!current || current.getTime() > cond.lte.getTime()) return false;
      }
      continue;
    }
    if (value !== condition) return false;
  }
  return true;
}

// In-memory stand-in for the one Prisma model consumeCredits/getOrCreateSubscription
// touch — real DB behavior (unique constraints beyond what's modeled here)
// isn't the point; the credit math and the two abuse-prevention gates are.
vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      findUnique: vi.fn(({ where: { userId } }: { where: { userId: string } }) => {
        return Promise.resolve(db.get(userId) ?? null);
      }),
      findUniqueOrThrow: vi.fn(({ where: { userId } }: { where: { userId: string } }) => {
        const row = db.get(userId);
        if (!row) throw new Error("not found");
        return Promise.resolve(row);
      }),
      create: vi.fn(({ data }: { data: Partial<SubscriptionRow> & { userId: string } }) => {
        const row: SubscriptionRow = {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripePriceId: null,
          cancelAtPeriodEnd: false,
          creditsUsedLifetime: 0,
          lastAiActionAt: null,
          plan: "FREE",
          status: "ACTIVE",
          creditsRemaining: 0,
          creditsResetAt: new Date(),
          ...data,
        };
        db.set(data.userId, row);
        return Promise.resolve(row);
      }),
      update: vi.fn(({ where: { userId }, data }: { where: { userId: string }; data: Record<string, unknown> }) => {
        const row = db.get(userId);
        if (!row) throw new Error("not found");
        const updated: SubscriptionRow = { ...row };
        for (const [key, value] of Object.entries(data)) {
          (updated as unknown as Record<string, unknown>)[key] = applyFieldUpdate(
            (row as unknown as Record<string, unknown>)[key] as number,
            value,
          );
        }
        db.set(userId, updated);
        return Promise.resolve(updated);
      }),
      // The atomicity-critical path: read + condition-check + write with no
      // `await` between them, exactly like a single SQL `UPDATE ... WHERE`.
      updateMany: vi.fn(({ where, data }: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
        const userId = where.userId as string;
        const row = db.get(userId);
        if (!row || !matchesWhere(row, where)) {
          return Promise.resolve({ count: 0 });
        }
        const updated: SubscriptionRow = { ...row };
        for (const [key, value] of Object.entries(data)) {
          (updated as unknown as Record<string, unknown>)[key] = applyFieldUpdate(
            (row as unknown as Record<string, unknown>)[key] as number,
            value,
          );
        }
        db.set(userId, updated);
        return Promise.resolve({ count: 1 });
      }),
    },
  },
}));

const { consumeCredits } = await import("@/lib/billing/credits");
const { PLANS, CREDIT_COSTS } = await import("@/lib/billing/plans");
type AuthUser = { id: string; email: string | null; emailConfirmed: boolean };

function makeUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return { id: "user-1", email: "test@example.com", emailConfirmed: true, ...overrides };
}

function seedRow(userId: string, overrides: Partial<SubscriptionRow> = {}): SubscriptionRow {
  const row: SubscriptionRow = {
    userId,
    plan: "FREE",
    status: "ACTIVE",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripePriceId: null,
    cancelAtPeriodEnd: false,
    creditsRemaining: 100,
    creditsResetAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    creditsUsedLifetime: 0,
    lastAiActionAt: null,
    ...overrides,
  };
  db.set(userId, row);
  return row;
}

beforeEach(() => {
  db.clear();
});

describe("consumeCredits", () => {
  it("blocks an unconfirmed email before touching the database at all", async () => {
    const result = await consumeCredits(makeUser({ emailConfirmed: false }), "JOB_PARSE");
    expect(result.ok).toBe(false);
    expect(db.size).toBe(0);
  });

  it("creates a FREE subscription on first use and deducts the right cost", async () => {
    const user = makeUser();
    const result = await consumeCredits(user, "CV_PARSE");
    expect(result.ok).toBe(true);
    expect(db.get(user.id)?.creditsRemaining).toBe(PLANS.FREE.monthlyCredits - CREDIT_COSTS.CV_PARSE);
    expect(db.get(user.id)?.creditsUsedLifetime).toBe(CREDIT_COSTS.CV_PARSE);
  });

  it("rejects when credits are insufficient, without deducting anything", async () => {
    const user = makeUser({ id: "user-2" });
    seedRow(user.id, { creditsRemaining: 1, lastAiActionAt: null });
    const result = await consumeCredits(user, "TAILORED_CV"); // costs 3, only 1 remaining
    expect(result.ok).toBe(false);
    expect(db.get(user.id)?.creditsRemaining).toBe(1);
  });

  it("enforces a short cooldown between consecutive actions from the same user", async () => {
    const user = makeUser({ id: "user-3" });
    seedRow(user.id, { lastAiActionAt: null });

    const first = await consumeCredits(user, "JOB_PARSE");
    expect(first.ok).toBe(true);

    const second = await consumeCredits(user, "JOB_PARSE");
    expect(second.ok).toBe(false);
  });

  it("never decrements credits on the unlimited (VIP) plan, but still tracks lifetime usage", async () => {
    const user = makeUser({ id: "user-4" });
    seedRow(user.id, { plan: "VIP", creditsRemaining: 1_000_000, lastAiActionAt: null });

    const result = await consumeCredits(user, "TAILORED_CV");
    expect(result.ok).toBe(true);
    expect(db.get(user.id)?.creditsRemaining).toBe(1_000_000);
    expect(db.get(user.id)?.creditsUsedLifetime).toBe(CREDIT_COSTS.TAILORED_CV);
  });

  it("security: concurrent requests can never collectively spend more than the account's balance", async () => {
    const user = makeUser({ id: "user-5" });
    // Balance covers exactly 2 CV_PARSE actions (cost 2 each) — fire 5 at once.
    seedRow(user.id, { creditsRemaining: 4, lastAiActionAt: null });

    const results = await Promise.all(Array.from({ length: 5 }, () => consumeCredits(user, "CV_PARSE")));

    const succeeded = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok).length;
    expect(succeeded + failed).toBe(5);
    // The core invariant a TOCTOU race would break: the remaining balance
    // must exactly match "starting balance minus what was actually charged"
    // — never drift, and never go negative.
    expect(db.get(user.id)!.creditsRemaining).toBe(4 - succeeded * CREDIT_COSTS.CV_PARSE);
    expect(db.get(user.id)!.creditsRemaining).toBeGreaterThanOrEqual(0);
  });
});
