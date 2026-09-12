"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

type ActionResult = { error: string } | { success: true };
type RegisterResult = { error: string } | { success: true; needsEmailConfirmation: boolean };

const MAX_SIGNUPS_PER_IP_PER_HOUR = 5;

/** Best-effort client IP from the proxy-set header — "unknown" locally (no proxy in front), which simply skips rate limiting rather than blocking dev/test signups. */
async function clientIp(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/**
 * Atomically checks-and-reserves one signup slot for this IP, or returns
 * `false` if it's already at the hourly cap. A plain `count()` followed by
 * a separate `create()` (what this replaced) has the same shape of race as
 * the one fixed in consumeCredits: several concurrent signup requests from
 * the same IP can each read the count *before* any of them writes, so all
 * of them see "under the limit" and all proceed. `pg_advisory_xact_lock`
 * serializes concurrent callers that hash to the same IP for the lifetime
 * of this transaction, so the count-then-insert inside is only ever
 * evaluated by one caller at a time — closing that race without needing a
 * dedicated per-IP counter row.
 */
async function tryReserveSignupSlot(ip: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${ip}))`;
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const recentAttempts = await tx.registrationAttempt.count({
      where: { ipAddress: ip, createdAt: { gte: since } },
    });
    if (recentAttempts >= MAX_SIGNUPS_PER_IP_PER_HOUR) return false;
    await tx.registrationAttempt.create({ data: { ipAddress: ip } });
    return true;
  });
}

function mapAuthError(message: string): string {
  const known: Record<string, string> = {
    "Invalid login credentials": "E-mail ou mot de passe incorrect.",
    "User already registered": "Un compte existe déjà avec cette adresse e-mail.",
    "Email not confirmed": "Veuillez confirmer votre e-mail avant de vous connecter.",
  };
  return known[message] ?? message;
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
  if (ip !== "unknown" && !(await tryReserveSignupSlot(ip))) {
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
