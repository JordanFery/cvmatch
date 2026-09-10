import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

const optionalUrl = (message: string) =>
  z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^https?:\/\/.+/i.test(value), message);

const optionalDailyGoal = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => !value || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 50),
    "Doit être un nombre entier entre 1 et 50.",
  );

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis.").max(60),
  lastName: z.string().trim().min(1, "Le nom est requis.").max(60),
  phone: optionalText(30),
  location: optionalText(120),
  linkedinUrl: optionalUrl("URL LinkedIn invalide (doit commencer par http:// ou https://)."),
  portfolioUrl: optionalUrl("URL invalide (doit commencer par http:// ou https://)."),
  dailyApplicationGoal: optionalDailyGoal,
});

export type ProfileInput = z.infer<typeof profileSchema>;
