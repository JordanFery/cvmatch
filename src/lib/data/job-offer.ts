import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/data/profile";
import { emptyJobOfferData, jobOfferDataSchema, type JobOfferData } from "@/lib/validations/job-offer";

export function toJobOfferData(offer: {
  title: string;
  company: string | null;
  location: string | null;
  employmentType: string | null;
  remotePolicy: string | null;
  salaryRange: string | null;
  seniorityLevel: string | null;
  summary: string | null;
  responsibilities: unknown;
  requirements: unknown;
  niceToHave: unknown;
  keySkills: unknown;
}): JobOfferData {
  const parsed = jobOfferDataSchema.safeParse(offer);
  return parsed.success ? parsed.data : emptyJobOfferData();
}

/** All job offers owned by the current user, most recent first. */
export const getJobOffers = cache(async () => {
  const user = await requireAuthUser();
  return prisma.jobOffer.findMany({
    where: { userId: user.id },
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
  });
});

export const countJobOffers = cache(async () => {
  const user = await requireAuthUser();
  return prisma.jobOffer.count({ where: { userId: user.id } });
});

/**
 * A specific job offer owned by the current user, or `null` if it doesn't
 * exist or belongs to someone else — callers must treat both cases
 * identically (never reveal whether an offer id exists for another user).
 */
export async function getOwnedJobOffer(id: string) {
  const user = await requireAuthUser();
  return prisma.jobOffer.findFirst({ where: { id, userId: user.id } });
}
