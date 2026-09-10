"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserPlanAction } from "@/lib/actions/admin";
import { PLANS, type PlanIdValue } from "@/lib/billing/plans";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PLAN_ORDER: PlanIdValue[] = ["FREE", "ESSENTIAL", "PRO", "VIP"];

export function PlanSelect({ userId, plan }: { userId: string; plan: PlanIdValue }) {
  const router = useRouter();
  const [value, setValue] = useState(plan);
  const [, startTransition] = useTransition();

  const onValueChange = (next: PlanIdValue | null) => {
    if (!next || next === value) return;
    const previous = value;
    setValue(next);
    startTransition(async () => {
      const result = await updateUserPlanAction(userId, next);
      if ("error" in result) {
        setValue(previous);
        toast.error(result.error);
        return;
      }
      toast.success(`Forfait mis à jour : ${PLANS[next].name}.`);
      router.refresh();
    });
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size="sm" aria-label="Forfait">
        <SelectValue>{(current: PlanIdValue | null) => (current ? PLANS[current].name : "")}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {PLAN_ORDER.map((option) => (
          <SelectItem key={option} value={option}>
            {PLANS[option].name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
