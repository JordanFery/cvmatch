import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { GenerateCoverLetterButton } from "@/components/jobs/cover-letter/generate-cover-letter-button";

type CoverLetter = { id: string; status: string; errorMessage: string | null } | null;

export function CoverLetterSection({
  jobOfferId,
  hasMasterCv,
  coverLetter,
}: {
  jobOfferId: string;
  hasMasterCv: boolean;
  coverLetter: CoverLetter;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lettre de motivation</CardTitle>
        <CardDescription>
          Génère une lettre personnalisée pour cette offre — notre IA recherche des informations réelles sur
          l&apos;entreprise pour l&apos;adapter, sans jamais inventer de faits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasMasterCv ? (
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard/cv/upload" className="font-medium text-foreground hover:underline">
              Importez votre CV
            </Link>{" "}
            pour générer une lettre de motivation pour cette offre.
          </p>
        ) : !coverLetter || coverLetter.status === "FAILED" ? (
          <div className="space-y-3">
            {coverLetter?.status === "FAILED" && (
              <p className="text-sm text-destructive">{coverLetter.errorMessage ?? "La génération a échoué."}</p>
            )}
            <GenerateCoverLetterButton jobOfferId={jobOfferId} label="Générer une lettre de motivation" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/dashboard/jobs/${jobOfferId}/cover-letter`}>Voir la lettre</ButtonLink>
            <GenerateCoverLetterButton jobOfferId={jobOfferId} label="Régénérer" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
