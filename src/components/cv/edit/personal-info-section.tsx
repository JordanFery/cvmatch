"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CvFormValues } from "@/lib/cv/form-values";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const fields: { name: keyof CvFormValues["personalInfo"]; label: string; type?: string }[] = [
  { name: "firstName", label: "Prénom" },
  { name: "lastName", label: "Nom" },
  { name: "title", label: "Titre professionnel" },
  { name: "email", label: "E-mail", type: "email" },
  { name: "phone", label: "Téléphone", type: "tel" },
  { name: "location", label: "Localisation" },
  { name: "linkedinUrl", label: "LinkedIn" },
  { name: "portfolioUrl", label: "Portfolio" },
  { name: "githubUrl", label: "GitHub" },
];

export function PersonalInfoSection() {
  const { register, control } = useFormContext<CvFormValues>();
  const { fields: linkFields, append, remove } = useFieldArray({
    control,
    name: "personalInfo.otherLinks",
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={`personalInfo.${field.name}`}>{field.label}</Label>
            <Input
              id={`personalInfo.${field.name}`}
              type={field.type ?? "text"}
              {...register(`personalInfo.${field.name}`)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Label>Autres liens</Label>
        {linkFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              placeholder="Label (ex. Behance)"
              className="w-40"
              {...register(`personalInfo.otherLinks.${index}.label`)}
            />
            <Input placeholder="https://..." {...register(`personalInfo.otherLinks.${index}.url`)} />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Supprimer ce lien">
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ label: "", url: "" })}>
          <Plus className="size-4" aria-hidden="true" />
          Ajouter un lien
        </Button>
      </div>
    </div>
  );
}
