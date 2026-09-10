import { Gift, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { BadgeView } from "@/lib/data/badges";

export function BadgeCard({ view }: { view: BadgeView }) {
  const { badge, earned, earnedAt, progress } = view;
  const percent = Math.min(100, Math.round((progress.current / progress.target) * 100));
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4 transition-colors",
        earned ? "border-primary/30 bg-primary/5" : "border-border",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {earned ? <badge.icon className="size-5" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{badge.name}</p>
          <p className="text-sm text-muted-foreground">{badge.description}</p>
        </div>
      </div>

      {earned ? (
        <p className="text-xs text-muted-foreground">
          Débloqué le {earnedAt ? dateFormatter.format(earnedAt) : ""}
        </p>
      ) : (
        <div className="space-y-1.5">
          <Progress value={percent} />
          <p className="text-xs text-muted-foreground">
            {progress.current} / {progress.target}
          </p>
        </div>
      )}

      {badge.reward && (
        <p
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            earned ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Gift className="size-3.5" aria-hidden="true" />
          {badge.reward.description}
        </p>
      )}
    </div>
  );
}
