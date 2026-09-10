import { Circle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * A static, clearly-illustrative mockup of the ATS analysis screen — not a
 * screenshot, not real user data. Reuses the same Badge/Progress primitives
 * as the real product so the landing page and the app visibly share one
 * design language.
 */
export function LandingProductPreview({ dict }: { dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance">{dict.productPreview.title}</h2>
        <p className="mt-3 text-muted-foreground">{dict.productPreview.description}</p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
          <Circle className="size-2.5 fill-muted-foreground/30 text-muted-foreground/30" aria-hidden="true" />
          <Circle className="size-2.5 fill-muted-foreground/30 text-muted-foreground/30" aria-hidden="true" />
          <Circle className="size-2.5 fill-muted-foreground/30 text-muted-foreground/30" aria-hidden="true" />
          <span className="ml-2 text-xs text-muted-foreground">{dict.productPreview.exampleLabel}</span>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold tabular-nums text-success">87%</span>
            <Progress value={87} className="flex-1" indicatorClassName="bg-success" />
          </div>
          <p className="text-sm text-muted-foreground">{dict.productPreview.summary}</p>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">{dict.productPreview.matched}</p>
            <div className="flex flex-wrap gap-1.5">
              {["React", "TypeScript", "Tailwind CSS", "Tests unitaires"].map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">{dict.productPreview.missing}</p>
            <div className="flex flex-wrap gap-1.5">
              {["GraphQL", "CI/CD"].map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {dict.productPreview.generated}
          </div>
        </div>
      </div>
    </section>
  );
}
