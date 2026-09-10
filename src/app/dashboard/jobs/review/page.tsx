import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getOwnedJobOffer, toJobOfferData } from "@/lib/data/job-offer";
import { confirmJobOfferAction } from "@/lib/actions/job-offer";
import { JobOfferEditor } from "@/components/jobs/edit/job-offer-editor";
import { RetryJobParsingButton } from "@/components/jobs/retry-job-parsing-button";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Vérifier l'offre" };

export default async function ReviewJobOfferPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string }>;
}) {
  const { job: jobId } = await searchParams;
  if (!jobId) notFound();

  const offer = await getOwnedJobOffer(jobId);
  if (!offer) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Vérifier l'offre"
        description="Voici les informations que nous avons extraites de cette offre. Vérifiez-les avant de continuer."
      />

      {offer.status === "FAILED" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <p className="text-sm text-foreground">
              {offer.errorMessage ??
                "Nous n'avons pas réussi à analyser automatiquement cette offre. Vous pouvez réessayer ou saisir les informations manuellement ci-dessous."}
            </p>
          </div>
          <RetryJobParsingButton jobOfferId={offer.id} />
        </div>
      )}

      <JobOfferEditor
        jobOfferId={offer.id}
        initialData={toJobOfferData(offer)}
        onSave={confirmJobOfferAction}
        submitLabel="Confirmer et enregistrer l'offre"
        submittingLabel="Enregistrement..."
      />
    </div>
  );
}
