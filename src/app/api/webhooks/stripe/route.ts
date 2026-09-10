import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { PLANS, getPlanByStripePriceId } from "@/lib/billing/plans";
import { reportError } from "@/lib/monitoring/alert";

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function mapStripeStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
      return "ACTIVE" as const;
    case "trialing":
      return "TRIALING" as const;
    case "past_due":
      return "PAST_DUE" as const;
    case "incomplete":
      return "INCOMPLETE" as const;
    default:
      // canceled, incomplete_expired, unpaid, paused
      return "CANCELED" as const;
  }
}

async function syncSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const row = await prisma.subscription.findUnique({ where: { stripeCustomerId: customerId } });
  if (!row) {
    reportError("stripe", `webhook: no subscription row for Stripe customer ${customerId}`);
    return;
  }

  const priceId = subscription.items.data[0]?.price.id ?? null;
  const plan = priceId ? (getPlanByStripePriceId(priceId) ?? "FREE") : row.plan;

  await prisma.subscription.update({
    where: { userId: row.userId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan,
      status: mapStripeStatus(subscription.status),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const row = await prisma.subscription.findUnique({ where: { stripeCustomerId: customerId } });
  if (!row) return;

  await prisma.subscription.update({
    where: { userId: row.userId },
    data: {
      plan: "FREE",
      status: "ACTIVE",
      stripeSubscriptionId: null,
      stripePriceId: null,
      cancelAtPeriodEnd: false,
      creditsRemaining: PLANS.FREE.monthlyCredits,
      creditsResetAt: addMonths(new Date(), 1),
    },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.parent?.subscription_details?.subscription) return; // one-off invoice, not a subscription renewal

  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const row = await prisma.subscription.findUnique({ where: { stripeCustomerId: customerId } });
  if (!row) return;

  await prisma.subscription.update({
    where: { userId: row.userId },
    data: {
      creditsRemaining: PLANS[row.plan].monthlyCredits,
      creditsResetAt: addMonths(new Date(), 1),
    },
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.error("[stripe] webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await syncSubscriptionFromStripe(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object);
        break;
      default:
        break;
    }
  } catch (error) {
    reportError(`stripe:${event.type}`, error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
