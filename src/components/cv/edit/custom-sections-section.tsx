"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CvFormValues } from "@/lib/cv/form-values";
import { emptyCustomSection } from "@/lib/cv/form-values";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/** Free-form fallback for content that doesn't fit the standard sections — never dropped silently by the parser. */
export function CustomSectionsSection() {
  const { register, control } = useFormContext<CvFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "customSections" });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-3">
          {index > 0 && <Separator />}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`customSections.${index}.title`}>Titre de la section</Label>
              <Input id={`customSections.${index}.title`} {...register(`customSections.${index}.title`)} />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label="Supprimer cette section"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`customSections.${index}.content`}>Contenu</Label>
            <Textarea id={`customSections.${index}.content`} rows={3} {...register(`customSections.${index}.content`)} />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyCustomSection())}>
        <Plus className="size-4" aria-hidden="true" />
        Ajouter une section personnalisée
      </Button>
    </div>
  );
}
