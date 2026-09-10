import { z } from "zod";

export const coverLetterDataSchema = z.object({
  content: z.string(),
  companyInsights: z.array(z.string()).default([]),
});

export type CoverLetterData = z.infer<typeof coverLetterDataSchema>;
