"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthUser } from "@/lib/data/profile";
import { getMasterCv } from "@/lib/data/cv";
import { prisma } from "@/lib/prisma";
import { generateTailoredCv } from "@/lib/tailored-cv/generate-with-llm";
import { consumeCredits } from "@/lib/billing/credits";
import { parsedCvSchema, type ParsedCv } from "@/lib/validations/cv";
import { cvDataJson } from "@/lib/cv/cv-data-json";
import { checkAndAwardBadges } from "@/lib/badges/check";
import type { AtsAnalysisData } from "@/lib/validations/ats-analysis";

type ActionResult<T = object> = { error: string } | ({ success: true } & T);

const GENERIC_FAILURE_MESSAGE =
  "Nous n'avons pas réussi à générer un CV adapté pour cette offre. Vous pouvez réessayer.";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

export async function generateTailoredCvAction(jobOfferId: string): Promise<ActionResult> {
  const user = await requireAuthUser();

  const jobOffer = await prisma.jobOffer.findFirst({ where: { id: jobOfferId, userId: user.id } });
  if (!jobOffer) return { error: "Offre introuvable." };

  const cv = await getMasterCv();
  if (!cv) return { error: "Importez d'abord votre CV pour générer un CV adapté." };

  const credits = await consumeCredits(user, "TAILORED_CV");
  if (!credits.ok) return { error: credits.error };

  await prisma.tailoredCv.upsert({
    where: { cvId_jobOfferId: { cvId: cv.id, jobOfferId } },
    create: { userId: user.id, cvId: cv.id, jobOfferId, status: "PROCESSING", data: {} },
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

  const existingAnalysis = await prisma.atsAnalysis.findFirst({ where: { cvId: cv.id, jobOfferId } });
  const atsAnalysisData: AtsAnalysisData | null =
    existingAnalysis && existingAnalysis.status === "READY"
      ? {
          score: existingAnalysis.score ?? 0,
          summary: existingAnalysis.summary ?? "",
          matchedSkills: asStringArray(existingAnalysis.matchedSkills),
          missingSkills: asStringArray(existingAnalysis.missingSkills),
          strengths: asStringArray(existingAnalysis.strengths),
          gaps: asStringArray(existingAnalysis.gaps),
          recommendations: asStringArray(existingAnalysis.recommendations),
        }
      : null;

  const result = await generateTailoredCv(cv.parsedData, jobOfferData, atsAnalysisData);

  await prisma.tailoredCv.update({
    where: { cvId_jobOfferId: { cvId: cv.id, jobOfferId } },
    data: result
      ? { status: "READY", errorMessage: null, data: result }
      : { status: "FAILED", errorMessage: GENERIC_FAILURE_MESSAGE },
  });

  revalidatePath(`/dashboard/jobs/${jobOfferId}`);
  revalidatePath(`/dashboard/jobs/${jobOfferId}/tailored-cv`);

  if (!result) return { error: GENERIC_FAILURE_MESSAGE };
  await checkAndAwardBadges(user.id);
  return { success: true };
}

export async function updateTailoredCvAction(id: string, input: ParsedCv): Promise<ActionResult> {
  const user = await requireAuthUser();
  const tailored = await prisma.tailoredCv.findFirst({ where: { id, userId: user.id } });
  if (!tailored) return { error: "CV adapté introuvable." };

  const parsed = parsedCvSchema.safeParse(input);
  if (!parsed.success) return { error: "Les informations saisies sont invalides." };

  await prisma.tailoredCv.update({
    where: { id },
    data: { status: "READY", errorMessage: null, data: parsed.data },
  });

  revalidatePath(`/dashboard/jobs/${tailored.jobOfferId}`);
  revalidatePath(`/dashboard/jobs/${tailored.jobOfferId}/tailored-cv`);
  return { success: true };
}

/** Copies a ready tailored CV into the user's CV library as a standalone (non-master) `Cv` — useful once they've polished it and want to keep or reuse it beyond this one offer. */
export async function saveTailoredCvToLibraryAction(tailoredCvId: string): Promise<ActionResult<{ cvId: string }>> {
  const user = await requireAuthUser();
  const tailored = await prisma.tailoredCv.findFirst({
    where: { id: tailoredCvId, userId: user.id },
    include: { jobOffer: { select: { title: true, company: true } } },
  });
  if (!tailored || tailored.status !== "READY") return { error: "Ce CV adapté n'est pas prêt." };

  const parsed = parsedCvSchema.safeParse(tailored.data);
  if (!parsed.success) return { error: "Les données de ce CV adapté sont invalides." };

  const label = tailored.jobOffer.company
    ? `CV adapté — ${tailored.jobOffer.title} chez ${tailored.jobOffer.company}`
    : `CV adapté — ${tailored.jobOffer.title}`;

  const cv = await prisma.cv.create({
    data: {
      userId: user.id,
      isMaster: false,
      source: "GENERATED",
      name: label,
      status: "READY",
      data: { create: cvDataJson(parsed.data) },
    },
  });

  await checkAndAwardBadges(user.id);

  revalidatePath("/dashboard/cv");
  revalidatePath("/dashboard");
  return { success: true, cvId: cv.id };
}

export async function deleteTailoredCvAction(id: string): Promise<ActionResult> {
  const user = await requireAuthUser();
  const tailored = await prisma.tailoredCv.findFirst({ where: { id, userId: user.id } });
  if (!tailored) return { error: "CV adapté introuvable." };

  await prisma.tailoredCv.delete({ where: { id } });

  revalidatePath(`/dashboard/jobs/${tailored.jobOfferId}`);
  redirect(`/dashboard/jobs/${tailored.jobOfferId}`);
}
