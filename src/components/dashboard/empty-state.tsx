import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-12 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1 px-4">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ButtonLink href={actionHref} size="sm" variant="outline" className="mt-2">
        {actionLabel}
      </ButtonLink>
    </div>
  );
}
