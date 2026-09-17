"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CvFormValues } from "@/lib/cv/form-values";
import { emptyExperience } from "@/lib/cv/form-values";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "@/components/ui/tag-input";

export function ExperienceSection() {
  const { register, control } = useFormContext<CvFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "experiences" });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4">
          {index > 0 && <Separator />}
          <div className="flex items-start justify-between gap-4">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`experiences.${index}.jobTitle`}>Poste</Label>
                <Input id={`experiences.${index}.jobTitle`} {...register(`experiences.${index}.jobTitle`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`experiences.${index}.company`}>Entreprise</Label>
                <Input id={`experiences.${index}.company`} {...register(`experiences.${index}.company`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`experiences.${index}.location`}>Localisation</Label>
                <Input id={`experiences.${index}.location`} {...register(`experiences.${index}.location`)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.startDate`}>Début</Label>
                  <Input id={`experiences.${index}.startDate`} {...register(`experiences.${index}.startDate`)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.endDate`}>Fin</Label>
                  <Input id={`experiences.${index}.endDate`} {...register(`experiences.${index}.endDate`)} />
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label="Supprimer cette expérience"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 rounded border-input" {...register(`experiences.${index}.current`)} />
            Poste actuel
          </label>

          <div className="space-y-2">
            <Label htmlFor={`experiences.${index}.description`}>Description</Label>
            <Textarea id={`experiences.${index}.description`} rows={3} {...register(`experiences.${index}.description`)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <Label>Réalisations</Label>
              <Controller
                control={control}
                name={`experiences.${index}.achievements`}
                render={({ field: f }) => <TagInput value={f.value} onChange={f.onChange} placeholder="Ajouter une réalisation" />}
              />
            </div>
            <div className="min-w-0 space-y-2">
              <Label>Technologies</Label>
              <Controller
                control={control}
                name={`experiences.${index}.technologies`}
                render={({ field: f }) => <TagInput value={f.value} onChange={f.onChange} placeholder="Ajouter une technologie" />}
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyExperience())}>
        <Plus className="size-4" aria-hidden="true" />
        Ajouter une expérience
      </Button>
    </div>
  );
}
