"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/data/admin";
import { getOrCreateSubscription } from "@/lib/billing/credits";
import { PLANS, type PlanIdValue } from "@/lib/billing/plans";

type ActionResult = { error: string } | { success: true };

const PLAN_IDS: PlanIdValue[] = ["FREE", "ESSENTIAL", "PRO", "VIP"];

/** Manually overrides a user's plan — bypasses Stripe entirely (same as the original VIP grant), for comping a user or fixing a support issue. Resets their monthly allowance to the new plan's amount. */
export async function updateUserPlanAction(userId: string, plan: string): Promise<ActionResult> {
  await requireAdmin();

  if (!PLAN_IDS.includes(plan as PlanIdValue)) {
    return { error: "Forfait invalide." };
  }
  const planId = plan as PlanIdValue;

  await getOrCreateSubscription(userId);
  await prisma.subscription.update({
    where: { userId },
    data: { plan: planId, creditsRemaining: PLANS[planId].monthlyCredits },
  });

  revalidatePath("/dashboard/admin");
  return { success: true };
}

/** Grants one-off bonus credits without changing the user's plan — e.g. compensating a support issue. */
export async function grantBonusCreditsAction(userId: string, amount: number): Promise<ActionResult> {
  await requireAdmin();

  if (!Number.isInteger(amount) || amount <= 0 || amount > 1000) {
    return { error: "Le montant doit être un entier entre 1 et 1000." };
  }

  await getOrCreateSubscription(userId);
  await prisma.subscription.update({
    where: { userId },
    data: { creditsRemaining: { increment: amount } },
  });

  revalidatePath("/dashboard/admin");
  return { success: true };
}

/** Promotes/demotes another user's admin access. Can't be used on your own account, to avoid an accidental self-lockout from the panel. */
export async function setUserAdminAction(userId: string, isAdmin: boolean): Promise<ActionResult> {
  const me = await requireAdmin();
  if (userId === me.id) {
    return { error: "Vous ne pouvez pas modifier votre propre statut administrateur." };
  }

  await prisma.user.update({ where: { id: userId }, data: { isAdmin } });

  revalidatePath("/dashboard/admin");
  return { success: true };
}
