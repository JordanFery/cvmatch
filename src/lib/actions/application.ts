"use server";

import { revalidatePath } from "next/cache";
import { requireAuthUser } from "@/lib/data/profile";
import { getMasterCv } from "@/lib/data/cv";
import { prisma } from "@/lib/prisma";
import { applicationStatusSchema } from "@/lib/validations/application";
import { checkAndAwardBadges } from "@/lib/badges/check";

type ActionResult = { error: string } | { success: true };
type ApplyResult = { error: string } | { success: true; newBadges: { id: string; name: string; description: string }[] };

async function assertOwnership(id: string) {
  const user = await requireAuthUser();
  const offer = await prisma.jobOffer.findFirst({ where: { id, userId: user.id } });
  if (!offer) return null;
  return offer;
}

export async function updateApplicationStatusAction(jobOfferId: string, status: string): Promise<ActionResult> {
  const parsed = applicationStatusSchema.safeParse(status);
  if (!parsed.success) return { error: "Statut invalide." };

  const offer = await assertOwnership(jobOfferId);
  if (!offer) return { error: "Offre introuvable." };

  await prisma.jobOffer.update({
    where: { id: jobOfferId },
    data: {
      applicationStatus: parsed.data,
      // Sending or moving to interview implies a send date if none was set yet.
      appliedAt: !offer.appliedAt && parsed.data !== "NOT_SENT" ? new Date() : undefined,
    },
  });
  await checkAndAwardBadges(offer.userId);

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Records that the user applied to this offer with a given CV variant.
 * Deliberately does not attempt to auto-fill or submit any external
 * application form — every job board/ATS is different and many actively
 * block automation. Instead this confirms which CV to use, marks the
 * application as sent in our own tracking, and hands the UI the pieces
 * (the offer's URL, the chosen CV) so the user can open and submit it
 * themselves in one click each.
 */
export async function applyToJobOfferAction(
  jobOfferId: string,
  cvType: "MASTER" | "TAILORED",
): Promise<ApplyResult> {
  const user = await requireAuthUser();
  const offer = await prisma.jobOffer.findFirst({ where: { id: jobOfferId, userId: user.id } });
  if (!offer) return { error: "Offre introuvable." };

  const cv = await getMasterCv();
  if (!cv) return { error: "Importez d'abord votre CV." };

  if (cvType === "TAILORED") {
    const tailored = await prisma.tailoredCv.findFirst({
      where: { cvId: cv.id, jobOfferId, status: "READY" },
    });
    if (!tailored) return { error: "Générez d'abord un CV adapté pour cette offre." };
  }

  await prisma.jobOffer.update({
    where: { id: jobOfferId },
    data: { applicationStatus: "SENT", appliedAt: new Date(), appliedCvType: cvType },
  });
  const newBadges = await checkAndAwardBadges(user.id);

  revalidatePath(`/dashboard/jobs/${jobOfferId}`);
  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
  return {
    success: true,
    newBadges: newBadges.map((badge) => ({ id: badge.id, name: badge.name, description: badge.description })),
  };
}

export async function updateAppliedAtAction(jobOfferId: string, appliedAt: string | null): Promise<ActionResult> {
  const offer = await assertOwnership(jobOfferId);
  if (!offer) return { error: "Offre introuvable." };

  const date = appliedAt ? new Date(appliedAt) : null;
  if (appliedAt && Number.isNaN(date?.getTime())) {
    return { error: "Date invalide." };
  }

  await prisma.jobOffer.update({
    where: { id: jobOfferId },
    data: {
      appliedAt: date,
      applicationStatus: date && offer.applicationStatus === "NOT_SENT" ? "SENT" : undefined,
    },
  });
  await checkAndAwardBadges(offer.userId);

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
  return { success: true };
}
