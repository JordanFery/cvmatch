import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/alternates";

type Params = { params: Promise<{ locale: string }>; searchParams: Promise<{ redirectTo?: string }> };

const COPY: Record<Locale, { title: string; description: string }> = {
  fr: { title: "Connexion", description: "Connectez-vous à votre compte CVMatch pour continuer à optimiser vos candidatures." },
  en: { title: "Log in", description: "Log in to your CVMatch account to keep optimizing your applications." },
};

export async function generateMetadata({ params }: Omit<Params, "searchParams">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = COPY[locale];
  return {
    title: copy.title,
    description: copy.description,
    alternates: localeAlternates(locale, "/login"),
  };
}

export default async function LoginPage({ params, searchParams }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { redirectTo } = await searchParams;
  const dict = dictionaries[locale];
  return <LoginForm redirectTo={redirectTo} dict={dict} locale={locale} />;
}
