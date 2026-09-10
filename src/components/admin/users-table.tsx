import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PlanSelect } from "@/components/admin/plan-select";
import { GrantCreditsDialog } from "@/components/admin/grant-credits-dialog";
import { ToggleAdminButton } from "@/components/admin/toggle-admin-button";
import type { PlanIdValue } from "@/lib/billing/plans";

type AdminUserRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  createdAt: Date;
  subscription: { plan: PlanIdValue; creditsRemaining: number; creditsUsedLifetime: number } | null;
  _count: { cvs: number; jobOffers: number; badges: number };
};

export function UsersTable({ users, currentAdminId }: { users: AdminUserRow[]; currentAdminId: string }) {
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

  return (
    <Table className="min-w-240">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Utilisateur</TableHead>
          <TableHead>Forfait</TableHead>
          <TableHead>Crédits</TableHead>
          <TableHead>Utilisation</TableHead>
          <TableHead>Inscrit le</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="align-top">
            <TableCell className="whitespace-normal">
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                {user.isAdmin && <Badge variant="secondary">Admin</Badge>}
              </div>
              <p className="text-muted-foreground">{user.email}</p>
            </TableCell>
            <TableCell>
              <PlanSelect userId={user.id} plan={user.subscription?.plan ?? "FREE"} />
            </TableCell>
            <TableCell className="text-muted-foreground">{user.subscription?.creditsRemaining ?? 0}</TableCell>
            <TableCell className="whitespace-normal text-muted-foreground">
              <p>{user.subscription?.creditsUsedLifetime ?? 0} crédits utilisés</p>
              <p>
                {user._count.cvs} CV · {user._count.jobOffers} offres · {user._count.badges} badges
              </p>
            </TableCell>
            <TableCell className="text-muted-foreground">{dateFormatter.format(user.createdAt)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                <GrantCreditsDialog userId={user.id} email={user.email} />
                {user.id !== currentAdminId && <ToggleAdminButton userId={user.id} isAdmin={user.isAdmin} />}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
