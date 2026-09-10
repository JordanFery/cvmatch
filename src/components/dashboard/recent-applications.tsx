import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { APPLICATION_STATUS_LABELS, type ApplicationStatusValue } from "@/lib/validations/application";

type Row = {
  id: string;
  title: string;
  company: string | null;
  applicationStatus: string;
};

export function RecentApplications({ rows }: { rows: Row[] }) {
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.id} className="flex items-center justify-between gap-3">
          <Link href={`/dashboard/jobs/${row.id}`} className="min-w-0 hover:underline">
            <p className="truncate text-sm font-medium">{row.title}</p>
            {row.company && <p className="truncate text-xs text-muted-foreground">{row.company}</p>}
          </Link>
          <Badge variant={row.applicationStatus === "REJECTED" ? "outline" : "secondary"} className="shrink-0">
            {APPLICATION_STATUS_LABELS[row.applicationStatus as ApplicationStatusValue]}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
