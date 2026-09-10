"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthUser } from "@/lib/data/profile";
import { getMasterCv } from "@/lib/data/cv";
import { prisma } from "@/lib/prisma";
import { generateCoverLetter } from "@/lib/cover-letter/generate-with-llm";
import { consumeCredits } from "@/lib/billing/credits";
import { checkAndAwardBadges } from "@/lib/badges/check";

type ActionResult = { error: string } | { success: true };

const GENERIC_FAILURE_MESSAGE =
  "Nous n'avons pas réussi à générer une lettre de motivation pour cette offre. Vous pouvez réessayer.";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

export async function generateCoverLetterAction(jobOfferId: string): Promise<ActionResult> {
  const user = await requireAuthUser();

  const jobOffer = await prisma.jobOffer.findFirst({ where: { id: jobOfferId, userId: user.id } });
  if (!jobOffer) return { error: "Offre introuvable." };

  const cv = await getMasterCv();
  if (!cv) return { error: "Importez d'abord votre CV pour générer une lettre de motivation." };

  const credits = await consumeCredits(user, "COVER_LETTER");
  if (!credits.ok) return { error: credits.error };

  await prisma.coverLetter.upsert({
    where: { cvId_jobOfferId: { cvId: cv.id, jobOfferId } },
    create: { userId: user.id, cvId: cv.id, jobOfferId, status: "PROCESSING", companyInsights: [] },
    update: { status: "PROCESSING", errorMessage: null },
  });

  const jobOfferData = {
    title: jobOffer.title,
    company: jobOffer.company,
    location: jobOffer.location,
    employmentType: jobOffer.employmentType,
    remotePolicy: jobOffer.remotePolicy,
    salaryRange: jobOffer.salaryRange,
    seniorityLevel: jobOffer.seniorityLevel,
    summary: jobOffer.summary,
    responsibilities: asStringArray(jobOffer.responsibilities),
    requirements: asStringArray(jobOffer.requirements),
    niceToHave: asStringArray(jobOffer.niceToHave),
    keySkills: asStringArray(jobOffer.keySkills),
  };

  const result = await generateCoverLetter(cv.parsedData, jobOfferData, jobOffer.company, jobOffer.sourceUrl);

  await prisma.coverLetter.update({
    where: { cvId_jobOfferId: { cvId: cv.id, jobOfferId } },
    data: result
      ? { status: "READY", errorMessage: null, content: result.content, companyInsights: result.companyInsights }
      : { status: "FAILED", errorMessage: GENERIC_FAILURE_MESSAGE },
  });

  revalidatePath(`/dashboard/jobs/${jobOfferId}`);
  revalidatePath(`/dashboard/jobs/${jobOfferId}/cover-letter`);

  if (!result) return { error: GENERIC_FAILURE_MESSAGE };
  await checkAndAwardBadges(user.id);
  return { success: true };
}

export async function updateCoverLetterAction(id: string, content: string): Promise<ActionResult> {
  const user = await requireAuthUser();
  const letter = await prisma.coverLetter.findFirst({ where: { id, userId: user.id } });
  if (!letter) return { error: "Lettre de motivation introuvable." };

  const trimmed = content.trim();
  if (!trimmed) return { error: "La lettre ne peut pas être vide." };

  await prisma.coverLetter.update({
    where: { id },
    data: { status: "READY", errorMessage: null, content: trimmed },
  });

  revalidatePath(`/dashboard/jobs/${letter.jobOfferId}`);
  revalidatePath(`/dashboard/jobs/${letter.jobOfferId}/cover-letter`);
  return { success: true };
}

export async function deleteCoverLetterAction(id: string): Promise<ActionResult> {
  const user = await requireAuthUser();
  const letter = await prisma.coverLetter.findFirst({ where: { id, userId: user.id } });
  if (!letter) return { error: "Lettre de motivation introuvable." };

  await prisma.coverLetter.delete({ where: { id } });

  revalidatePath(`/dashboard/jobs/${letter.jobOfferId}`);
  redirect(`/dashboard/jobs/${letter.jobOfferId}`);
}
