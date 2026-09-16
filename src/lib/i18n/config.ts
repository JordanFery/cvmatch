export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Locale-prefixed path for internal links on public pages, e.g. localeHref("fr", "/pricing") -> "/fr/pricing". Omit `path` for the homepage. */
export function localeHref(locale: Locale, path: string = ""): string {
  return `/${locale}${path}`;
}
