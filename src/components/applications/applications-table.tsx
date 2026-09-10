import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { StatusSelect } from "@/components/applications/status-select";
import { AppliedAtInput } from "@/components/applications/applied-at-input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { ApplicationStatusValue } from "@/lib/validations/application";

type Row = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  salaryRange: string | null;
  sourceUrl: string | null;
  applicationStatus: string;
  appliedAt: Date | null;
};

export function ApplicationsTable({ rows }: { rows: Row[] }) {
  return (
    <Table className="min-w-195">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Poste</TableHead>
          <TableHead>Entreprise</TableHead>
          <TableHead>Ville</TableHead>
          <TableHead>Rémunération</TableHead>
          <TableHead>Annonce</TableHead>
          <TableHead>Date d&apos;envoi</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="max-w-56 truncate whitespace-normal">
              <Link href={`/dashboard/jobs/${row.id}`} className="font-medium hover:underline">
                {row.title}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">{row.company ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{row.location ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{row.salaryRange ?? "—"}</TableCell>
            <TableCell>
              {row.sourceUrl ? (
                <a
                  href={row.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Voir l'annonce d'origine"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              <AppliedAtInput jobOfferId={row.id} appliedAt={row.appliedAt} />
            </TableCell>
            <TableCell>
              <StatusSelect jobOfferId={row.id} status={row.applicationStatus as ApplicationStatusValue} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
