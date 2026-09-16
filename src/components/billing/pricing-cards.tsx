import { Check } from "lucide-react";
import { PUBLIC_PLANS, type PlanIdValue } from "@/lib/billing/plans";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { cn } from "@/lib/utils";
import { localeHref, type Locale } from "@/lib/i18n/config";

// UI chrome only — plan name/description/features (PUBLIC_PLANS) stay French
// for both locales for now; translating the plan catalog itself is a
// separate, larger content task (see i18n plan follow-ups).
const COPY: Record<
  Locale,
  {
    popular: string;
    currentPlan: string;
    startFree: string;
    createAccount: string;
    continueWithPlan: string;
    switchTo: (planName: string) => string;
  }
> = {
  fr: {
    popular: "Populaire",
    currentPlan: "Forfait actuel",
    startFree: "Commencer gratuitement",
    createAccount: "Créer mon compte",
    continueWithPlan: "Continuer avec ce forfait",
    switchTo: (planName) => `Passer à ${planName}`,
  },
  en: {
    popular: "Popular",
    currentPlan: "Current plan",
    startFree: "Start for free",
    createAccount: "Create my account",
    continueWithPlan: "Continue with this plan",
    switchTo: (planName) => `Switch to ${planName}`,
  },
};

export function PricingCards({
  isAuthenticated,
  currentPlan,
  locale,
}: {
  isAuthenticated: boolean;
  currentPlan?: PlanIdValue;
  locale: Locale;
}) {
  const copy = COPY[locale];

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {PUBLIC_PLANS.map((plan) => {
        const isCurrent = currentPlan === plan.id;

        return (
          <Card key={plan.id} className={cn(plan.highlighted && "border-tertiary shadow-sm")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.highlighted && <Badge variant="tertiary">{copy.popular}</Badge>}
                {isCurrent && <Badge variant="secondary">{copy.currentPlan}</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <p className="pt-2">
                <span className="text-3xl font-semibold">{plan.priceLabel}</span>
                {plan.priceCents > 0 && (
                  <span className="text-muted-foreground">
                    {locale === "fr" ? " / mois, hors taxes" : " / month, before tax"}
                  </span>
                )}
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
                  {copy.currentPlan}
                </ButtonLink>
              ) : !isAuthenticated ? (
                <ButtonLink
                  href={localeHref(locale, "/register")}
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.id === "FREE" ? copy.startFree : copy.createAccount}
                </ButtonLink>
              ) : plan.id === "FREE" ? (
                <ButtonLink href="/dashboard" variant="outline" className="w-full">
                  {copy.continueWithPlan}
                </ButtonLink>
              ) : (
                <CheckoutButton
                  planId={plan.id}
                  label={copy.switchTo(plan.name)}
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
