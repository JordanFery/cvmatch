"use server";

import { revalidatePath } from "next/cache";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { requireAuthUser } from "@/lib/data/profile";
import { prisma } from "@/lib/prisma";

type ActionResult = { error: string } | { success: true };

export async function updateProfileAction(input: ProfileInput): Promise<ActionResult> {
  const user = await requireAuthUser();

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const { firstName, lastName, phone, location, linkedinUrl, portfolioUrl, dailyApplicationGoal } = parsed.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName,
      lastName,
      phone: phone || null,
      location: location || null,
      linkedinUrl: linkedinUrl || null,
      portfolioUrl: portfolioUrl || null,
      dailyApplicationGoal: dailyApplicationGoal ? Number(dailyApplicationGoal) : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return { success: true };
}
