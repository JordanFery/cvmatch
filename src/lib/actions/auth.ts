"use server";

import { redirect } from "next/navigation";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site-url";
import { clientIp, tryReserveSlot } from "@/lib/rate-limit";

type ActionResult = { error: string } | { success: true };
type RegisterResult = { error: string } | { success: true; needsEmailConfirmation: boolean };

const MAX_SIGNUPS_PER_IP_PER_HOUR = 5;

function mapAuthError(message: string): string {
  const known: Record<string, string> = {
    "Invalid login credentials": "E-mail ou mot de passe incorrect.",
    "User already registered": "Un compte existe déjà avec cette adresse e-mail.",
    "Email not confirmed": "Veuillez confirmer votre e-mail avant de vous connecter.",
  };
  if (known[message]) return known[message];
  // Any other Supabase message (network/config issues, unexpected cases) is
  // often raw English/technical text — never show it directly in this
  // French-only auth UI, log it instead so the real cause isn't lost.
  console.error("[auth] unmapped Supabase error:", message);
  return "Une erreur est survenue. Merci de réessayer.";
}

export async function registerAction(input: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const { firstName, lastName, email, password } = parsed.data;
  const ip = await clientIp();

  // Reserve the slot *before* calling Supabase — if signUp fails afterward
  // (bad email, already-registered address, etc.) the slot stays spent,
  // which is the safer failure mode for a rate limit than the reverse.
  if (ip !== "unknown" && !(await tryReserveSlot("signup", ip, MAX_SIGNUPS_PER_IP_PER_HOUR, 60 * 60 * 1000))) {
    return { error: "Trop de comptes créés récemment depuis cette connexion. Merci de réessayer plus tard." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  // Enforce email confirmation ourselves regardless of the Supabase
  // project's "Confirm email" dashboard toggle — a session coming back
  // unconfirmed must not reach the dashboard (that's the free-credit-farming
  // path this closes; see consumeCredits in src/lib/billing/credits.ts for
  // the second layer of the same check).
  if (data.session && !data.user?.email_confirmed_at) {
    await supabase.auth.signOut();
    return { success: true, needsEmailConfirmation: true };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return { success: true, needsEmailConfirmation: true };
}

const MAX_RESEND_PER_IP_PER_HOUR = 5;

/** Resends the signup confirmation e-mail — surfaced on the "check your inbox" screen so a lost/delayed e-mail isn't a dead end. */
export async function resendConfirmationEmailAction(email: string): Promise<ActionResult> {
  const ip = await clientIp();
  if (ip !== "unknown" && !(await tryReserveSlot("resend-confirmation", ip, MAX_RESEND_PER_IP_PER_HOUR, 60 * 60 * 1000))) {
    return { error: "Trop de tentatives. Merci de réessayer plus tard." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
  });

  // Supabase errors for an unknown/already-confirmed address too — never
  // reveal that distinction to the caller (account enumeration risk), just
  // log it server-side.
  if (error) console.error("[auth] resend confirmation failed:", error.message);
  return { success: true };
}

export async function loginAction(input: LoginInput, redirectTo?: string): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
