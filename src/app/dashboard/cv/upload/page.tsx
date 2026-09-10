import type { Metadata } from "next";
import { UploadDropzone } from "@/components/cv/upload-dropzone";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Importer mon CV" };

export default function UploadCvPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Importer mon CV"
        description="Nous extrayons et structurons automatiquement le contenu de votre CV. Vous pourrez vérifier et corriger les informations avant de les enregistrer."
      />
      <UploadDropzone />
    </div>
  );
}
