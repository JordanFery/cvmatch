"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CvFormValues } from "@/lib/cv/form-values";
import { emptyEducation } from "@/lib/cv/form-values";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function EducationSection() {
  const { register, control } = useFormContext<CvFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "education" });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4">
          {index > 0 && <Separator />}
          <div className="flex items-start justify-between gap-4">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`education.${index}.school`}>Établissement</Label>
                <Input id={`education.${index}.school`} {...register(`education.${index}.school`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`education.${index}.degree`}>Diplôme</Label>
                <Input id={`education.${index}.degree`} {...register(`education.${index}.degree`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`education.${index}.field`}>Domaine</Label>
                <Input id={`education.${index}.field`} {...register(`education.${index}.field`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`education.${index}.location`}>Localisation</Label>
                <Input id={`education.${index}.location`} {...register(`education.${index}.location`)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor={`education.${index}.startDate`}>Début</Label>
                  <Input id={`education.${index}.startDate`} {...register(`education.${index}.startDate`)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`education.${index}.endDate`}>Fin</Label>
                  <Input id={`education.${index}.endDate`} {...register(`education.${index}.endDate`)} />
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label="Supprimer cette formation"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`education.${index}.description`}>Description</Label>
            <Textarea id={`education.${index}.description`} rows={2} {...register(`education.${index}.description`)} />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyEducation())}>
        <Plus className="size-4" aria-hidden="true" />
        Ajouter une formation
      </Button>
    </div>
  );
}
