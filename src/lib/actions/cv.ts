"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthUser } from "@/lib/data/profile";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cvStoragePath, deleteCvFile, downloadCvFile, getSignedCvUrl, uploadCvFile } from "@/lib/supabase/storage";
import { validateCvFile } from "@/lib/cv/validate-file";
import { extractCvText } from "@/lib/cv/extract-text";
import { parseCvWithLlm } from "@/lib/cv/parse-with-llm";
import { emptyParsedCv, parsedCvSchema, type ParsedCv } from "@/lib/validations/cv";
import { cvDataJson } from "@/lib/cv/cv-data-json";
import { consumeCredits } from "@/lib/billing/credits";
import { checkAndAwardBadges } from "@/lib/badges/check";
import type { Cv } from "@/generated/prisma/client";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type ActionResult<T = {}> = { error: string } | ({ success: true } & T);

const GENERIC_PARSE_FAILURE_MESSAGE =
  "Nous n'avons pas réussi à lire automatiquement ce CV. Vous pouvez réessayer ou saisir les informations manuellement.";

/** Removes a CV entirely: storage file first (if any — generated CVs have none), then DB row. Best-effort on storage — a missing file must never block cleanup. */
async function purgeCv(
  supabase: Awaited<ReturnType<typeof createClient>>,
  cv: { id: string; storagePath: string | null },
) {
  if (cv.storagePath) {
    try {
      await deleteCvFile(supabase, cv.storagePath);
    } catch (error) {
      console.error(`[cv] failed to delete storage file for cv ${cv.id}:`, error);
    }
  }
  await prisma.cv.delete({ where: { id: cv.id } });
}

export async function uploadCvAction(formData: FormData): Promise<ActionResult<{ cvId: string }>> {
  const user = await requireAuthUser();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Aucun fichier reçu." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const validation = validateCvFile({ type: file.type, size: file.size }, bytes);
  if (!validation.ok) {
    return { error: validation.error };
  }

  const credits = await consumeCredits(user, "CV_PARSE");
  if (!credits.ok) return { error: credits.error };

  const supabase = await createClient();

  // Clean up any previous failed attempts before starting a new one.
  const staleFailed = await prisma.cv.findMany({
    where: { userId: user.id, isMaster: false, status: "FAILED" },
  });
  for (const stale of staleFailed) {
    await purgeCv(supabase, stale);
  }

  const cv = await prisma.cv.create({
    data: {
      userId: user.id,
      isMaster: false,
      name: file.name,
      originalFileName: file.name,
      fileType: validation.fileType,
      storagePath: "",
      status: "UPLOADED",
    },
  });

  const storagePath = cvStoragePath(user.id, cv.id, validation.fileType);

  try {
    await uploadCvFile(supabase, storagePath, bytes, file.type);
  } catch (error) {
    console.error(`[cv] storage upload failed for cv ${cv.id}:`, error);
    await prisma.cv.update({
      where: { id: cv.id },
      data: { status: "FAILED", errorMessage: "L'envoi du fichier a échoué. Veuillez réessayer." },
    });
    return { error: "L'envoi du fichier a échoué. Veuillez réessayer." };
  }

  await prisma.cv.update({
    where: { id: cv.id },
    data: { storagePath, status: "PROCESSING" },
  });

  await processCv(cv.id, bytes, validation.fileType);
  await checkAndAwardBadges(user.id);

  revalidatePath("/dashboard/cv");
  revalidatePath("/dashboard");
  return { success: true, cvId: cv.id };
}

/** Text extraction + LLM structuring. Always leaves the CV in READY or FAILED status with a CvData row attached, so the review page always has something to display and edit. */
async function processCv(cvId: string, bytes: Buffer, fileType: "PDF" | "DOCX") {
  let rawText = "";
  try {
    rawText = await extractCvText(bytes, fileType);
  } catch (error) {
    console.error(`[cv] text extraction failed for cv ${cvId}:`, error);
  }

  if (rawText.trim().length < 30) {
    await prisma.cv.update({
      where: { id: cvId },
      data: { status: "FAILED", rawText: rawText || null, errorMessage: GENERIC_PARSE_FAILURE_MESSAGE },
    });
    await prisma.cvData.upsert({
      where: { cvId },
      create: { cvId, ...cvDataJson(emptyParsedCv()) },
      update: {},
    });
    return;
  }

  const parsed = await parseCvWithLlm(rawText);

  await prisma.cv.update({
    where: { id: cvId },
    data: {
      rawText,
      status: parsed ? "READY" : "FAILED",
      errorMessage: parsed ? null : GENERIC_PARSE_FAILURE_MESSAGE,
    },
  });

  await prisma.cvData.upsert({
    where: { cvId },
    create: { cvId, ...cvDataJson(parsed ?? emptyParsedCv()) },
    update: cvDataJson(parsed ?? emptyParsedCv()),
  });
}

type SaveCvDataResult = { error: string; cv: null } | { error: null; cv: Cv };

async function saveCvData(cvId: string, input: ParsedCv): Promise<SaveCvDataResult> {
  const user = await requireAuthUser();
  const cv = await prisma.cv.findFirst({ where: { id: cvId, userId: user.id } });
  if (!cv) {
    return { error: "CV introuvable.", cv: null };
  }

  const parsed = parsedCvSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Les informations saisies sont invalides.", cv: null };
  }

  await prisma.cvData.upsert({
    where: { cvId },
    create: { cvId, ...cvDataJson(parsed.data) },
    update: cvDataJson(parsed.data),
  });

  return { error: null, cv };
}

