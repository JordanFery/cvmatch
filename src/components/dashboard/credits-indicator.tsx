import Link from "next/link";
import { Zap } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function CreditsIndicator({
  creditsRemaining,
  unlimited,
  dict,
}: {
  creditsRemaining: number;
  unlimited?: boolean;
  dict: Dictionary;
}) {
  const label = unlimited
    ? dict.dashboardShell.creditsUnlimited
    : dict.dashboardShell.creditsRemaining.replace("{count}", String(creditsRemaining));

  return (
    <Link
      href="/dashboard/billing"
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
    >
      <Zap className="size-4" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
