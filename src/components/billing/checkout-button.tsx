"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { createCheckoutSessionAction } from "@/lib/actions/billing";
import type { PlanIdValue } from "@/lib/billing/plans";
import { Button } from "@/components/ui/button";

export function CheckoutButton({
  planId,
  label,
  variant,
}: {
  planId: PlanIdValue;
  label: string;
  variant?: "default" | "outline";
}) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await createCheckoutSessionAction(planId);
      if (result && "error" in result) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button type="button" variant={variant} className="w-full" onClick={onClick} disabled={isPending}>
      {isPending ? "Redirection..." : label}
    </Button>
  );
}
