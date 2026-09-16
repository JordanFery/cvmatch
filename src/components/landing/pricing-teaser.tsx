import { Check } from "lucide-react";
import { PUBLIC_PLANS } from "@/lib/billing/plans";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";

export function LandingPricingTeaser({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section className="border-t border-border/60 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{dict.pricingTeaser.title}</h2>
          <p className="mt-3 text-muted-foreground">{dict.pricingTeaser.description}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {PUBLIC_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-xl border p-6",
                plan.highlighted ? "border-tertiary ring-1 ring-tertiary" : "border-border",
              )}
            >
              <p className="font-medium">{plan.name}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {plan.priceLabel}
                {plan.priceCents > 0 && <span className="text-sm font-normal text-muted-foreground">/mois</span>}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <ButtonLink href={localeHref(locale, "/pricing")} variant="outline">
            {dict.pricingTeaser.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
