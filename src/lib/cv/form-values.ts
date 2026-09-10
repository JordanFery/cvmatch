import type { ParsedCv } from "@/lib/validations/cv";

// react-hook-form works best with plain strings — these mirror `ParsedCv` but
// replace every `string | null` with `string` ("" standing in for null).
// `toParsedCv` converts back at submit time.

export type CvFormValues = {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl: string;
    portfolioUrl: string;
    githubUrl: string;
    otherLinks: { label: string; url: string }[];
  };
  summary: string;
  experiences: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
    technologies: string[];
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
    frameworks: string[];
    databases: string[];
    other: string[];
  };
  certifications: {
    name: string;
    organization: string;
    date: string;
    credentialUrl: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    url: string;
    githubUrl: string;
  }[];
  languages: { language: string; proficiency: string }[];
  customSections: { title: string; content: string }[];
};

const s = (value: string | null) => value ?? "";
const n = (value: string): string | null => (value.trim() === "" ? null : value.trim());

export function toFormValues(cv: ParsedCv): CvFormValues {
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
    languages: cv.languages.map((lang) => ({
      language: lang.language,
      proficiency: s(lang.proficiency),
    })),
    customSections: cv.customSections,
  };
}

export function toParsedCv(values: CvFormValues): ParsedCv {
  return {
    personalInfo: {
      firstName: n(values.personalInfo.firstName),
      lastName: n(values.personalInfo.lastName),
      title: n(values.personalInfo.title),
      email: n(values.personalInfo.email),
      phone: n(values.personalInfo.phone),
      location: n(values.personalInfo.location),
      linkedinUrl: n(values.personalInfo.linkedinUrl),
      portfolioUrl: n(values.personalInfo.portfolioUrl),
      githubUrl: n(values.personalInfo.githubUrl),
      otherLinks: values.personalInfo.otherLinks.filter((link) => link.label.trim() && link.url.trim()),
    },
    summary: n(values.summary),
    experiences: values.experiences.map((exp) => ({
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
    education: values.education.map((edu) => ({
      school: n(edu.school),
      degree: n(edu.degree),
      field: n(edu.field),
      location: n(edu.location),
      startDate: n(edu.startDate),
      endDate: n(edu.endDate),
      description: n(edu.description),
    })),
    skills: { ...values.skills },
    certifications: values.certifications.map((cert) => ({
      name: n(cert.name),
      organization: n(cert.organization),
      date: n(cert.date),
      credentialUrl: n(cert.credentialUrl),
    })),
    projects: values.projects.map((project) => ({
      name: n(project.name),
      description: n(project.description),
      technologies: project.technologies,
      url: n(project.url),
      githubUrl: n(project.githubUrl),
    })),
    languages: values.languages
      .filter((lang) => lang.language.trim())
      .map((lang) => ({ language: lang.language.trim(), proficiency: n(lang.proficiency) })),
    customSections: values.customSections.filter((section) => section.title.trim()),
  };
}

export function emptyExperience(): CvFormValues["experiences"][number] {
  return {
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: [],
    technologies: [],
  };
}

export function emptyEducation(): CvFormValues["education"][number] {
  return { school: "", degree: "", field: "", location: "", startDate: "", endDate: "", description: "" };
}

export function emptyCertification(): CvFormValues["certifications"][number] {
  return { name: "", organization: "", date: "", credentialUrl: "" };
}

export function emptyProject(): CvFormValues["projects"][number] {
  return { name: "", description: "", technologies: [], url: "", githubUrl: "" };
}

export function emptyLanguage(): CvFormValues["languages"][number] {
  return { language: "", proficiency: "" };
}

export function emptyCustomSection(): CvFormValues["customSections"][number] {
  return { title: "", content: "" };
}
