import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getOwnedJobOffer } from "@/lib/data/job-offer";
import { getMasterCv } from "@/lib/data/cv";
import { getTailoredCv, toParsedCvFromTailored } from "@/lib/data/tailored-cv";
import { updateTailoredCvAction } from "@/lib/actions/tailored-cv";
import { CvEditor } from "@/components/cv/edit/cv-editor";
import { ResumePreview } from "@/components/cv/resume-preview";
import { PrintButton } from "@/components/cv/print-button";
import { DeleteTailoredCvDialog } from "@/components/jobs/tailored-cv/delete-tailored-cv-dialog";
import { SaveToLibraryButton } from "@/components/jobs/tailored-cv/save-to-library-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "CV adapté" };

export default async function TailoredCvPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: jobOfferId } = await params;
  const [offer, cv] = await Promise.all([getOwnedJobOffer(jobOfferId), getMasterCv()]);
  if (!offer) notFound();
  if (!cv) notFound();

  const tailored = await getTailoredCv(cv.id, jobOfferId);
  if (!tailored) notFound();

  const data = toParsedCvFromTailored(tailored.data);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Screen UI — hidden entirely when printing so only the resume below prints, regardless of which tab was active. */}
      <div className="space-y-6 print:hidden">
        <PageHeader
          title="CV adapté"
          description={`Pour l'offre « ${offer.title} »`}
          actions={
            <>
              <SaveToLibraryButton tailoredCvId={tailored.id} />
              <DeleteTailoredCvDialog tailoredCvId={tailored.id} />
            </>
          }
        />

        {tailored.status === "FAILED" && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <p className="text-sm text-foreground">
              {tailored.errorMessage ?? "La génération a échoué. Vous pouvez corriger manuellement ci-dessous."}
            </p>
          </div>
        )}

        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="edit">Modifier</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <div className="mb-4 flex justify-end">
              <PrintButton />
            </div>
            <div className="rounded-lg border border-border p-2">
              <ResumePreview cv={data} />
            </div>
          </TabsContent>

          <TabsContent value="edit">
            <CvEditor
              cvId={tailored.id}
              initialData={data}
              onSave={updateTailoredCvAction}
              submitLabel="Enregistrer"
              submittingLabel="Enregistrement..."
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Print-only — always the resume, never the edit form. */}
      <div className="hidden print:block">
        <ResumePreview cv={data} />
      </div>
    </div>
  );
}
