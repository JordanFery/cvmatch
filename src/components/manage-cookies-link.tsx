"use client";

import { ANALYTICS_CONSENT_KEY } from "@/lib/cookie-consent";

/** Clears the stored analytics consent choice so the cookie banner reappears — the standard way to let a visitor change their mind later. */
export function ManageCookiesLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.removeItem(ANALYTICS_CONSENT_KEY);
        } catch {
          // Nothing to clear if storage is unavailable.
        }
        window.location.reload();
      }}
      className="hover:text-foreground"
    >
      {label}
    </button>
  );
}
