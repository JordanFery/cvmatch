"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CvFormValues } from "@/lib/cv/form-values";
import { emptyCertification } from "@/lib/cv/form-values";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function CertificationsSection() {
  const { register, control } = useFormContext<CvFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "certifications" });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4">
          {index > 0 && <Separator />}
          <div className="flex items-start justify-between gap-4">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.name`}>Nom</Label>
                <Input id={`certifications.${index}.name`} {...register(`certifications.${index}.name`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.organization`}>Organisme</Label>
                <Input id={`certifications.${index}.organization`} {...register(`certifications.${index}.organization`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.date`}>Date</Label>
                <Input id={`certifications.${index}.date`} {...register(`certifications.${index}.date`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`certifications.${index}.credentialUrl`}>Lien du certificat</Label>
                <Input id={`certifications.${index}.credentialUrl`} {...register(`certifications.${index}.credentialUrl`)} />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label="Supprimer cette certification"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyCertification())}>
        <Plus className="size-4" aria-hidden="true" />
        Ajouter une certification
      </Button>
    </div>
  );
}
