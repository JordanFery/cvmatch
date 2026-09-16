import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";

type Params = { params: Promise<{ locale: string }> };

const COPY: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Créer un compte",
    description: "Créez votre compte CVMatch gratuit et commencez à adapter votre CV à chaque offre d'emploi en quelques minutes.",
  },
  en: {
    title: "Create an account",
    description: "Create your free CVMatch account and start tailoring your resume to every job posting in minutes.",
  },
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = COPY[locale];
  return {
    title: copy.title,
    description: copy.description,
    alternates: localeAlternates(locale, "/register"),
  };
}

export default async function RegisterPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = dictionaries[locale];
  return <RegisterForm dict={dict} locale={locale} />;
}
