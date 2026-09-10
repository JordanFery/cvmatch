import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and returns the
 * current user (if any) alongside the response carrying the refreshed
 * cookies. Called from `src/proxy.ts`.
 *
 * Also forwards the verified identity to Server Components/Server Actions
 * via internal request headers (`x-user-id`/`x-user-email`/
 * `x-user-email-confirmed`), so `getAuthUser()` (src/lib/data/profile.ts)
 * doesn't have to pay for a second `supabase.auth.getUser()` network round
 * trip — the one below has already done the real verification for this
 * request. Any client-supplied value for these headers is stripped first
 * so it can't be spoofed.
 */
export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-user-id");
  requestHeaders.delete("x-user-email");
  requestHeaders.delete("x-user-email-confirmed");

  let cookiesToApply: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToApply = cookiesToSet;
        },
      },
    },
  );

  // IMPORTANT: getUser() revalidates the token against the Supabase auth
  // server on every call — unlike getSession(), it can't be spoofed by a
  // tampered cookie. Always use it for authorization decisions. This is the
  // only place in the app that should call it; everywhere downstream reads
  // the verified result via the headers set below.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    requestHeaders.set("x-user-id", user.id);
    if (user.email) requestHeaders.set("x-user-email", user.email);
    requestHeaders.set("x-user-email-confirmed", user.email_confirmed_at ? "1" : "0");
  }

  const supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
  cookiesToApply.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));

  return { supabaseResponse, user };
}
