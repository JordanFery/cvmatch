import type { ParsedCv } from "@/lib/validations/cv";

/** Maps a validated `ParsedCv` onto `CvData`'s column shape for a Prisma create/update. */
export function cvDataJson(data: ParsedCv) {
  return {
    personalInfo: data.personalInfo,
    summary: data.summary,
    experiences: data.experiences,
    education: data.education,
    skills: data.skills,
    certifications: data.certifications,
    projects: data.projects,
    languages: data.languages,
    customSections: data.customSections,
  };
}
