"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNavLink, dashboardNavGroups, type NavLink } from "@/components/dashboard/nav-links";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function NavItem({
  link,
  label,
  isActive,
  onNavigate,
}: {
  link: NavLink;
  label: string;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      {isActive && (
        <span
          className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-primary"
          aria-hidden="true"
        />
      )}
      <link.icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function SidebarNav({
  dict,
  onNavigate,
  isAdmin,
}: {
  dict: Dictionary;
  onNavigate?: () => void;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const isLinkActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  return (
    <nav className="flex flex-col gap-5">
      {dashboardNavGroups.map((group) => (
        <div key={group.key} className="flex flex-col gap-1">
          <p className="px-3 text-xs font-medium tracking-wide text-sidebar-foreground/50 uppercase">
            {dict.dashboardShell.groups[group.key]}
          </p>
          {group.links.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              label={dict.dashboardShell.links[link.key]}
              isActive={isLinkActive(link.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}

      {isAdmin && (
        <div className="flex flex-col gap-1">
          <p className="px-3 text-xs font-medium tracking-wide text-sidebar-foreground/50 uppercase">
            {dict.dashboardShell.groups.admin}
          </p>
          <NavItem
            link={adminNavLink}
            label={dict.dashboardShell.links.admin}
            isActive={isLinkActive(adminNavLink.href)}
            onNavigate={onNavigate}
          />
        </div>
      )}
    </nav>
  );
}
