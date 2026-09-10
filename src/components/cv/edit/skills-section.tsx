"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { CvFormValues } from "@/lib/cv/form-values";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";

const categories: { name: keyof CvFormValues["skills"]; label: string }[] = [
  { name: "technical", label: "Compétences techniques" },
  { name: "soft", label: "Savoir-être" },
  { name: "tools", label: "Outils" },
  { name: "frameworks", label: "Frameworks" },
  { name: "databases", label: "Bases de données" },
  { name: "other", label: "Autres" },
];

export function SkillsSection() {
  const { control } = useFormContext<CvFormValues>();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {categories.map((category) => (
        <div key={category.name} className="space-y-2">
          <Label>{category.label}</Label>
          <Controller
            control={control}
            name={`skills.${category.name}`}
            render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="Ajouter..." />}
          />
        </div>
      ))}
    </div>
  );
}
