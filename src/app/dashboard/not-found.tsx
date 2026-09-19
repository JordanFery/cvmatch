import { FileSearch } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { getLocale } from "@/lib/i18n/get-locale";

// Dashboard shell copy (sidebar labels) is bilingual, but feature pages are
// still French-only (see UX audit ID02) — this mirrors the dashboard shell's
// language switching without pretending the rest of the page is translated.
const COPY = {
  fr: { title: "Page introuvable", description: "Cette ressource n'existe pas ou a été supprimée.", cta: "Retour au tableau de bord" },
  en: { title: "Page not found", description: "This resource doesn't exist or has been removed.", cta: "Back to dashboard" },
} as const;

export default async function DashboardNotFound() {
  const locale = await getLocale();
  const copy = COPY[locale];

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FileSearch className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>
      <ButtonLink href="/dashboard" className="mt-2">
        {copy.cta}
      </ButtonLink>
    </div>
  );
}
