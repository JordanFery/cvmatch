import Link from "next/link";
import { FileText } from "lucide-react";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { CreditsIndicator } from "@/components/dashboard/credits-indicator";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function Sidebar({
  firstName,
  lastName,
  email,
  creditsRemaining,
  unlimitedCredits,
  isAdmin,
  dict,
  locale,
}: {
  firstName: string;
  lastName: string;
  email: string;
  creditsRemaining: number;
  unlimitedCredits?: boolean;
  isAdmin?: boolean;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight text-sidebar-foreground">
          <span className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <FileText className="size-3.5" aria-hidden="true" />
          </span>
          <span>CVMatch</span>
        </Link>
        <div className="flex items-center">
          <LanguageSwitcher locale={locale} className="text-sidebar-foreground/70 hover:text-sidebar-accent-foreground" />
          <ThemeToggle className="text-sidebar-foreground/70 hover:text-sidebar-accent-foreground" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav dict={dict} isAdmin={isAdmin} />
      </div>
      <div className="px-3 pb-1">
        <CreditsIndicator creditsRemaining={creditsRemaining} unlimited={unlimitedCredits} dict={dict} />
      </div>
      <div className="px-3 pb-3">
        <UserMenu firstName={firstName} lastName={lastName} email={email} dict={dict} />
      </div>
    </aside>
  );
}
