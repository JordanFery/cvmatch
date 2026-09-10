"use client";

import { ChevronsUpDown, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";
}

export function UserMenu({
  firstName,
  lastName,
  email,
  dict,
}: {
  firstName: string;
  lastName: string;
  email: string;
  dict: Dictionary;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-md border-t border-sidebar-border p-2 pt-3 text-left transition-colors hover:bg-sidebar-accent/60"
          />
        }
      >
        <Avatar className="size-8">
          <AvatarFallback>{initials(firstName, lastName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {firstName} {lastName}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/60">{email}</p>
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-sidebar-foreground/50" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{dict.dashboardShell.userMenu.account}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
          <UserIcon aria-hidden="true" />
          {dict.dashboardShell.userMenu.profile}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction} className="contents">
          <DropdownMenuItem
            variant="destructive"
            nativeButton
            render={<button type="submit" className="w-full" />}
          >
            <LogOut aria-hidden="true" />
            {dict.dashboardShell.userMenu.logout}
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
