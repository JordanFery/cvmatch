"use server";

import { redirect } from "next/navigation";
import { requireAuthUser } from "@/lib/data/profile";
import { getOrCreateSubscription } from "@/lib/billing/credits";
import { getStripePriceId, type PlanIdValue } from "@/lib/billing/plans";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

type ActionResult = { error: string };

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

async function getOrCreateStripeCustomerId(userId: string, email: string): Promise<string> {
  const subscription = await getOrCreateSubscription(userId);
  if (subscription.stripeCustomerId) return subscription.stripeCustomerId;

  const customer = await getStripe().customers.create({ email, metadata: { userId } });
  await prisma.subscription.update({ where: { userId }, data: { stripeCustomerId: customer.id } });
  return customer.id;
}

export async function createCheckoutSessionAction(planId: PlanIdValue): Promise<ActionResult | void> {
  if (planId !== "ESSENTIAL" && planId !== "PRO") {
    return { error: "Ce forfait n'est pas disponible à l'achat." };
  }

  const user = await requireAuthUser();
  const customerId = await getOrCreateStripeCustomerId(user.id, user.email ?? "");

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: getStripePriceId(planId), quantity: 1 }],
    success_url: `${siteUrl()}/dashboard/billing?checkout=success`,
    cancel_url: `${siteUrl()}/dashboard/billing?checkout=cancelled`,
    metadata: { userId: user.id, planId },
    subscription_data: { metadata: { userId: user.id, planId } },
  });

  if (!session.url) {
    return { error: "Impossible de créer la session de paiement." };
  }

  redirect(session.url);
}

export async function createPortalSessionAction(): Promise<ActionResult | void> {
  const user = await requireAuthUser();
  const subscription = await getOrCreateSubscription(user.id);

  if (!subscription.stripeCustomerId) {
    return { error: "Aucun abonnement à gérer pour le moment." };
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${siteUrl()}/dashboard/billing`,
  });

  redirect(session.url);
}
