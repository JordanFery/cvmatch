import { z } from "zod";
import { nullableString } from "@/lib/validations/shared";

// --- File upload constraints ---------------------------------------------

export const MAX_CV_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_CV_MIME_TYPES = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
} as const;

export type CvFileType = (typeof ALLOWED_CV_MIME_TYPES)[keyof typeof ALLOWED_CV_MIME_TYPES];

// --- Structured CV content -------------------------------------------------
// Every field an LLM (or the user) might not find in the source document is
// nullable rather than required — the extraction step must never invent a
// value to satisfy the schema. Array sections default to `[]`, never fabricated.

export const personalInfoSchema = z.object({
  firstName: nullableString,
  lastName: nullableString,
  title: nullableString,
  email: nullableString,
  phone: nullableString,
  location: nullableString,
  linkedinUrl: nullableString,
  portfolioUrl: nullableString,
  githubUrl: nullableString,
  otherLinks: z
    .array(z.object({ label: z.string(), url: z.string() }))
    .default([]),
});

export const experienceSchema = z.object({
  jobTitle: nullableString,
  company: nullableString,
  location: nullableString,
  startDate: nullableString,
  endDate: nullableString,
  current: z.boolean().default(false),
  description: nullableString,
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  school: nullableString,
  degree: nullableString,
  field: nullableString,
  location: nullableString,
  startDate: nullableString,
  endDate: nullableString,
  description: nullableString,
});

export const skillsSchema = z.object({
  technical: z.array(z.string()).default([]),
  soft: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  frameworks: z.array(z.string()).default([]),
  databases: z.array(z.string()).default([]),
  other: z.array(z.string()).default([]),
});

export const certificationSchema = z.object({
  name: nullableString,
  organization: nullableString,
  date: nullableString,
  credentialUrl: nullableString,
});

export const projectSchema = z.object({
  name: nullableString,
  description: nullableString,
  technologies: z.array(z.string()).default([]),
  url: nullableString,
  githubUrl: nullableString,
});

export const languageSchema = z.object({
  language: z.string(),
  proficiency: nullableString,
});

export const customSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const parsedCvSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: nullableString,
  experiences: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: skillsSchema,
  certifications: z.array(certificationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  languages: z.array(languageSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
});

export type ParsedCv = z.infer<typeof parsedCvSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Language = z.infer<typeof languageSchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;

/** An empty structured CV — used when parsing fails and the user must fill everything in by hand. */
export function emptyParsedCv(): ParsedCv {
  return {
    personalInfo: {
      firstName: null,
      lastName: null,
      title: null,
      email: null,
      phone: null,
      location: null,
      linkedinUrl: null,
      portfolioUrl: null,
      githubUrl: null,
      otherLinks: [],
    },
    summary: null,
    experiences: [],
    education: [],
    skills: { technical: [], soft: [], tools: [], frameworks: [], databases: [], other: [] },
    certifications: [],
    projects: [],
    languages: [],
    customSections: [],
  };
}
