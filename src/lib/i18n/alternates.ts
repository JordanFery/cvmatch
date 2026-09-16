import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";

/**
 * Builds the canonical + hreflang block for a dual-locale public page.
 * `path` is the locale-agnostic part after the prefix, e.g. "/pricing" or
 * "" for the homepage. `x-default` points at French since that's this
 * site's default/fallback locale (see `defaultLocale` in i18n/config.ts).
 */
export function localeAlternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      fr: `/fr${path}`,
      en: `/en${path}`,
      "x-default": `/fr${path}`,
    },
  };
}
