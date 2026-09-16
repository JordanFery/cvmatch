"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { setLocaleAction } from "@/lib/actions/locale";
import { Button } from "@/components/ui/button";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const next: Locale = locale === "fr" ? "en" : "fr";

  // Public pages live under /fr or /en — the URL is the source of truth
  // there, so switching means navigating to the equivalent path, not just
  // flipping a cookie (see i18n plan A7). Dashboard pages have no locale
  // prefix and keep the original cookie-only behavior. (Known rough edge:
  // on the still French-only pages — blog/privacy/terms, see A6 — this
  // navigates to a path that 404s until those get real English content.)
  const isUrlLocalized = pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);

  const onClick = () => {
    startTransition(async () => {
      await setLocaleAction(next);
      if (isUrlLocalized) {
        const rest = pathname.slice(`/${locale}`.length);
        router.push(`${localeHref(next)}${rest}`);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={isPending}
      aria-label={next === "fr" ? "Passer en français" : "Switch to English"}
      className={cn(className)}
    >
      <Languages className="size-4" aria-hidden="true" />
      {locale.toUpperCase()}
    </Button>
  );
}
