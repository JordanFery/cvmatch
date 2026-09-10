"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthUser } from "@/lib/data/profile";
import { prisma } from "@/lib/prisma";
import { fetchJobPostingText } from "@/lib/jobs/fetch-url";
import { parseJobOfferWithLlm } from "@/lib/jobs/parse-with-llm";
import {
  emptyJobOfferData,
  importJobOfferSchema,
  jobOfferDataSchema,
  type ImportJobOfferInput,
  type JobOfferData,
} from "@/lib/validations/job-offer";
import { consumeCredits } from "@/lib/billing/credits";
import { checkAndAwardBadges } from "@/lib/badges/check";

type ActionResult<T = object> = { error: string } | ({ success: true } & T);

const GENERIC_PARSE_FAILURE_MESSAGE =
  "Nous n'avons pas réussi à analyser automatiquement cette offre. Vous pouvez réessayer ou saisir les informations manuellement.";

const FALLBACK_TITLE = "Offre sans titre";

function jobOfferDataFields(data: JobOfferData) {
  return {
    title: data.title ?? FALLBACK_TITLE,
    company: data.company,
    location: data.location,
    employmentType: data.employmentType,
    remotePolicy: data.remotePolicy,
    salaryRange: data.salaryRange,
    seniorityLevel: data.seniorityLevel,
    summary: data.summary,
    responsibilities: data.responsibilities,
    requirements: data.requirements,
    niceToHave: data.niceToHave,
    keySkills: data.keySkills,
  };
}

async function processJobOffer(id: string, rawText: string) {
  const parsed = await parseJobOfferWithLlm(rawText);

  await prisma.jobOffer.update({
    where: { id },
    data: {
      status: parsed ? "READY" : "FAILED",
      errorMessage: parsed ? null : GENERIC_PARSE_FAILURE_MESSAGE,
      ...jobOfferDataFields(parsed ?? emptyJobOfferData()),
    },
  });
}

export async function importJobOfferAction(input: ImportJobOfferInput): Promise<ActionResult<{ jobOfferId: string }>> {
  const user = await requireAuthUser();

  const parsed = importJobOfferSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  let rawText: string;
  let sourceUrl: string | null = null;

  if (parsed.data.mode === "url") {
    try {
      rawText = await fetchJobPostingText(parsed.data.url);
      sourceUrl = parsed.data.url;
    } catch (error) {
      console.error("[job-offer] URL fetch failed:", error);
      return { error: error instanceof Error ? error.message : "Impossible de récupérer cette page." };
    }
    if (rawText.length < 50) {
      return { error: "Nous n'avons pas trouvé de contenu exploitable à cette adresse." };
    }
  } else {
    rawText = parsed.data.text;
  }

  const credits = await consumeCredits(user, "JOB_PARSE");
  if (!credits.ok) return { error: credits.error };

  const jobOffer = await prisma.jobOffer.create({
    data: {
      userId: user.id,
      status: "PROCESSING",
      sourceType: parsed.data.mode === "url" ? "URL" : "TEXT",
      sourceUrl,
      rawDescription: rawText,
      title: FALLBACK_TITLE,
      responsibilities: [],
      requirements: [],
      niceToHave: [],
      keySkills: [],
    },
  });

  await processJobOffer(jobOffer.id, rawText);
  await checkAndAwardBadges(user.id);

  revalidatePath("/dashboard/jobs");
  revalidatePath("/dashboard");
  return { success: true, jobOfferId: jobOffer.id };
}

export async function retryJobOfferParsingAction(id: string): Promise<ActionResult> {
  const user = await requireAuthUser();
  const offer = await prisma.jobOffer.findFirst({ where: { id, userId: user.id } });
  if (!offer) return { error: "Offre introuvable." };

  const credits = await consumeCredits(user, "JOB_PARSE");
  if (!credits.ok) return { error: credits.error };

  await prisma.jobOffer.update({ where: { id }, data: { status: "PROCESSING" } });
  await processJobOffer(id, offer.rawDescription);

  revalidatePath("/dashboard/jobs/review");
  return { success: true };
}

async function persistJobOfferData(id: string, input: JobOfferData): Promise<{ error: string } | { error: null }> {
  const user = await requireAuthUser();
  const offer = await prisma.jobOffer.findFirst({ where: { id, userId: user.id } });
  if (!offer) return { error: "Offre introuvable." };

  const parsed = jobOfferDataSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Les informations saisies sont invalides." };
  }

  await prisma.jobOffer.update({
    where: { id },
    data: { status: "READY", errorMessage: null, ...jobOfferDataFields(parsed.data) },
  });

  revalidatePath("/dashboard/jobs");
  revalidatePath(`/dashboard/jobs/${id}`);
  revalidatePath("/dashboard");
  return { error: null };
}

/** Confirms a freshly-imported offer (review page) and returns to the list. */
export async function confirmJobOfferAction(id: string, input: JobOfferData): Promise<ActionResult> {
  const result = await persistJobOfferData(id, input);
  if (result.error) return { error: result.error };
  redirect("/dashboard/jobs");
}

/** Edits an already-saved offer in place. */
export async function updateJobOfferAction(id: string, input: JobOfferData): Promise<ActionResult> {
  const result = await persistJobOfferData(id, input);
  if (result.error) return { error: result.error };
  return { success: true };
}

/** Adds or edits the offer's application URL — kept separate from persistJobOfferData since it isn't part of the LLM-parsed `JobOfferData` shape. */
export async function updateSourceUrlAction(id: string, url: string): Promise<ActionResult> {
  const user = await requireAuthUser();
  const offer = await prisma.jobOffer.findFirst({ where: { id, userId: user.id } });
  if (!offer) return { error: "Offre introuvable." };

  const trimmed = url.trim();
  if (trimmed && !/^https?:\/\/.+/i.test(trimmed)) {
    return { error: "L'URL doit commencer par http:// ou https://." };
  }

  await prisma.jobOffer.update({ where: { id }, data: { sourceUrl: trimmed || null } });

  revalidatePath(`/dashboard/jobs/${id}`);
  return { success: true };
}

/** Toggles a job offer's favorite flag — purely organizational, for surfacing the offers the user cares most about. */
export async function toggleJobOfferFavoriteAction(id: string): Promise<ActionResult<{ isFavorite: boolean }>> {
  const user = await requireAuthUser();
  const offer = await prisma.jobOffer.findFirst({ where: { id, userId: user.id } });
  if (!offer) return { error: "Offre introuvable." };

  const updated = await prisma.jobOffer.update({ where: { id }, data: { isFavorite: !offer.isFavorite } });

  revalidatePath("/dashboard/jobs");
  revalidatePath(`/dashboard/jobs/${id}`);
  return { success: true, isFavorite: updated.isFavorite };
}

export async function deleteJobOfferAction(id: string): Promise<ActionResult> {
  const user = await requireAuthUser();
  const offer = await prisma.jobOffer.findFirst({ where: { id, userId: user.id } });
  if (!offer) return { error: "Offre introuvable." };

  await prisma.jobOffer.delete({ where: { id } });

  revalidatePath("/dashboard/jobs");
  revalidatePath("/dashboard");
  redirect("/dashboard/jobs");
}
