import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, Sparkles } from "lucide-react";
import { getOwnedJobOffer } from "@/lib/data/job-offer";
import { getMasterCv } from "@/lib/data/cv";
import { getCoverLetter } from "@/lib/data/cover-letter";
import { DownloadPdfButton } from "@/components/cv/download-pdf-button";
import { CopyLetterButton } from "@/components/jobs/cover-letter/copy-letter-button";
import { CoverLetterEditor } from "@/components/jobs/cover-letter/cover-letter-editor";
import { DeleteCoverLetterDialog } from "@/components/jobs/cover-letter/delete-cover-letter-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Lettre de motivation" };

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

export default async function CoverLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: jobOfferId } = await params;
  const [offer, cv] = await Promise.all([getOwnedJobOffer(jobOfferId), getMasterCv()]);
  if (!offer) notFound();
  if (!cv) notFound();

  const letter = await getCoverLetter(cv.id, jobOfferId);
  if (!letter) notFound();

  const content = letter.content ?? "";
  const companyInsights = asStringArray(letter.companyInsights);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Lettre de motivation"
        description={`Pour l'offre « ${offer.title} »`}
        actions={<DeleteCoverLetterDialog coverLetterId={letter.id} />}
      />

      {letter.status === "FAILED" && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <p className="text-sm text-foreground">
            {letter.errorMessage ?? "La génération a échoué. Vous pouvez rédiger la lettre manuellement ci-dessous."}
          </p>
        </div>
      )}

      {companyInsights.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="space-y-1 text-sm">
            <p className="font-medium">Informations trouvées sur l&apos;entreprise et utilisées dans la lettre</p>
            <ul className="list-inside list-disc text-muted-foreground">
              {companyInsights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          <TabsTrigger value="edit">Modifier</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="mb-4 flex justify-end gap-2">
            <CopyLetterButton content={content} />
            <DownloadPdfButton href={`/api/jobs/${jobOfferId}/cover-letter/pdf`} label="Télécharger en PDF" />
          </div>
          <div className="rounded-lg border border-border p-6">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <CoverLetterEditor id={letter.id} initialContent={content} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
