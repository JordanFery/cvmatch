"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CvFormValues } from "@/lib/cv/form-values";
import { emptyLanguage } from "@/lib/cv/form-values";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LanguagesSection() {
  const { register, control } = useFormContext<CvFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "languages" });

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Input placeholder="Langue" {...register(`languages.${index}.language`)} />
          <Input placeholder="Niveau (ex. courant)" {...register(`languages.${index}.proficiency`)} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Supprimer cette langue">
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyLanguage())}>
        <Plus className="size-4" aria-hidden="true" />
        Ajouter une langue
      </Button>
    </div>
  );
}
