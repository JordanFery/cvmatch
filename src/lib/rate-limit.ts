import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/** Best-effort client IP from the proxy-set header — "unknown" locally (no proxy in front), which simply skips rate limiting rather than blocking dev/test usage. */
export async function clientIp(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/**
 * Atomically checks-and-reserves one slot for this (bucket, ip) pair within
 * the given rolling window, or returns `false` if already at the cap.
 *
 * A plain `count()` followed by a separate `create()` has a race: several
 * concurrent requests from the same IP can each read the count *before*
 * any of them writes, so all of them see "under the limit" and all
 * proceed. `pg_advisory_xact_lock` serializes concurrent callers that hash
 * to the same (bucket, ip) for the lifetime of this transaction, so the
 * count-then-insert inside is only ever evaluated by one caller at a time.
 */
export async function tryReserveSlot(bucket: string, ip: string, max: number, windowMs: number): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`${bucket}:${ip}`}))`;
    const since = new Date(Date.now() - windowMs);
    const recentAttempts = await tx.rateLimitAttempt.count({
      where: { bucket, ipAddress: ip, createdAt: { gte: since } },
    });
    if (recentAttempts >= max) return false;
    await tx.rateLimitAttempt.create({ data: { bucket, ipAddress: ip } });
    return true;
  });
}
