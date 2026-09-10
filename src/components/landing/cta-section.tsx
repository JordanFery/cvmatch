import { ButtonLink } from "@/components/ui/button-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function LandingCta({ dict }: { dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{dict.cta.title}</h2>
      <div className="mt-8">
        <ButtonLink href="/register" size="lg">
          {dict.cta.button}
        </ButtonLink>
      </div>
    </section>
  );
}
