import type { Metadata } from "next";
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
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAuthUser } from "@/lib/data/profile";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { canonical: "/" },
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

export default async function HomePage() {
  const [{ dict, locale }, user] = await Promise.all([getDictionary(), getAuthUser()]);

  return (
    <div className="flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <LandingHero dict={dict} isAuthenticated={!!user} />
        <LandingProblem dict={dict} />
        <LandingHowItWorks dict={dict} />
        <LandingFeatures dict={dict} />
        <LandingProductPreview dict={dict} />
        <LandingPricingTeaser dict={dict} />
        <LandingCta dict={dict} isAuthenticated={!!user} />
      </main>
      <LandingFooter dict={dict} />
    </div>
  );
}
