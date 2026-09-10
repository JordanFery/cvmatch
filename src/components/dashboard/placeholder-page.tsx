import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PlaceholderPage({
  icon: Icon,
  title,
  description,
  note,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  note: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Icon className="size-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <Badge variant="secondary">Bientôt disponible</Badge>
          <p className="max-w-md text-sm text-muted-foreground">{note}</p>
        </CardContent>
      </Card>
    </div>
  );
}
