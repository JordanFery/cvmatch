import Link from "next/link";
import { FileText } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function LandingNavbar({
  dict,
  locale,
  isAuthenticated = false,
}: {
  dict: Dictionary;
  locale: Locale;
  isAuthenticated?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:h-16 sm:flex-nowrap sm:py-0 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="size-3.5" aria-hidden="true" />
          </span>
          <span>CVMatch</span>
        </Link>

        <div className="flex items-center gap-1">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
        </div>

        {isAuthenticated ? (
          <ButtonLink href="/dashboard" size="sm">
            {dict.nav.dashboard}
          </ButtonLink>
        ) : (
          <div className="flex w-full flex-col items-stretch gap-1.5 sm:w-auto sm:flex-row sm:items-center sm:gap-1">
            <ButtonLink href="/login" variant="ghost" size="sm">
              {dict.nav.login}
            </ButtonLink>
            <ButtonLink href="/register" size="sm">
              {dict.nav.register}
            </ButtonLink>
          </div>
        )}
      </div>
    </header>
  );
}
