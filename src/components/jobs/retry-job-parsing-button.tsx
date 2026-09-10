"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";
import { retryJobOfferParsingAction } from "@/lib/actions/job-offer";
import { Button } from "@/components/ui/button";

export function RetryJobParsingButton({ jobOfferId }: { jobOfferId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await retryJobOfferParsingAction(jobOfferId);
      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Analyse réussie, vérifiez les informations ci-dessous.");
      router.refresh();
    });
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={isPending}>
      <RotateCw className="size-4" aria-hidden="true" />
      {isPending ? "Nouvelle analyse..." : "Réessayer l'analyse"}
    </Button>
  );
}
