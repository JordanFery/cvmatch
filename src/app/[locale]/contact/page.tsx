import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail } from "lucide-react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getAuthUser } from "@/lib/data/profile";
import { localeAlternates } from "@/lib/i18n/alternates";

// Hardcoded on this page specifically (rather than the env-driven
// SUPPORT_EMAIL in src/lib/legal/site.ts) so the mailto link and the
// displayed address are always this one, regardless of how
// NEXT_PUBLIC_SUPPORT_EMAIL is configured in a given environment.
const CONTACT_EMAIL = "jordan.fery.dev@gmail.com";

type Params = { params: Promise<{ locale: string }> };

const COPY: Record<Locale, { title: string; description: string; intro: string; replyTime: string }> = {
  fr: {
    title: "Contact",
    description: "Contactez l'équipe CVMatch pour toute question sur votre compte, votre abonnement ou nos fonctionnalités.",
    intro:
      "Une question sur votre compte, votre abonnement, ou une idée de fonctionnalité ? Écrivez-nous, on vous répond directement.",
    replyTime: "Nous répondons généralement sous 2 jours ouvrés.",
  },
  en: {
    title: "Contact",
    description: "Contact the CVMatch team with any question about your account, subscription, or our features.",
    intro: "A question about your account, your subscription, or a feature idea? Write to us — we reply directly.",
    replyTime: "We usually reply within 2 business days.",
  },
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = COPY[locale];
  return {
    title: copy.title,
    description: copy.description,
    alternates: localeAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = dictionaries[locale];
  const copy = COPY[locale];
  const user = await getAuthUser();

  return (
    <div className="flex min-h-full flex-col">
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
          <p className="mt-4 text-muted-foreground">{copy.intro}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 font-medium hover:bg-muted"
          >
            <Mail className="size-4" aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
          <p className="mt-6 text-sm text-muted-foreground">{copy.replyTime}</p>
        </div>
      </main>
      <LandingFooter dict={dict} locale={locale} />
    </div>
  );
}
