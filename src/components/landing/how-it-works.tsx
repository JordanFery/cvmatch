import { HowItWorksTrail } from "@/components/landing/how-it-works-trail";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Steps as a connected trail: a numbered circle per step, joined by a
 * connector line that fills in as the animation progresses. Reveals once
 * when scrolled into view, over 3.2s total. See HowItWorksTrail for the
 * animation itself.
 */
export function LandingHowItWorks({ dict }: { dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight">{dict.howItWorks.title}</h2>
        <p className="mt-3 text-muted-foreground">{dict.howItWorks.description}</p>
      </div>
      <HowItWorksTrail steps={dict.howItWorks.steps} />
    </section>
  );
}