/**
 * Confirms the reviewed CV and adds it to the user's library. The very
 * first CV a user saves automatically becomes their master (the default
 * used for ATS analysis, tailoring, and "apply with my CV as-is"); once a
 * master exists, later uploads join the library alongside it — promote one
 * explicitly via `setMasterCvAction`. Never deletes other CVs.
 */
export async function confirmCvAction(cvId: string, input: ParsedCv): Promise<ActionResult> {
  const user = await requireAuthUser();
  const result = await saveCvData(cvId, input);
  if (result.error) return { error: result.error };

  const hasMaster = await prisma.cv.findFirst({
    where: { userId: user.id, isMaster: true, id: { not: cvId } },
  });

  await prisma.cv.update({
    where: { id: cvId },
    data: { isMaster: !hasMaster, status: "READY", errorMessage: null },
  });

  revalidatePath("/dashboard/cv");
  revalidatePath("/dashboard");
  redirect("/dashboard/cv");
}

/** Promotes an existing library CV to master, demoting the current one (if any). */
export async function setMasterCvAction(cvId: string): Promise<ActionResult> {
  const user = await requireAuthUser();
  const cv = await prisma.cv.findFirst({ where: { id: cvId, userId: user.id } });
  if (!cv) return { error: "CV introuvable." };
  if (cv.status !== "READY") return { error: "Ce CV doit être prêt avant de pouvoir devenir votre CV maître." };

  await prisma.$transaction([
    prisma.cv.updateMany({ where: { userId: user.id, isMaster: true }, data: { isMaster: false } }),
    prisma.cv.update({ where: { id: cvId }, data: { isMaster: true } }),
  ]);

  revalidatePath("/dashboard/cv");
  revalidatePath("/dashboard");
  return { success: true };
}

/** Toggles a CV's favorite flag — purely organizational, no effect on which CV is used as master. */
export async function toggleCvFavoriteAction(cvId: string): Promise<ActionResult<{ isFavorite: boolean }>> {
  const user = await requireAuthUser();
  const cv = await prisma.cv.findFirst({ where: { id: cvId, userId: user.id } });
  if (!cv) return { error: "CV introuvable." };

  const updated = await prisma.cv.update({ where: { id: cvId }, data: { isFavorite: !cv.isFavorite } });

  revalidatePath("/dashboard/cv");
  return { success: true, isFavorite: updated.isFavorite };
}

/** Edits an already-confirmed master CV in place. */
export async function updateCvDataAction(cvId: string, input: ParsedCv): Promise<ActionResult> {
  const result = await saveCvData(cvId, input);
  if (result.error) return { error: result.error };

  revalidatePath("/dashboard/cv");
  revalidatePath(`/dashboard/cv/${cvId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

/** Re-runs LLM structuring on an already-extracted CV (e.g. after a transient failure), without re-uploading the file. */
export async function retryCvParsingAction(cvId: string): Promise<ActionResult> {
  const user = await requireAuthUser();
  const cv = await prisma.cv.findFirst({ where: { id: cvId, userId: user.id } });
  if (!cv) return { error: "CV introuvable." };
  if (!cv.storagePath || !cv.fileType) {
    return { error: "Ce CV n'a pas de fichier associé à ré-analyser." };
  }

  const credits = await consumeCredits(user, "CV_PARSE");
  if (!credits.ok) return { error: credits.error };

  await prisma.cv.update({ where: { id: cvId }, data: { status: "PROCESSING" } });

  let rawText = cv.rawText;
  if (!rawText || rawText.trim().length < 30) {
    try {
      const supabase = await createClient();
      const bytes = await downloadCvFile(supabase, cv.storagePath);
      rawText = await extractCvText(bytes, cv.fileType);
    } catch (error) {
      console.error(`[cv] retry extraction failed for cv ${cvId}:`, error);
      await prisma.cv.update({
        where: { id: cvId },
        data: { status: "FAILED", errorMessage: GENERIC_PARSE_FAILURE_MESSAGE },
      });
      return { error: GENERIC_PARSE_FAILURE_MESSAGE };
    }
  }

  const parsed = await parseCvWithLlm(rawText);
  await prisma.cv.update({
    where: { id: cvId },
    data: {
      rawText,
      status: parsed ? "READY" : "FAILED",
      errorMessage: parsed ? null : GENERIC_PARSE_FAILURE_MESSAGE,
    },
  });

  if (parsed) {
    await prisma.cvData.upsert({
      where: { cvId },
      create: { cvId, ...cvDataJson(parsed) },
      update: cvDataJson(parsed),
    });
  }

  revalidatePath("/dashboard/cv/review");
  return parsed ? { success: true } : { error: GENERIC_PARSE_FAILURE_MESSAGE };
}

export async function deleteCvAction(cvId: string): Promise<ActionResult> {
  const user = await requireAuthUser();
  const cv = await prisma.cv.findFirst({ where: { id: cvId, userId: user.id } });
  if (!cv) return { error: "CV introuvable." };

  const supabase = await createClient();
  await purgeCv(supabase, cv);

  revalidatePath("/dashboard/cv");
  revalidatePath("/dashboard");
  redirect("/dashboard/cv");
}

export async function getCvDownloadUrlAction(cvId: string): Promise<ActionResult<{ url: string }>> {
  const user = await requireAuthUser();
  const cv = await prisma.cv.findFirst({ where: { id: cvId, userId: user.id } });
  if (!cv) return { error: "CV introuvable." };
  if (!cv.storagePath) return { error: "Ce CV n'a pas de fichier original (généré automatiquement)." };

  try {
    const supabase = await createClient();
    const url = await getSignedCvUrl(supabase, cv.storagePath);
    return { success: true, url };
  } catch (error) {
    console.error(`[cv] failed to sign download url for cv ${cvId}:`, error);
    return { error: "Impossible de générer le lien de téléchargement." };
  }
}
