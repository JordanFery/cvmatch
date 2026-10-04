import type { Locale } from "@/lib/i18n/config";

/** Section/label strings shared by the on-screen preview (resume-preview.tsx) and the PDF export (pdf.tsx), so a tailored CV generated in English is never displayed under French headings. */
export type ResumeLabels = {
  summary: string;
  experiences: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  languages: string;
  present: string;
  skillGroups: {
    technical: string;
    tools: string;
    frameworks: string;
    databases: string;
    soft: string;
    other: string;
  };
};

const RESUME_LABELS: Record<Locale, ResumeLabels> = {
  fr: {
    summary: "Résumé",
    experiences: "Expériences",
    education: "Formation",
    skills: "Compétences",
    projects: "Projets",
    certifications: "Certifications",
    languages: "Langues",
    present: "Présent",
    skillGroups: {
      technical: "Techniques",
      tools: "Outils",
      frameworks: "Frameworks",
      databases: "Bases de données",
      soft: "Savoir-être",
      other: "Autres",
    },
  },
  en: {
    summary: "Summary",
    experiences: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    present: "Present",
    skillGroups: {
      technical: "Technical",
      tools: "Tools",
      frameworks: "Frameworks",
      databases: "Databases",
      soft: "Soft skills",
      other: "Other",
    },
  },
};

export function getResumeLabels(locale: Locale): ResumeLabels {
  return RESUME_LABELS[locale];
}
