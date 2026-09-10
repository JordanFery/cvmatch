"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { updateProfileAction } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

type ProfileFormValues = ProfileInput;

export function ProfileForm({
  email,
  defaultValues,
}: {
  email: string;
  defaultValues: ProfileFormValues;
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(timeout);
  }, [saved]);

  const onSubmit = (values: ProfileFormValues) => {
    setFormError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateProfileAction(values);
      if ("error" in result) {
        setFormError(result.error);
        return;
      }
      setSaved(true);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>Ces informations nous aident à personnaliser vos candidatures.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} disabled readOnly />
            <p className="text-xs text-muted-foreground">
              La modification de l&apos;e-mail sera bientôt disponible.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input id="location" placeholder="Paris, France" {...register("location")} />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/in/..."
                aria-invalid={!!errors.linkedinUrl}
                aria-describedby={errors.linkedinUrl ? "linkedinUrl-error" : undefined}
                {...register("linkedinUrl")}
              />
              {errors.linkedinUrl && (
                <p id="linkedinUrl-error" className="text-sm text-destructive">
                  {errors.linkedinUrl.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolioUrl">Portfolio</Label>
              <Input
                id="portfolioUrl"
                placeholder="https://..."
                aria-invalid={!!errors.portfolioUrl}
                aria-describedby={errors.portfolioUrl ? "portfolioUrl-error" : undefined}
                {...register("portfolioUrl")}
              />
              {errors.portfolioUrl && (
                <p id="portfolioUrl-error" className="text-sm text-destructive">
                  {errors.portfolioUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyApplicationGoal">Objectif de candidatures par jour</Label>
            <Input
              id="dailyApplicationGoal"
              type="number"
              min={1}
              max={50}
              placeholder="Ex. 3"
              className="max-w-32"
              aria-invalid={!!errors.dailyApplicationGoal}
              aria-describedby={errors.dailyApplicationGoal ? "dailyApplicationGoal-error" : undefined}
              {...register("dailyApplicationGoal")}
            />
            <p className="text-xs text-muted-foreground">
              Un rappel sur votre dashboard vous dira si vous êtes en avance ou en retard. Laissez vide pour
              désactiver.
            </p>
            {errors.dailyApplicationGoal && (
              <p id="dailyApplicationGoal-error" className="text-sm text-destructive">
                {errors.dailyApplicationGoal.message}
              </p>
            )}
          </div>

          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending || (!isDirty && !saved)}>
            {isPending ? "Enregistrement..." : saved ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Enregistré
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
