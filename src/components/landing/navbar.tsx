import Link from "next/link";
import { FileText } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function LandingNavbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="size-3.5" aria-hidden="true" />
          </span>
          <span>CVMatch</span>
        </Link>
        <nav className="flex items-center gap-1">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          <ButtonLink href="/login" variant="ghost" size="sm" className="ml-1">
            {dict.nav.login}
          </ButtonLink>
          <ButtonLink href="/register" size="sm">
            {dict.nav.register}
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
