import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/data/profile";
import { emptyParsedCv, parsedCvSchema, type ParsedCv } from "@/lib/validations/cv";

export function toParsedCvFromTailored(data: unknown): ParsedCv {
  const parsed = parsedCvSchema.safeParse(data);
  return parsed.success ? parsed.data : emptyParsedCv();
}

/** Number of successfully generated tailored CVs — the dashboard's "CV optimisés" metric. */
export const countTailoredCvs = cache(async () => {
  const user = await requireAuthUser();
  return prisma.tailoredCv.count({ where: { userId: user.id, status: "READY" } });
});

export async function getTailoredCv(cvId: string, jobOfferId: string) {
  const user = await requireAuthUser();
  return prisma.tailoredCv.findFirst({ where: { cvId, jobOfferId, userId: user.id } });
}

/**
 * A specific tailored CV owned by the current user, or `null` if it doesn't
 * exist or belongs to someone else.
 */
export async function getOwnedTailoredCv(id: string) {
  const user = await requireAuthUser();
  return prisma.tailoredCv.findFirst({ where: { id, userId: user.id } });
}
