import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Créer un compte",
  description:
    "Créez votre compte CVMatch gratuit et commencez à adapter votre CV à chaque offre d'emploi en quelques minutes.",
  alternates: { canonical: "/register" },
};

export default async function RegisterPage() {
  const { dict } = await getDictionary();
  return <RegisterForm dict={dict} />;
}
