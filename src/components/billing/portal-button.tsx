"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { createPortalSessionAction } from "@/lib/actions/billing";
import { Button } from "@/components/ui/button";

export function PortalButton() {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await createPortalSessionAction();
      if (result && "error" in result) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={isPending}>
      {isPending ? "Redirection..." : "Gérer ma facturation"}
    </Button>
  );
}
