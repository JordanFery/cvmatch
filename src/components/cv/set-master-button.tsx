"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { setMasterCvAction } from "@/lib/actions/cv";
import { Button } from "@/components/ui/button";

export function SetMasterButton({ cvId }: { cvId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await setMasterCvAction(cvId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("CV maître mis à jour.");
      router.refresh();
    });
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={isPending}>
      <Star className="size-4" aria-hidden="true" />
      {isPending ? "..." : "Définir comme maître"}
    </Button>
  );
}
