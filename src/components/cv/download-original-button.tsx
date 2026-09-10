"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { getCvDownloadUrlAction } from "@/lib/actions/cv";
import { Button } from "@/components/ui/button";

export function DownloadOriginalButton({ cvId }: { cvId: string }) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await getCvDownloadUrlAction(cvId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      window.open(result.url, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={isPending}>
      <Download className="size-4" aria-hidden="true" />
      {isPending ? "Génération du lien..." : "Télécharger l'original"}
    </Button>
  );
}
