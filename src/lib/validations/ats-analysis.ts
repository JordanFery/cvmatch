import { z } from "zod";

export const atsAnalysisDataSchema = z.object({
  score: z.number().int().min(0).max(100),
  summary: z.string(),
  matchedSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
});

export type AtsAnalysisData = z.infer<typeof atsAnalysisDataSchema>;
