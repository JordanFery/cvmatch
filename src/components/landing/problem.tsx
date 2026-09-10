import { FileWarning, Clock, ListX } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const icons = [FileWarning, Clock, ListX];

export function LandingProblem({ dict }: { dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance">{dict.problem.title}</h2>
      </div>
      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        {dict.problem.points.map((point, index) => {
          const Icon = icons[index];
          return (
            <div key={point.title} className="flex flex-col items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-medium">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
