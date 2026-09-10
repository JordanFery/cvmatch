"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateApplicationStatusAction } from "@/lib/actions/application";
import { APPLICATION_STATUS_LABELS, type ApplicationStatusValue } from "@/lib/validations/application";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STATUS_ORDER: ApplicationStatusValue[] = ["NOT_SENT", "SENT", "INTERVIEW", "REJECTED"];

const STATUS_TRIGGER_CLASSES: Record<ApplicationStatusValue, string> = {
  NOT_SENT: "",
  SENT: "border-warning/40 bg-warning/10 text-[color-mix(in_oklch,var(--warning),black_25%)] dark:text-warning",
  INTERVIEW: "border-success/40 bg-success/10 text-success",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function StatusSelect({ jobOfferId, status }: { jobOfferId: string; status: ApplicationStatusValue }) {
  const [value, setValue] = useState(status);
  const [, startTransition] = useTransition();

  const onValueChange = (next: ApplicationStatusValue | null) => {
    if (!next) return;
    const previous = value;
    setValue(next);
    startTransition(async () => {
      const result = await updateApplicationStatusAction(jobOfferId, next);
      if ("error" in result) {
        setValue(previous);
        toast.error(result.error);
      }
    });
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size="sm" aria-label="Statut de la candidature" className={cn(STATUS_TRIGGER_CLASSES[value])}>
        <SelectValue>
          {(current: ApplicationStatusValue | null) => (current ? APPLICATION_STATUS_LABELS[current] : "")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STATUS_ORDER.map((option) => (
          <SelectItem key={option} value={option}>
            {APPLICATION_STATUS_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
