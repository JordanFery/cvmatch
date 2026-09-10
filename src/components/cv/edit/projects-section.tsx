"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CvFormValues } from "@/lib/cv/form-values";
import { emptyProject } from "@/lib/cv/form-values";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "@/components/ui/tag-input";

export function ProjectsSection() {
  const { register, control } = useFormContext<CvFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "projects" });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4">
          {index > 0 && <Separator />}
          <div className="flex items-start justify-between gap-4">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`projects.${index}.name`}>Nom du projet</Label>
                <Input id={`projects.${index}.name`} {...register(`projects.${index}.name`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`projects.${index}.url`}>Lien</Label>
                <Input id={`projects.${index}.url`} {...register(`projects.${index}.url`)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`projects.${index}.githubUrl`}>Lien GitHub</Label>
                <Input id={`projects.${index}.githubUrl`} {...register(`projects.${index}.githubUrl`)} />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label="Supprimer ce projet"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`projects.${index}.description`}>Description</Label>
            <Textarea id={`projects.${index}.description`} rows={2} {...register(`projects.${index}.description`)} />
          </div>

          <div className="space-y-2">
            <Label>Technologies</Label>
            <Controller
              control={control}
              name={`projects.${index}.technologies`}
              render={({ field: f }) => <TagInput value={f.value} onChange={f.onChange} placeholder="Ajouter une technologie" />}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyProject())}>
        <Plus className="size-4" aria-hidden="true" />
        Ajouter un projet
      </Button>
    </div>
  );
}
