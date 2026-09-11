import type { Metadata } from "next";
import { getAuthUser } from "@/lib/data/profile";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { PricingCards } from "@/components/billing/pricing-cards";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Découvrez les forfaits CVMatch : commencez gratuitement, puis passez à un forfait Essentiel ou Pro pour plus de crédits IA et une recherche d'emploi plus intensive.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Tarifs — CVMatch",
    description: "Des forfaits simples pour optimiser votre CV à chaque candidature, du gratuit au Pro.",
  },
};

export default async function PricingPage() {
  const [user, { dict, locale }] = await Promise.all([getAuthUser(), getDictionary()]);

  return (
    <div className="flex min-h-full flex-col">
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Un tarif simple, basé sur l&apos;usage</h1>
            <p className="mt-4 text-muted-foreground">
              Chaque analyse ou génération assistée par IA consomme des crédits. Choisissez le forfait
              adapté au rythme de votre recherche d&apos;emploi — changez ou annulez à tout moment.
            </p>
          </div>

          <div className="mt-12">
            <PricingCards isAuthenticated={!!user} />
          </div>

          <div className="mx-auto mt-16 max-w-2xl text-center text-sm text-muted-foreground">
            <p>
              1 crédit ≈ une action IA légère (import d&apos;offre, analyse ATS). L&apos;analyse de CV
              compte pour 2 crédits, la génération d&apos;un CV adapté pour 3 crédits — c&apos;est
              l&apos;action la plus coûteuse à produire.
            </p>
          </div>
        </div>
      </main>
      <LandingFooter dict={dict} />
    </div>
  );
}
