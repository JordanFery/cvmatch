import { FileSearch } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

// `not-found.tsx` renders with no props (no access to the `[locale]` route
// param), so this can't pick French or English based on the URL — shown
// bilingual instead. Linking to "/" lets the proxy redirect to whichever
// locale the visitor's cookie/Accept-Language already points to.
export default function LocaleNotFound() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FileSearch className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Page introuvable</h1>
        <p className="text-sm text-muted-foreground">Cette page n&apos;existe pas ou a été déplacée.</p>
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-medium">Page not found</h2>
        <p className="text-sm text-muted-foreground">This page doesn&apos;t exist or has been moved.</p>
      </div>
      <ButtonLink href="/" className="mt-2">
        Retour à l&apos;accueil / Back to home
      </ButtonLink>
    </div>
  );
}
