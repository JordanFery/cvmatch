"use client";

import { useFormContext } from "react-hook-form";
import type { CvFormValues } from "@/lib/cv/form-values";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function SummarySection() {
  const { register } = useFormContext<CvFormValues>();

  return (
    <div className="space-y-2">
      <Label htmlFor="summary">Résumé professionnel</Label>
      <Textarea id="summary" rows={4} {...register("summary")} />
    </div>
  );
}
