import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthUser } from "@/lib/data/profile";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { PricingCards } from "@/components/billing/pricing-cards";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";

type Params = { params: Promise<{ locale: string }> };

// Plan name/description/features (PUBLIC_PLANS) stay French for both
// locales for now — see the note in pricing-cards.tsx.
const COPY: Record<Locale, { title: string; description: string; heading: string; intro: string; footnote: string }> = {
  fr: {
    title: "Tarifs",
    description:
      "Découvrez les forfaits CVMatch : commencez gratuitement, puis passez à un forfait Essentiel ou Pro pour plus de crédits IA et une recherche d'emploi plus intensive.",
    heading: "Un tarif simple, basé sur l'usage",
    intro:
      "Chaque analyse ou génération assistée par IA consomme des crédits. Choisissez le forfait adapté au rythme de votre recherche d'emploi — changez ou annulez à tout moment.",
    footnote:
      "1 crédit ≈ une action IA légère (import d'offre, analyse ATS). L'analyse de CV compte pour 2 crédits, la génération d'un CV adapté pour 3 crédits — c'est l'action la plus coûteuse à produire.",
  },
  en: {
    title: "Pricing",
    description:
      "Explore CVMatch's plans: start for free, then upgrade to Essential or Pro for more AI credits and a more intensive job search.",
    heading: "Simple, usage-based pricing",
    intro:
      "Every AI-assisted analysis or generation uses credits. Pick the plan that matches the pace of your job search — change or cancel anytime.",
    footnote:
      "1 credit ≈ one light AI action (importing a job posting, an ATS analysis). Parsing a resume costs 2 credits, generating a tailored resume costs 3 credits — the most expensive action to produce.",
  },
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = COPY[locale];
  return {
    title: copy.title,
    description: copy.description,
    alternates: localeAlternates(locale, "/pricing"),
    openGraph: { title: `${copy.title} — CVMatch`, description: copy.description },
  };
}

export default async function PricingPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = dictionaries[locale];
  const copy = COPY[locale];
  const user = await getAuthUser();

  return (
    <div className="flex min-h-full flex-col">
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.heading}</h1>
            <p className="mt-4 text-muted-foreground">{copy.intro}</p>
          </div>

          <div className="mt-12">
            <PricingCards isAuthenticated={!!user} locale={locale} />
          </div>

          <div className="mx-auto mt-16 max-w-2xl text-center text-sm text-muted-foreground">
            <p>{copy.footnote}</p>
          </div>
        </div>
      </main>
      <LandingFooter dict={dict} locale={locale} />
    </div>
  );
}
