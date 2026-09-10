"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { JobOfferData } from "@/lib/validations/job-offer";
import { toFormValues, toJobOfferData, type JobOfferFormValues } from "@/lib/jobs/form-values";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/tag-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SaveResult = { error: string } | { success: true } | void;

const scalarFields: { name: keyof JobOfferFormValues; label: string }[] = [
  { name: "title", label: "Titre du poste" },
  { name: "company", label: "Entreprise" },
  { name: "location", label: "Localisation" },
  { name: "employmentType", label: "Type de contrat" },
  { name: "remotePolicy", label: "Télétravail" },
  { name: "salaryRange", label: "Rémunération" },
  { name: "seniorityLevel", label: "Niveau d'expérience" },
];

const tagFields: { name: keyof JobOfferFormValues; label: string; placeholder: string }[] = [
  { name: "keySkills", label: "Compétences clés", placeholder: "Ajouter une compétence" },
  { name: "responsibilities", label: "Responsabilités", placeholder: "Ajouter une responsabilité" },
  { name: "requirements", label: "Exigences", placeholder: "Ajouter une exigence" },
  { name: "niceToHave", label: "Atouts appréciés", placeholder: "Ajouter un atout" },
];

export function JobOfferEditor({
  jobOfferId,
  initialData,
  onSave,
  submitLabel,
  submittingLabel,
}: {
  jobOfferId: string;
  initialData: JobOfferData;
  onSave: (id: string, data: JobOfferData) => Promise<SaveResult>;
  submitLabel: string;
  submittingLabel: string;
}) {
  const { register, control, handleSubmit } = useForm<JobOfferFormValues>({
    defaultValues: toFormValues(initialData),
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: JobOfferFormValues) => {
    startTransition(async () => {
      const result = await onSave(jobOfferId, toJobOfferData(values));
      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }
      if (result && "success" in result) {
        toast.success("Offre enregistrée.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {scalarFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input id={field.name} {...register(field.name)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résumé</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea rows={4} {...register("summary")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tagFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              <Controller
                control={control}
                name={field.name}
                render={({ field: f }) => (
                  <TagInput
                    value={f.value as string[]}
                    onChange={f.onChange}
                    placeholder={field.placeholder}
                  />
                )}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
