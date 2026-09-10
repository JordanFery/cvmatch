import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getOwnedJobOffer, toJobOfferData } from "@/lib/data/job-offer";
import { updateJobOfferAction } from "@/lib/actions/job-offer";
import { getMasterCv } from "@/lib/data/cv";
import { getAtsAnalysis } from "@/lib/data/ats-analysis";
import { getTailoredCv } from "@/lib/data/tailored-cv";
import { getCoverLetter } from "@/lib/data/cover-letter";
import { getPriorApplicationsAtCompany } from "@/lib/data/application";
import { JobOfferEditor } from "@/components/jobs/edit/job-offer-editor";
import { JobOfferStatusBadge } from "@/components/jobs/job-offer-status-badge";
import { RetryJobParsingButton } from "@/components/jobs/retry-job-parsing-button";
import { DeleteJobOfferDialog } from "@/components/jobs/delete-job-offer-dialog";
import { AtsAnalysisSection } from "@/components/jobs/ats/ats-analysis-section";
import { TailoredCvSection } from "@/components/jobs/tailored-cv/tailored-cv-section";
import { CoverLetterSection } from "@/components/jobs/cover-letter/cover-letter-section";
import { SourceUrlEditor } from "@/components/jobs/source-url-editor";
import { ApplyDialog } from "@/components/jobs/apply/apply-dialog";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { toggleJobOfferFavoriteAction } from "@/lib/actions/job-offer";
import { APPLICATION_STATUS_LABELS, type ApplicationStatusValue } from "@/lib/validations/application";

export const metadata: Metadata = { title: "Offre" };

const APPLIED_CV_TYPE_LABELS: Record<string, string> = {
  MASTER: "CV maître",
  TAILORED: "CV adapté",
};

const APPLICATION_STATUS_VARIANTS: Record<ApplicationStatusValue, "outline" | "warning" | "success" | "destructive"> = {
  NOT_SENT: "outline",
  SENT: "warning",
  INTERVIEW: "success",
  REJECTED: "destructive",
};

export default async function JobOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [offer, cv] = await Promise.all([getOwnedJobOffer(id), getMasterCv()]);
  if (!offer) notFound();

  const [analysis, tailored, coverLetter, priorApplications] = await Promise.all([
    cv ? getAtsAnalysis(cv.id, offer.id) : Promise.resolve(null),
    cv ? getTailoredCv(cv.id, offer.id) : Promise.resolve(null),
    cv ? getCoverLetter(cv.id, offer.id) : Promise.resolve(null),
    offer.company ? getPriorApplicationsAtCompany(offer.company, offer.id) : Promise.resolve([]),
  ]);
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">{offer.title}</h1>
            <FavoriteButton
              id={offer.id}
              isFavorite={offer.isFavorite}
              action={toggleJobOfferFavoriteAction}
              label="favori"
            />
          </div>
          <SourceUrlEditor jobOfferId={offer.id} sourceUrl={offer.sourceUrl} />
        </div>
        <div className="flex items-center gap-2">
          <JobOfferStatusBadge status={offer.status} />
          <DeleteJobOfferDialog jobOfferId={offer.id} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Statut de la candidature :</span>
          <Badge variant={APPLICATION_STATUS_VARIANTS[offer.applicationStatus as ApplicationStatusValue]}>
            {APPLICATION_STATUS_LABELS[offer.applicationStatus as ApplicationStatusValue]}
          </Badge>
          {offer.appliedAt && (
            <span className="text-muted-foreground">
              — envoyée le {dateFormatter.format(offer.appliedAt)}
              {offer.appliedCvType && ` avec le ${APPLIED_CV_TYPE_LABELS[offer.appliedCvType]}`}
            </span>
          )}
        </div>
        <ApplyDialog
          jobOfferId={offer.id}
          company={offer.company}
          sourceUrl={offer.sourceUrl}
          hasMasterCv={!!cv}
          hasTailoredCv={tailored?.status === "READY"}
          masterCvHref="/dashboard/cv"
          tailoredCvHref={`/dashboard/jobs/${offer.id}/tailored-cv`}
          priorApplications={priorApplications}
        />
      </div>

      {offer.status === "FAILED" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <p className="text-sm text-foreground">
              {offer.errorMessage ?? "L'analyse automatique a échoué. Vous pouvez réessayer ou corriger manuellement."}
            </p>
          </div>
          <RetryJobParsingButton jobOfferId={offer.id} />
        </div>
      )}

      <AtsAnalysisSection jobOfferId={offer.id} hasMasterCv={!!cv} analysis={analysis} />

      <TailoredCvSection jobOfferId={offer.id} hasMasterCv={!!cv} tailored={tailored} />

      <CoverLetterSection jobOfferId={offer.id} hasMasterCv={!!cv} coverLetter={coverLetter} />

      <JobOfferEditor
        jobOfferId={offer.id}
        initialData={toJobOfferData(offer)}
        onSave={updateJobOfferAction}
        submitLabel="Enregistrer"
        submittingLabel="Enregistrement..."
      />
    </div>
  );
}
