"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateAppliedAtAction } from "@/lib/actions/application";
import { Input } from "@/components/ui/input";

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function AppliedAtInput({ jobOfferId, appliedAt }: { jobOfferId: string; appliedAt: Date | null }) {
  const [value, setValue] = useState(toDateInputValue(appliedAt));
  const [, startTransition] = useTransition();

  const onChange = (next: string) => {
    const previous = value;
    setValue(next);
    startTransition(async () => {
      const result = await updateAppliedAtAction(jobOfferId, next || null);
      if ("error" in result) {
        setValue(previous);
        toast.error(result.error);
      }
    });
  };

  return (
    <Input
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Date d'envoi du CV"
      className="h-8 w-[9.5rem] text-sm"
    />
  );
}
