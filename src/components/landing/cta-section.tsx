import { ButtonLink } from "@/components/ui/button-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";

export function LandingCta({
  dict,
  locale,
  isAuthenticated = false,
}: {
  dict: Dictionary;
  locale: Locale;
  isAuthenticated?: boolean;
}) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{dict.cta.title}</h2>
      <div className="mt-8">
        <ButtonLink href={isAuthenticated ? "/dashboard" : localeHref(locale, "/register")} size="lg">
          {isAuthenticated ? dict.cta.buttonAuthenticated : dict.cta.button}
        </ButtonLink>
      </div>
    </section>
  );
}
