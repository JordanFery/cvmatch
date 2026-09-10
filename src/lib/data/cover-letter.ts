import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/data/profile";

export async function getCoverLetter(cvId: string, jobOfferId: string) {
  const user = await requireAuthUser();
  return prisma.coverLetter.findFirst({ where: { cvId, jobOfferId, userId: user.id } });
}
