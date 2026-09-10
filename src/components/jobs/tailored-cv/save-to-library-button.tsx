"use client";

import { useTransition } from "react";
import { Library } from "lucide-react";
import { toast } from "sonner";
import { saveTailoredCvToLibraryAction } from "@/lib/actions/tailored-cv";
import { Button } from "@/components/ui/button";

export function SaveToLibraryButton({ tailoredCvId }: { tailoredCvId: string }) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await saveTailoredCvToLibraryAction(tailoredCvId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("CV enregistré dans votre bibliothèque.");
    });
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={isPending}>
      <Library className="size-4" aria-hidden="true" />
      {isPending ? "Enregistrement..." : "Enregistrer dans ma bibliothèque"}
    </Button>
  );
}
