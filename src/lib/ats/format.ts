import type { ParsedCv } from "@/lib/validations/cv";
import type { JobOfferData } from "@/lib/validations/job-offer";

const line = (label: string, value: string | null | undefined) => (value ? `${label}: ${value}\n` : "");
const list = (label: string, values: string[]) => (values.length > 0 ? `${label}: ${values.join(", ")}\n` : "");

/** Renders the structured CV as a compact plain-text profile for the LLM prompt — no raw resume text, just the reviewed structured data. */
export function formatCvForAnalysis(cv: ParsedCv): string {
  const parts: string[] = [];

  parts.push(line("Title", cv.personalInfo.title));
  if (cv.summary) parts.push(`Summary: ${cv.summary}\n`);

  if (cv.experiences.length > 0) {
    parts.push("Experience:\n");
    for (const exp of cv.experiences) {
      parts.push(
        `- ${exp.jobTitle ?? "?"} at ${exp.company ?? "?"} (${exp.startDate ?? "?"} - ${exp.current ? "present" : (exp.endDate ?? "?")})\n`,
      );
      if (exp.description) parts.push(`  ${exp.description}\n`);
      if (exp.achievements.length > 0) parts.push(`  Achievements: ${exp.achievements.join("; ")}\n`);
      if (exp.technologies.length > 0) parts.push(`  Technologies: ${exp.technologies.join(", ")}\n`);
    }
  }

  if (cv.education.length > 0) {
    parts.push("Education:\n");
    for (const edu of cv.education) {
      parts.push(`- ${edu.degree ?? "?"} in ${edu.field ?? "?"}, ${edu.school ?? "?"}\n`);
    }
  }

  parts.push(list("Technical skills", cv.skills.technical));
  parts.push(list("Soft skills", cv.skills.soft));
  parts.push(list("Tools", cv.skills.tools));
  parts.push(list("Frameworks", cv.skills.frameworks));
  parts.push(list("Databases", cv.skills.databases));
  parts.push(list("Other skills", cv.skills.other));

  if (cv.certifications.length > 0) {
    parts.push(`Certifications: ${cv.certifications.map((c) => c.name).filter(Boolean).join(", ")}\n`);
  }
  if (cv.projects.length > 0) {
    parts.push("Projects:\n");
    for (const project of cv.projects) {
      parts.push(`- ${project.name ?? "?"}: ${project.description ?? ""} (${project.technologies.join(", ")})\n`);
    }
  }
  if (cv.languages.length > 0) {
    parts.push(`Languages: ${cv.languages.map((l) => `${l.language} (${l.proficiency ?? "?"})`).join(", ")}\n`);
  }

  return parts.join("");
}

/** Renders the structured job offer as a compact plain-text posting for the LLM prompt. */
export function formatJobOfferForAnalysis(offer: JobOfferData): string {
  const parts: string[] = [];

  parts.push(line("Title", offer.title));
  parts.push(line("Company", offer.company));
  parts.push(line("Seniority level", offer.seniorityLevel));
  parts.push(line("Employment type", offer.employmentType));
  if (offer.summary) parts.push(`Summary: ${offer.summary}\n`);
  parts.push(list("Key skills", offer.keySkills));
  if (offer.responsibilities.length > 0) parts.push(`Responsibilities:\n- ${offer.responsibilities.join("\n- ")}\n`);
  if (offer.requirements.length > 0) parts.push(`Requirements:\n- ${offer.requirements.join("\n- ")}\n`);
  if (offer.niceToHave.length > 0) parts.push(`Nice to have:\n- ${offer.niceToHave.join("\n- ")}\n`);

  return parts.join("");
}
