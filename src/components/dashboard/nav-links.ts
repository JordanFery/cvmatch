import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, FileText, Search, Send, Award, CreditCard, User, ShieldCheck } from "lucide-react";

export type NavLinkKey = "dashboard" | "cv" | "jobs" | "applications" | "badges" | "billing" | "profile" | "admin";

export type NavLink = {
  href: string;
  key: NavLinkKey;
  icon: LucideIcon;
};

export type NavGroupKey = "workspace" | "tools" | "account";

export type NavGroup = {
  key: NavGroupKey;
  links: NavLink[];
};

const workspaceGroup: NavGroup = {
  key: "workspace",
  links: [
    { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
    { href: "/dashboard/cv", key: "cv", icon: FileText },
    { href: "/dashboard/jobs", key: "jobs", icon: Search },
    { href: "/dashboard/applications", key: "applications", icon: Send },
  ],
};

const toolsGroup: NavGroup = {
  key: "tools",
  links: [{ href: "/dashboard/badges", key: "badges", icon: Award }],
};

const accountGroup: NavGroup = {
  key: "account",
  links: [
    { href: "/dashboard/billing", key: "billing", icon: CreditCard },
    { href: "/dashboard/profile", key: "profile", icon: User },
  ],
};

/** Shown only to admins — appended conditionally by SidebarNav, never mutated into the base groups above. */
export const adminNavLink: NavLink = { href: "/dashboard/admin", key: "admin", icon: ShieldCheck };

export const dashboardNavGroups: NavGroup[] = [workspaceGroup, toolsGroup, accountGroup];
