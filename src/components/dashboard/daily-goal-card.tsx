import Link from "next/link";
import { CheckCircle2, Clock3, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/**
 * Compares today's sent count against a prorated expectation based on how
 * much of the day has elapsed — e.g. 0/3 at 9am isn't "behind" yet, but 0/3
 * at 6pm is. Once the full goal is reached, always "ahead", regardless of
 * the hour.
 */
function computeStatus(goal: number, sentToday: number) {
  if (sentToday >= goal) return "ahead" as const;
  const hoursElapsed = new Date().getHours() + new Date().getMinutes() / 60;
  const expectedByNow = goal * (hoursElapsed / 24);
  return sentToday >= expectedByNow ? ("on_track" as const) : ("behind" as const);
}

export function DailyGoalCard({ goal, sentToday }: { goal: number; sentToday: number }) {
  const remaining = Math.max(0, goal - sentToday);
  const percent = Math.min(100, Math.round((sentToday / goal) * 100));
  const status = computeStatus(goal, sentToday);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="size-4" aria-hidden="true" />
          Objectif du jour
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium",
            status === "behind" ? "text-destructive" : "text-primary",
          )}
        >
          {status === "ahead" && <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />}
          {status === "behind" && <Clock3 className="size-4 shrink-0" aria-hidden="true" />}
          {status === "ahead" && `En avance — ${sentToday}/${goal} candidatures envoyées aujourd'hui. Bravo !`}
          {status === "on_track" && `Dans les temps — ${sentToday}/${goal} candidatures envoyées aujourd'hui.`}
          {status === "behind" &&
            `En retard — ${sentToday}/${goal} candidatures envoyées aujourd'hui. Encore ${remaining} à envoyer.`}
        </p>
        <Progress value={percent} />
        {status !== "ahead" && (
          <Link href="/dashboard/jobs" className="text-sm text-primary hover:underline">
            Trouver une offre à envoyer →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
