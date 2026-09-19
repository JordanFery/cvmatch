"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

// error.tsx must be a Client Component and receives no locale info (same
// constraint as not-found.tsx in this segment) — shown bilingual.
export default function LocaleError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Une erreur est survenue</h1>
        <p className="text-sm text-muted-foreground">Merci de réessayer dans un instant.</p>
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-medium">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">Please try again in a moment.</p>
      </div>
      <div className="mt-2 flex gap-2">
        <Button type="button" onClick={retry}>
          Réessayer / Try again
        </Button>
        <ButtonLink href="/" variant="outline">
          Accueil / Home
        </ButtonLink>
      </div>
    </div>
  );
}
