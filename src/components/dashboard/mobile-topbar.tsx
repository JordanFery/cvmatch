"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";

export function MobileTopbar({
  userMenu,
  creditsIndicator,
  isAdmin,
  dict,
  locale,
}: {
  userMenu: ReactNode;
  creditsIndicator: ReactNode;
  isAdmin?: boolean;
  dict: Dictionary;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
      <Link href={localeHref(locale)} className="flex items-center gap-2 font-semibold tracking-tight">
        <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <FileText className="size-3.5" aria-hidden="true" />
        </span>
        <span>CVMatch</span>
      </Link>
      <div className="flex items-center gap-1">
        <LanguageSwitcher locale={locale} />
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
            <SheetHeader className="h-14 justify-center border-b border-sidebar-border px-4 py-0">
              <SheetTitle className="flex items-center gap-2 text-left font-semibold tracking-tight text-sidebar-foreground">
                <span className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <FileText className="size-3.5" aria-hidden="true" />
                </span>
                CVMatch
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <SidebarNav dict={dict} onNavigate={() => setOpen(false)} isAdmin={isAdmin} />
            </div>
            <div className="px-3 pb-1">{creditsIndicator}</div>
            <div className="px-3 pb-3">{userMenu}</div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
