import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getOwnedCv, getMasterCv } from "@/lib/data/cv";
import { confirmCvAction } from "@/lib/actions/cv";
import { CvEditor } from "@/components/cv/edit/cv-editor";
import { RetryParsingButton } from "@/components/cv/retry-parsing-button";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Vérifier mon CV" };

export default async function ReviewCvPage({
  searchParams,
}: {
  searchParams: Promise<{ cv?: string }>;
}) {
  const { cv: cvId } = await searchParams;
  if (!cvId) notFound();

  const [cv, masterCv] = await Promise.all([getOwnedCv(cvId), getMasterCv()]);
  if (!cv) notFound();

  const willBecomeMaster = !masterCv || masterCv.id === cv.id;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Vérifier mon CV"
        description="Voici les informations que nous avons extraites de votre CV. Vérifiez-les avant de continuer."
      />

      {cv.status === "FAILED" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <p className="text-sm text-foreground">
              {cv.errorMessage ??
                "Nous n'avons pas réussi à lire automatiquement ce CV. Vous pouvez réessayer ou saisir les informations manuellement ci-dessous."}
            </p>
          </div>
          <RetryParsingButton cvId={cv.id} />
        </div>
      )}

      <CvEditor
        cvId={cv.id}
        initialData={cv.parsedData}
        onSave={confirmCvAction}
        submitLabel={willBecomeMaster ? "Confirmer et enregistrer comme CV maître" : "Confirmer et ajouter à ma bibliothèque"}
        submittingLabel="Enregistrement..."
      />
    </div>
  );
}
