import { cache } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type AuthUser = { id: string; email: string | null; emailConfirmed: boolean };

/** Real network round trip to Supabase's auth server — only needed as a fallback (see getAuthUser) or when full user metadata is required. */
async function fetchAuthUserFromSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Current authenticated user, or `null` if not signed in. Reads the
 * identity our own middleware already verified via a real
 * `supabase.auth.getUser()` call earlier in this same request (see
 * src/lib/supabase/middleware.ts) — this avoids paying for that network
 * round trip a second time on every Server Component render and Server
 * Action, which was previously adding a full extra round trip to *every*
 * dashboard navigation. Falls back to a direct check if the headers are
 * somehow missing (e.g. a request that bypassed middleware).
 */
export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  const headerList = await headers();
  const id = headerList.get("x-user-id");
  if (id) {
    return {
      id,
      email: headerList.get("x-user-email"),
      emailConfirmed: headerList.get("x-user-email-confirmed") === "1",
    };
  }

  const user = await fetchAuthUserFromSupabase();
  return user ? { id: user.id, email: user.email ?? null, emailConfirmed: !!user.email_confirmed_at } : null;
});

/** Current authenticated user, redirecting to /login if not signed in. */
export async function requireAuthUser(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Current user's profile row. A database trigger creates it automatically on
 * signup, but we fall back to creating it here too in case a user exists
 * without one (e.g. was created before the trigger, or the trigger raced).
 */
export const getCurrentProfile = cache(async () => {
  const user = await requireAuthUser();

  const profile = await prisma.user.findUnique({ where: { id: user.id } });
  if (profile) return profile;

  // Rare path (signup trigger raced or hasn't run yet) — worth the extra
  // round trip here to get real first/last name from auth metadata, which
  // the fast header-based path above doesn't carry.
  const fullUser = await fetchAuthUserFromSupabase();
  const metadata = (fullUser?.user_metadata ?? {}) as { first_name?: string; last_name?: string };
  return prisma.user.create({
    data: {
      id: user.id,
      email: user.email ?? "",
      firstName: metadata.first_name ?? "",
      lastName: metadata.last_name ?? "",
    },
  });
});
