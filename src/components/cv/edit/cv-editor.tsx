"use client";

import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ParsedCv } from "@/lib/validations/cv";
import { toFormValues, toParsedCv, type CvFormValues } from "@/lib/cv/form-values";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PersonalInfoSection } from "@/components/cv/edit/personal-info-section";
import { SummarySection } from "@/components/cv/edit/summary-section";
import { ExperienceSection } from "@/components/cv/edit/experience-section";
import { EducationSection } from "@/components/cv/edit/education-section";
import { SkillsSection } from "@/components/cv/edit/skills-section";
import { CertificationsSection } from "@/components/cv/edit/certifications-section";
import { ProjectsSection } from "@/components/cv/edit/projects-section";
import { LanguagesSection } from "@/components/cv/edit/languages-section";
import { CustomSectionsSection } from "@/components/cv/edit/custom-sections-section";

type SaveResult = { error: string } | { success: true } | void;

export function CvEditor({
  cvId,
  initialData,
  onSave,
  submitLabel,
  submittingLabel,
}: {
  cvId: string;
  initialData: ParsedCv;
  onSave: (cvId: string, data: ParsedCv) => Promise<SaveResult>;
  submitLabel: string;
  submittingLabel: string;
}) {
  const methods = useForm<CvFormValues>({ defaultValues: toFormValues(initialData) });
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: CvFormValues) => {
    startTransition(async () => {
      const result = await onSave(cvId, toParsedCv(values));
      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }
      if (result && "success" in result) {
        toast.success("CV enregistré.");
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <Accordion
          multiple
          defaultValue={["personal", "summary", "experience"]}
          className="space-y-1 rounded-lg border border-border px-4"
        >
          <AccordionItem value="personal">
            <AccordionTrigger>Informations personnelles</AccordionTrigger>
            <AccordionContent>
              <PersonalInfoSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="summary">
            <AccordionTrigger>Résumé</AccordionTrigger>
            <AccordionContent>
              <SummarySection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="experience">
            <AccordionTrigger>Expériences</AccordionTrigger>
            <AccordionContent>
              <ExperienceSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="education">
            <AccordionTrigger>Formation</AccordionTrigger>
            <AccordionContent>
              <EducationSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="skills">
            <AccordionTrigger>Compétences</AccordionTrigger>
            <AccordionContent>
              <SkillsSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="projects">
            <AccordionTrigger>Projets</AccordionTrigger>
            <AccordionContent>
              <ProjectsSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="certifications">
            <AccordionTrigger>Certifications</AccordionTrigger>
            <AccordionContent>
              <CertificationsSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="languages">
            <AccordionTrigger>Langues</AccordionTrigger>
            <AccordionContent>
              <LanguagesSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="custom">
            <AccordionTrigger>Sections personnalisées</AccordionTrigger>
            <AccordionContent>
              <CustomSectionsSection />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
