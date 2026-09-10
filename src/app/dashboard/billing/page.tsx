import type { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";
import { getCurrentSubscription } from "@/lib/data/billing";
import { PLANS } from "@/lib/billing/plans";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/ui/page-header";
import { PricingCards } from "@/components/billing/pricing-cards";
import { PortalButton } from "@/components/billing/portal-button";

export const metadata: Metadata = { title: "Facturation" };

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  TRIALING: "Essai",
  PAST_DUE: "Paiement en retard",
  CANCELED: "Annulé",
  INCOMPLETE: "Incomplet",
};

const STATUS_VARIANTS: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  ACTIVE: "success",
  TRIALING: "warning",
  PAST_DUE: "destructive",
  CANCELED: "outline",
  INCOMPLETE: "warning",
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const subscription = await getCurrentSubscription();
  const plan = PLANS[subscription.plan];
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

  return (
    <div className="space-y-6">
      <PageHeader title="Facturation" description="Gérez votre forfait et vos crédits IA." />

      {checkout === "success" && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          Paiement confirmé, merci ! Votre forfait est mis à jour.
        </div>
      )}
      {checkout === "cancelled" && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <XCircle className="size-4 shrink-0" aria-hidden="true" />
          Paiement annulé — aucun changement n&apos;a été effectué.
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Forfait {plan.name}</CardTitle>
            <Badge variant={STATUS_VARIANTS[subscription.status] ?? "outline"}>
              {STATUS_LABELS[subscription.status] ?? subscription.status}
            </Badge>
          </div>
          <CardDescription>
            {subscription.cancelAtPeriodEnd
              ? `Votre abonnement prendra fin le ${dateFormatter.format(subscription.creditsResetAt)} et ne sera pas renouvelé.`
              : `Renouvellement des crédits le ${dateFormatter.format(subscription.creditsResetAt)}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium">Crédits IA</p>
              <p className="text-sm text-muted-foreground">
                {plan.unlimited ? "Illimité" : `${subscription.creditsRemaining} / ${plan.monthlyCredits}`}
              </p>
            </div>
            {!plan.unlimited && (
              <Progress
                value={Math.min(100, (subscription.creditsRemaining / plan.monthlyCredits) * 100)}
                className="mt-2"
              />
            )}
          </div>
          {subscription.stripeCustomerId && <PortalButton />}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-medium">Changer de forfait</h2>
        <PricingCards isAuthenticated currentPlan={subscription.plan} />
      </div>
    </div>
  );
}
