import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOwnedCv } from "@/lib/data/cv";
import { updateCvDataAction } from "@/lib/actions/cv";
import { CvEditor } from "@/components/cv/edit/cv-editor";
import { CvStatusBadge } from "@/components/cv/cv-status-badge";
import { DownloadOriginalButton } from "@/components/cv/download-original-button";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Modifier mon CV" };

export default async function EditCvPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cv = await getOwnedCv(id);
  if (!cv) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Modifier mon CV"
        description={cv.originalFileName ?? cv.name}
        actions={
          <>
            <CvStatusBadge status={cv.status} />
            {cv.storagePath && <DownloadOriginalButton cvId={cv.id} />}
          </>
        }
      />

      <CvEditor
        cvId={cv.id}
        initialData={cv.parsedData}
        onSave={updateCvDataAction}
        submitLabel="Enregistrer"
        submittingLabel="Enregistrement..."
      />
    </div>
  );
}
