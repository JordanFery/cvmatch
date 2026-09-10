import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte CVMatch pour continuer à optimiser vos candidatures.",
  alternates: { canonical: "/login" },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const [{ redirectTo }, { dict }] = await Promise.all([searchParams, getDictionary()]);
  return <LoginForm redirectTo={redirectTo} dict={dict} />;
}
