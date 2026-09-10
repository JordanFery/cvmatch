import { z } from "zod";
import type { ParsedCv } from "@/lib/validations/cv";

// Structured-output grammar compilation blows up on deeply nested
// `anyOf: [string, null]` unions (Anthropic rejects the schema with "compiled
// grammar is too large" once `parsedCvSchema`'s ~30 nullable-string fields are
// all inlined). This mirror schema uses plain strings with "" standing in for
// "not found", which the app-facing schema doesn't have to care about —
// `llmToParsedCv` below converts "" back to `null` after the call. Shared by
// every LLM call that produces a full CV shape (extraction and tailoring).
const str = z.string();
const strArray = z.array(z.string());

const llmPersonalInfo = z.object({
  firstName: str,
  lastName: str,
  title: str,
  email: str,
  phone: str,
  location: str,
  linkedinUrl: str,
  portfolioUrl: str,
  githubUrl: str,
  otherLinks: z.array(z.object({ label: z.string(), url: z.string() })),
});

const llmExperience = z.object({
  jobTitle: str,
  company: str,
  location: str,
  startDate: str,
  endDate: str,
  current: z.boolean(),
  description: str,
  achievements: strArray,
  technologies: strArray,
});

const llmEducation = z.object({
  school: str,
  degree: str,
  field: str,
  location: str,
  startDate: str,
  endDate: str,
  description: str,
});

const llmSkills = z.object({
  technical: strArray,
  soft: strArray,
  tools: strArray,
  frameworks: strArray,
  databases: strArray,
  other: strArray,
});

const llmCertification = z.object({
  name: str,
  organization: str,
  date: str,
  credentialUrl: str,
});

const llmProject = z.object({
  name: str,
  description: str,
  technologies: strArray,
  url: str,
  githubUrl: str,
});

const llmLanguage = z.object({ language: str, proficiency: str });
const llmCustomSection = z.object({ title: str, content: str });

export const llmCvSchema = z.object({
  personalInfo: llmPersonalInfo,
  summary: str,
  experiences: z.array(llmExperience),
  education: z.array(llmEducation),
  skills: llmSkills,
  certifications: z.array(llmCertification),
  projects: z.array(llmProject),
  languages: z.array(llmLanguage),
  customSections: z.array(llmCustomSection),
});

export type LlmCv = z.infer<typeof llmCvSchema>;

const n = (value: string): string | null => (value.trim() === "" ? null : value.trim());

export function llmToParsedCv(llm: LlmCv): ParsedCv {
  return {
    personalInfo: {
      firstName: n(llm.personalInfo.firstName),
      lastName: n(llm.personalInfo.lastName),
      title: n(llm.personalInfo.title),
      email: n(llm.personalInfo.email),
      phone: n(llm.personalInfo.phone),
      location: n(llm.personalInfo.location),
      linkedinUrl: n(llm.personalInfo.linkedinUrl),
      portfolioUrl: n(llm.personalInfo.portfolioUrl),
      githubUrl: n(llm.personalInfo.githubUrl),
      otherLinks: llm.personalInfo.otherLinks.filter((link) => link.label.trim() && link.url.trim()),
    },
    summary: n(llm.summary),
    experiences: llm.experiences.map((exp) => ({
      jobTitle: n(exp.jobTitle),
      company: n(exp.company),
      location: n(exp.location),
      startDate: n(exp.startDate),
      endDate: n(exp.endDate),
      current: exp.current,
      description: n(exp.description),
      achievements: exp.achievements,
      technologies: exp.technologies,
    })),
    education: llm.education.map((edu) => ({
      school: n(edu.school),
      degree: n(edu.degree),
      field: n(edu.field),
      location: n(edu.location),
      startDate: n(edu.startDate),
      endDate: n(edu.endDate),
      description: n(edu.description),
    })),
    skills: { ...llm.skills },
    certifications: llm.certifications.map((cert) => ({
      name: n(cert.name),
      organization: n(cert.organization),
      date: n(cert.date),
      credentialUrl: n(cert.credentialUrl),
    })),
    projects: llm.projects.map((project) => ({
      name: n(project.name),
      description: n(project.description),
      technologies: project.technologies,
      url: n(project.url),
      githubUrl: n(project.githubUrl),
    })),
    languages: llm.languages
      .filter((lang) => lang.language.trim())
      .map((lang) => ({ language: lang.language.trim(), proficiency: n(lang.proficiency) })),
    customSections: llm.customSections.filter((section) => section.title.trim()),
  };
}

/** The inverse of `llmToParsedCv` — used to feed an existing `ParsedCv` back to the model as context (e.g. the master CV when tailoring). */
export function parsedCvToLlm(cv: ParsedCv): LlmCv {
  const s = (value: string | null) => value ?? "";
  return {
    personalInfo: {
      firstName: s(cv.personalInfo.firstName),
      lastName: s(cv.personalInfo.lastName),
      title: s(cv.personalInfo.title),
      email: s(cv.personalInfo.email),
      phone: s(cv.personalInfo.phone),
      location: s(cv.personalInfo.location),
      linkedinUrl: s(cv.personalInfo.linkedinUrl),
      portfolioUrl: s(cv.personalInfo.portfolioUrl),
      githubUrl: s(cv.personalInfo.githubUrl),
      otherLinks: cv.personalInfo.otherLinks,
    },
    summary: s(cv.summary),
    experiences: cv.experiences.map((exp) => ({
      jobTitle: s(exp.jobTitle),
      company: s(exp.company),
      location: s(exp.location),
      startDate: s(exp.startDate),
      endDate: s(exp.endDate),
      current: exp.current,
      description: s(exp.description),
      achievements: exp.achievements,
      technologies: exp.technologies,
    })),
    education: cv.education.map((edu) => ({
      school: s(edu.school),
      degree: s(edu.degree),
      field: s(edu.field),
      location: s(edu.location),
      startDate: s(edu.startDate),
      endDate: s(edu.endDate),
      description: s(edu.description),
    })),
    skills: { ...cv.skills },
    certifications: cv.certifications.map((cert) => ({
      name: s(cert.name),
      organization: s(cert.organization),
      date: s(cert.date),
      credentialUrl: s(cert.credentialUrl),
    })),
    projects: cv.projects.map((project) => ({
      name: s(project.name),
      description: s(project.description),
      technologies: project.technologies,
      url: s(project.url),
      githubUrl: s(project.githubUrl),
    })),
    languages: cv.languages.map((lang) => ({ language: lang.language, proficiency: s(lang.proficiency) })),
    customSections: cv.customSections,
  };
}
