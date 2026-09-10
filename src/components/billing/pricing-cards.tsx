import { Check } from "lucide-react";
import { PUBLIC_PLANS, type PlanIdValue } from "@/lib/billing/plans";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { cn } from "@/lib/utils";

export function PricingCards({
  isAuthenticated,
  currentPlan,
}: {
  isAuthenticated: boolean;
  currentPlan?: PlanIdValue;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {PUBLIC_PLANS.map((plan) => {
        const isCurrent = currentPlan === plan.id;

        return (
          <Card key={plan.id} className={cn(plan.highlighted && "border-tertiary shadow-sm")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.highlighted && <Badge variant="tertiary">Populaire</Badge>}
                {isCurrent && <Badge variant="secondary">Forfait actuel</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <p className="pt-2">
                <span className="text-3xl font-semibold">{plan.priceLabel}</span>
                {plan.priceCents > 0 && <span className="text-muted-foreground"> / mois</span>}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isCurrent ? (
                <ButtonLink href="/dashboard/billing" variant="outline" className="w-full pointer-events-none opacity-60">
                  Forfait actuel
                </ButtonLink>
              ) : !isAuthenticated ? (
                <ButtonLink href="/register" variant={plan.highlighted ? "default" : "outline"} className="w-full">
                  {plan.id === "FREE" ? "Commencer gratuitement" : "Créer mon compte"}
                </ButtonLink>
              ) : plan.id === "FREE" ? (
                <ButtonLink href="/dashboard" variant="outline" className="w-full">
                  Continuer avec ce forfait
                </ButtonLink>
              ) : (
                <CheckoutButton
                  planId={plan.id}
                  label={`Passer à ${plan.name}`}
                  variant={plan.highlighted ? "default" : "outline"}
                />
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
