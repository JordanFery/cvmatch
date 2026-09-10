"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { setLocaleAction } from "@/lib/actions/locale";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const next: Locale = locale === "fr" ? "en" : "fr";

  const onClick = () => {
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
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
