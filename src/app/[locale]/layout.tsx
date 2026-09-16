import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site-url";

const SITE_NAME = "CVMatch";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = dictionaries[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: `%s — ${SITE_NAME}`,
    },
    description: dict.meta.description,
    keywords: [
      "CV",
      "curriculum vitae",
      "resume",
      "ATS",
      "compatibilité ATS",
      "recherche d'emploi",
      "job search",
      "candidature",
      "optimisation CV",
      "IA",
      "offre d'emploi",
    ],
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    // No blanket canonical here — each indexable page sets its own via
    // localeAlternates() (see src/lib/i18n/alternates.ts).
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      title: dict.meta.title,
      description: dict.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <AppShell lang={locale}>{children}</AppShell>;
}
