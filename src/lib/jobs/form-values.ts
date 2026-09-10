import type { JobOfferData } from "@/lib/validations/job-offer";

export type JobOfferFormValues = {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  remotePolicy: string;
  salaryRange: string;
  seniorityLevel: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  keySkills: string[];
};

const s = (value: string | null) => value ?? "";
const n = (value: string): string | null => (value.trim() === "" ? null : value.trim());

export function toFormValues(data: JobOfferData): JobOfferFormValues {
  return {
    title: s(data.title),
    company: s(data.company),
    location: s(data.location),
    employmentType: s(data.employmentType),
    remotePolicy: s(data.remotePolicy),
    salaryRange: s(data.salaryRange),
    seniorityLevel: s(data.seniorityLevel),
    summary: s(data.summary),
    responsibilities: data.responsibilities,
    requirements: data.requirements,
    niceToHave: data.niceToHave,
    keySkills: data.keySkills,
  };
}

export function toJobOfferData(values: JobOfferFormValues): JobOfferData {
  return {
    title: n(values.title),
    company: n(values.company),
    location: n(values.location),
    employmentType: n(values.employmentType),
    remotePolicy: n(values.remotePolicy),
    salaryRange: n(values.salaryRange),
    seniorityLevel: n(values.seniorityLevel),
    summary: n(values.summary),
    responsibilities: values.responsibilities,
    requirements: values.requirements,
    niceToHave: values.niceToHave,
    keySkills: values.keySkills,
  };
}
