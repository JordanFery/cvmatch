import { ScanSearch, FileEdit, Library, ListChecks, Link2, Target, Award, ShieldAlert } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const icons = [ScanSearch, FileEdit, Library, ListChecks, Link2, Target, Award, ShieldAlert];

export function LandingFeatures({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-border/60 bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{dict.features.title}</h2>
          <p className="mt-3 text-muted-foreground">{dict.features.description}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.features.items.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div key={feature.title} className="rounded-xl border border-border bg-background p-5">
                <Icon className="size-5 text-foreground" aria-hidden="true" />
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
