import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { AtsScoreForm } from "@/components/tools/ats-score-form";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getAuthUser } from "@/lib/data/profile";
import { localeAlternates } from "@/lib/i18n/alternates";

type Params = { params: Promise<{ locale: string }> };

const COPY: Record<Locale, { title: string; description: string; heading: string; intro: string; freeNote: string }> = {
  fr: {
    title: "Vérificateur de compatibilité ATS gratuit",
    description:
      "Vérifiez gratuitement si votre CV passe les filtres ATS pour une offre d'emploi précise : score de compatibilité, mots-clés manquants et recommandations concrètes.",
    heading: "Vérifiez la compatibilité ATS de votre CV — gratuit",
    intro:
      "Collez votre CV et le texte d'une offre d'emploi. En quelques secondes, obtenez un score de compatibilité, les mots-clés manquants et des recommandations concrètes — sans créer de compte.",
    freeNote: "3 analyses gratuites par jour, sans inscription.",
  },
  en: {
    title: "Free ATS Resume Checker",
    description:
      "Check for free whether your resume passes ATS filters for a specific job posting: compatibility score, missing keywords, and concrete recommendations.",
    heading: "Check your resume's ATS compatibility — free",
    intro:
      "Paste your resume and a job posting's text. In seconds, get a compatibility score, missing keywords, and concrete recommendations — no account needed.",
    freeNote: "3 free analyses per day, no sign-up required.",
  },
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = COPY[locale];
  return {
    title: copy.title,
    description: copy.description,
    alternates: localeAlternates(locale, "/tools/ats-score"),
    openGraph: { title: copy.title, description: copy.description },
  };
}

export default async function AtsScoreToolPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = dictionaries[locale];
  const copy = COPY[locale];
  const user = await getAuthUser();

  return (
    <div className="flex min-h-full flex-col">
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.heading}</h1>
          <p className="mt-4 text-muted-foreground">{copy.intro}</p>
          <p className="mt-2 text-sm text-muted-foreground">{copy.freeNote}</p>

          <div className="mt-10">
            <AtsScoreForm locale={locale} />
          </div>
        </div>
      </main>
      <LandingFooter dict={dict} locale={locale} />
    </div>
  );
}
