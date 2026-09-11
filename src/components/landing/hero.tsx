import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { HeroShowcase } from "@/components/landing/hero-showcase";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function LandingHero({ dict, isAuthenticated = false }: { dict: Dictionary; isAuthenticated?: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-144 w-5xl -translate-x-1/2 animate-pulse rounded-full bg-primary/10 blur-3xl animation-duration-[5s]"
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <div className="animate-in fade-in zoom-in-95 flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground duration-700">
          <Sparkles className="size-3.5" aria-hidden="true" />
          {dict.hero.eyebrow}
        </div>

        <h1 className="animate-in fade-in slide-in-from-bottom-4 mt-6 text-4xl font-semibold tracking-tight text-balance duration-700 sm:text-6xl delay-150 fill-mode-[both]">
          {dict.hero.titleLine1}
          <br className="hidden sm:block" /> {dict.hero.titleLine2}
        </h1>

        <p className="animate-in fade-in slide-in-from-bottom-4 mt-6 max-w-2xl text-lg text-muted-foreground text-balance duration-700 delay-300 fill-mode-[both]">
          {dict.hero.description}
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-4 mt-10 flex flex-col gap-3 duration-700 sm:flex-row delay-[450ms] fill-mode-[both]">
          {isAuthenticated ? (
            <ButtonLink href="/dashboard" size="lg">
              {dict.hero.ctaAuthenticated}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/register" size="lg">
                {dict.hero.ctaPrimary}
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/login" size="lg" variant="outline">
                {dict.hero.ctaSecondary}
              </ButtonLink>
            </>
          )}
        </div>

        <HeroShowcase dict={dict} />
      </div>
    </section>
  );
}
