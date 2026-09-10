"use server";

import { revalidatePath } from "next/cache";
import { requireAuthUser } from "@/lib/data/profile";
import { getMasterCv } from "@/lib/data/cv";
import { prisma } from "@/lib/prisma";
import { analyzeAtsCompatibility } from "@/lib/ats/analyze-with-llm";
import { consumeCredits } from "@/lib/billing/credits";
import { checkAndAwardBadges } from "@/lib/badges/check";
import type { AtsAnalysisData } from "@/lib/validations/ats-analysis";

type ActionResult = { error: string } | { success: true };

const GENERIC_FAILURE_MESSAGE =
  "Nous n'avons pas réussi à analyser la compatibilité de cette offre avec votre CV. Vous pouvez réessayer.";

function analysisFields(data: AtsAnalysisData) {
  return {
    score: data.score,
    summary: data.summary,
    matchedSkills: data.matchedSkills,
    missingSkills: data.missingSkills,
    strengths: data.strengths,
    gaps: data.gaps,
    recommendations: data.recommendations,
  };
}

export async function analyzeJobOfferAction(jobOfferId: string): Promise<ActionResult> {
  const user = await requireAuthUser();

  const jobOffer = await prisma.jobOffer.findFirst({ where: { id: jobOfferId, userId: user.id } });
  if (!jobOffer) return { error: "Offre introuvable." };

  const cv = await getMasterCv();
  if (!cv) return { error: "Importez d'abord votre CV pour lancer une analyse." };

  const credits = await consumeCredits(user, "ATS_ANALYSIS");
  if (!credits.ok) return { error: credits.error };

  await prisma.atsAnalysis.upsert({
    where: { cvId_jobOfferId: { cvId: cv.id, jobOfferId } },
    create: {
      userId: user.id,
      cvId: cv.id,
      jobOfferId,
      status: "PROCESSING",
      matchedSkills: [],
      missingSkills: [],
      strengths: [],
      gaps: [],
      recommendations: [],
    },
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
    responsibilities: Array.isArray(jobOffer.responsibilities) ? (jobOffer.responsibilities as string[]) : [],
    requirements: Array.isArray(jobOffer.requirements) ? (jobOffer.requirements as string[]) : [],
    niceToHave: Array.isArray(jobOffer.niceToHave) ? (jobOffer.niceToHave as string[]) : [],
    keySkills: Array.isArray(jobOffer.keySkills) ? (jobOffer.keySkills as string[]) : [],
  };

  const result = await analyzeAtsCompatibility(cv.parsedData, jobOfferData);

  await prisma.atsAnalysis.update({
    where: { cvId_jobOfferId: { cvId: cv.id, jobOfferId } },
    data: result
      ? { status: "READY", errorMessage: null, ...analysisFields(result) }
      : { status: "FAILED", errorMessage: GENERIC_FAILURE_MESSAGE },
  });

  revalidatePath(`/dashboard/jobs/${jobOfferId}`);

  if (!result) return { error: GENERIC_FAILURE_MESSAGE };
  await checkAndAwardBadges(user.id);
  return { success: true };
}
