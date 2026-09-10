import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/data/profile";
import { emptyParsedCv, parsedCvSchema, type ParsedCv } from "@/lib/validations/cv";

function toParsedCv(data: {
  personalInfo: unknown;
  summary: string | null;
  experiences: unknown;
  education: unknown;
  skills: unknown;
  certifications: unknown;
  projects: unknown;
  languages: unknown;
  customSections: unknown;
}): ParsedCv {
  const parsed = parsedCvSchema.safeParse({
    personalInfo: data.personalInfo,
    summary: data.summary,
    experiences: data.experiences,
    education: data.education,
    skills: data.skills,
    certifications: data.certifications,
    projects: data.projects,
    languages: data.languages,
    customSections: data.customSections,
  });
  return parsed.success ? parsed.data : emptyParsedCv();
}

/** The current user's master CV (the one shown across the dashboard), or `null`. */
export const getMasterCv = cache(async () => {
  const user = await requireAuthUser();
  const cv = await prisma.cv.findFirst({
    where: { userId: user.id, isMaster: true },
    include: { data: true },
  });
  if (!cv) return null;
  return { ...cv, parsedData: cv.data ? toParsedCv(cv.data) : emptyParsedCv() };
});

/** Every CV in the current user's library — master first, then most recently updated. */
export const getCvLibrary = cache(async () => {
  const user = await requireAuthUser();
  const cvs = await prisma.cv.findMany({
    where: { userId: user.id },
    include: { data: true },
    orderBy: [{ isMaster: "desc" }, { isFavorite: "desc" }, { updatedAt: "desc" }],
  });
  return cvs.map((cv) => ({ ...cv, parsedData: cv.data ? toParsedCv(cv.data) : emptyParsedCv() }));
});

/**
 * A specific CV owned by the current user, or `null` if it doesn't exist or
 * belongs to someone else — callers must treat both cases identically
 * (never reveal whether a CV id exists for another user).
 */
export async function getOwnedCv(cvId: string) {
  const user = await requireAuthUser();
  const cv = await prisma.cv.findFirst({
    where: { id: cvId, userId: user.id },
    include: { data: true },
  });
  if (!cv) return null;
  return { ...cv, parsedData: cv.data ? toParsedCv(cv.data) : emptyParsedCv() };
}
