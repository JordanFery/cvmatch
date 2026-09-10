import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/data/profile";

/** Every job offer for the current user, as rows of the applications board — most recently touched first. */
export const getApplicationsBoard = cache(async () => {
  const user = await requireAuthUser();
  return prisma.jobOffer.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      salaryRange: true,
      sourceUrl: true,
      applicationStatus: true,
      appliedAt: true,
    },
  });
});

export const countSentApplications = cache(async () => {
  const user = await requireAuthUser();
  return prisma.jobOffer.count({
    where: { userId: user.id, applicationStatus: { not: "NOT_SENT" } },
  });
});

export const countInterviews = cache(async () => {
  const user = await requireAuthUser();
  return prisma.jobOffer.count({
    where: { userId: user.id, applicationStatus: "INTERVIEW" },
  });
});

/** Applications that got any employer response (interview or rejection) — the numerator for the dashboard's response rate. */
export const countRespondedApplications = cache(async () => {
  const user = await requireAuthUser();
  return prisma.jobOffer.count({
    where: { userId: user.id, applicationStatus: { in: ["INTERVIEW", "REJECTED"] } },
  });
});

/** Applications sent today (server local time), for the daily-goal reminder on the dashboard. */
export const countTodaysSentApplications = cache(async () => {
  const user = await requireAuthUser();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return prisma.jobOffer.count({
    where: { userId: user.id, appliedAt: { gte: startOfDay, lt: endOfDay } },
  });
});

/** Most recently touched applications (offers with a status beyond "not sent") for the dashboard summary. */
export const getRecentApplications = cache(async (limit: number) => {
  const user = await requireAuthUser();
  return prisma.jobOffer.findMany({
    where: { userId: user.id, applicationStatus: { not: "NOT_SENT" } },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: { id: true, title: true, company: true, applicationStatus: true, appliedAt: true },
  });
});

/**
 * Past applications (offers with a status beyond "not sent") at the same
 * company, excluding the current offer — surfaced as a warning before the
 * user applies again, in case they forgot they already tried this employer.
 * Matches case-insensitively since company names are free text from LLM
 * extraction ("Acme Corp" vs "ACME Corp").
 */
export const getPriorApplicationsAtCompany = cache(async (company: string, excludeJobOfferId: string) => {
  const user = await requireAuthUser();
  return prisma.jobOffer.findMany({
    where: {
      userId: user.id,
      id: { not: excludeJobOfferId },
      applicationStatus: { not: "NOT_SENT" },
      company: { equals: company, mode: "insensitive" },
    },
    orderBy: { appliedAt: "desc" },
    select: { id: true, title: true, appliedAt: true, applicationStatus: true },
  });
});
