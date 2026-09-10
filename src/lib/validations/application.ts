import { z } from "zod";

export const applicationStatusSchema = z.enum(["NOT_SENT", "SENT", "INTERVIEW", "REJECTED"]);
export type ApplicationStatusValue = z.infer<typeof applicationStatusSchema>;

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatusValue, string> = {
  NOT_SENT: "Non envoyé",
  SENT: "Envoyé",
  INTERVIEW: "Entrevue",
  REJECTED: "Refusé",
};
