import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { SUPPORT_EMAIL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe CVMatch pour toute question sur votre compte, votre abonnement ou nos fonctionnalités.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { dict, locale } = await getDictionary();

  return (
    <div className="flex min-h-full flex-col">
      <LandingNavbar dict={dict} locale={locale} />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
          <p className="mt-4 text-muted-foreground">
            Une question sur votre compte, votre abonnement, ou une idée de fonctionnalité ? Écrivez-nous, on vous
            répond directement.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 font-medium hover:bg-muted"
          >
            <Mail className="size-4" aria-hidden="true" />
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-6 text-sm text-muted-foreground">Nous répondons généralement sous 2 jours ouvrés.</p>
        </div>
      </main>
      <LandingFooter dict={dict} />
    </div>
  );
}
