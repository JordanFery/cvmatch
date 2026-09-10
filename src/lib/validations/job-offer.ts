import { z } from "zod";
import { nullableString } from "@/lib/validations/shared";

export const MAX_JOB_TEXT_LENGTH = 20000;
export const MIN_JOB_TEXT_LENGTH = 50;

export const jobOfferDataSchema = z.object({
  title: nullableString,
  company: nullableString,
  location: nullableString,
  employmentType: nullableString,
  remotePolicy: nullableString,
  salaryRange: nullableString,
  seniorityLevel: nullableString,
  summary: nullableString,
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  niceToHave: z.array(z.string()).default([]),
  keySkills: z.array(z.string()).default([]),
});

export type JobOfferData = z.infer<typeof jobOfferDataSchema>;

export function emptyJobOfferData(): JobOfferData {
  return {
    title: null,
    company: null,
    location: null,
    employmentType: null,
    remotePolicy: null,
    salaryRange: null,
    seniorityLevel: null,
    summary: null,
    responsibilities: [],
    requirements: [],
    niceToHave: [],
    keySkills: [],
  };
}

export const importByTextSchema = z.object({
  mode: z.literal("text"),
  text: z
    .string()
    .trim()
    .min(MIN_JOB_TEXT_LENGTH, "Le texte de l'offre est trop court.")
    .max(MAX_JOB_TEXT_LENGTH, "Le texte de l'offre est trop long."),
});

export const importByUrlSchema = z.object({
  mode: z.literal("url"),
  url: z
    .string()
    .trim()
    .min(1, "L'URL est requise.")
    .refine((value) => /^https?:\/\/.+/i.test(value), "L'URL doit commencer par http:// ou https://."),
});

export const importJobOfferSchema = z.discriminatedUnion("mode", [importByTextSchema, importByUrlSchema]);

export type ImportJobOfferInput = z.infer<typeof importJobOfferSchema>;
