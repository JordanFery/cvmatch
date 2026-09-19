"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

// error.tsx must be a Client Component, so it can't read the locale cookie
// server-side — falls back to French, consistent with the rest of the
// dashboard's feature pages today (see UX audit ID02).
export default function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Une erreur est survenue</h1>
        <p className="text-sm text-muted-foreground">Merci de réessayer dans un instant.</p>
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={retry}>
          Réessayer
        </Button>
        <ButtonLink href="/dashboard" variant="outline">
          Retour au tableau de bord
        </ButtonLink>
      </div>
    </div>
  );
}
