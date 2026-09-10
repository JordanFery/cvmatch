import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/data/profile";

/** Current user's profile, redirecting to /dashboard if they aren't an admin. Never self-service — see the `isAdmin` field on User. */
export const requireAdmin = cache(async () => {
  const profile = await getCurrentProfile();
  if (!profile.isAdmin) redirect("/dashboard");
  return profile;
});

/** Every user, with their subscription and usage counts, for the admin users table. Optionally filtered by an email/name search term. */
export const getAdminUsers = cache(async (query?: string) => {
  await requireAdmin();

  const trimmed = query?.trim();
  const where = trimmed
    ? {
        OR: [
          { email: { contains: trimmed, mode: "insensitive" as const } },
          { firstName: { contains: trimmed, mode: "insensitive" as const } },
          { lastName: { contains: trimmed, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  return prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      subscription: true,
      _count: { select: { cvs: true, jobOffers: true, badges: true } },
    },
  });
});
