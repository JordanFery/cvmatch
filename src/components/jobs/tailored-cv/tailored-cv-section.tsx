import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { GenerateTailoredCvButton } from "@/components/jobs/tailored-cv/generate-tailored-cv-button";

type Tailored = { id: string; status: string; errorMessage: string | null } | null;

export function TailoredCvSection({
  jobOfferId,
  hasMasterCv,
  tailored,
}: {
  jobOfferId: string;
  hasMasterCv: boolean;
  tailored: Tailored;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CV adapté</CardTitle>
        <CardDescription>
          Génère une version de votre CV maître réorganisée et reformulée pour cette offre — sans jamais
          inventer d&apos;expérience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasMasterCv ? (
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard/cv/upload" className="font-medium text-foreground hover:underline">
              Importez votre CV
            </Link>{" "}
            pour générer une version adaptée à cette offre.
          </p>
        ) : !tailored || tailored.status === "FAILED" ? (
          <div className="space-y-3">
            {tailored?.status === "FAILED" && (
              <p className="text-sm text-destructive">{tailored.errorMessage ?? "La génération a échoué."}</p>
            )}
            <GenerateTailoredCvButton jobOfferId={jobOfferId} label="Générer un CV adapté" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/dashboard/jobs/${jobOfferId}/tailored-cv`}>Voir le CV adapté</ButtonLink>
            <GenerateTailoredCvButton jobOfferId={jobOfferId} label="Régénérer" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
