import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/data/profile";

export async function getAtsAnalysis(cvId: string, jobOfferId: string) {
  const user = await requireAuthUser();
  return prisma.atsAnalysis.findFirst({ where: { cvId, jobOfferId, userId: user.id } });
}
