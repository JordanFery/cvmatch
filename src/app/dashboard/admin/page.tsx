import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getAdminUsers, requireAdmin } from "@/lib/data/admin";
import { UsersTable } from "@/components/admin/users-table";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = { title: "Administration" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const admin = await requireAdmin();
  const users = await getAdminUsers(q);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description={`${users.length} utilisateur${users.length > 1 ? "s" : ""}. Gérez les forfaits et les crédits.`}
      />

      <form method="get" className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input type="search" name="q" placeholder="Rechercher par nom ou e-mail..." defaultValue={q ?? ""} className="pl-9" />
      </form>

      <UsersTable users={users} currentAdminId={admin.id} />
    </div>
  );
}
