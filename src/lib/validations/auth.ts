import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "Le prénom est requis.").max(60),
    lastName: z.string().trim().min(1, "Le nom est requis.").max(60),
    email: z.string().trim().min(1, "L'e-mail est requis.").email("Adresse e-mail invalide."),
    password: z
      .string()
      .min(8, "8 caractères minimum.")
      .regex(/[a-z]/, "Une minuscule minimum.")
      .regex(/[A-Z]/, "Une majuscule minimum.")
      .regex(/[0-9]/, "Un chiffre minimum."),
    confirmPassword: z.string().min(1, "Merci de confirmer votre mot de passe."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "L'e-mail est requis.").email("Adresse e-mail invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export type LoginInput = z.infer<typeof loginSchema>;
