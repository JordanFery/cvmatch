import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingProblem } from "@/components/landing/problem";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingFeatures } from "@/components/landing/features";
import { LandingProductPreview } from "@/components/landing/product-preview";
import { LandingPricingTeaser } from "@/components/landing/pricing-teaser";
import { LandingCta } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/footer";
import { PUBLIC_PLANS } from "@/lib/billing/plans";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { getAuthUser } from "@/lib/data/profile";
import { SITE_URL } from "@/lib/site-url";
import { localeAlternates } from "@/lib/i18n/alternates";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = dictionaries[locale];
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: localeAlternates(locale, ""),
  };
}

/** Rich-result eligibility (pricing, ratings) for search engines — see https://schema.org/SoftwareApplication. */
function structuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CVMatch",
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Adaptez votre CV aux offres d'emploi, améliorez votre compatibilité ATS et centralisez vos candidatures.",
    offers: PUBLIC_PLANS.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: (plan.priceCents / 100).toFixed(2),
      priceCurrency: "CAD",
      description: plan.description,
    })),
  };
}

export default async function HomePage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = dictionaries[locale];
  const user = await getAuthUser();

  return (
    <div className="flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <LandingHero dict={dict} locale={locale} isAuthenticated={!!user} />
        <LandingProblem dict={dict} />
        <LandingHowItWorks dict={dict} />
        <LandingFeatures dict={dict} />
        <LandingProductPreview dict={dict} />
        <LandingPricingTeaser dict={dict} locale={locale} />
        <LandingCta dict={dict} locale={locale} isAuthenticated={!!user} />
      </main>
      <LandingFooter dict={dict} locale={locale} />
    </div>
  );
}
