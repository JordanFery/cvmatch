import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { getCvLibrary } from "@/lib/data/cv";
import { CvLibraryCard } from "@/components/cv/cv-library-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = { title: "Mon CV" };

export default async function CvPage() {
  const cvs = await getCvLibrary();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mon CV"
        description="Gérez votre CV maître et les autres versions de votre bibliothèque."
        actions={cvs.length > 0 && <ButtonLink href="/dashboard/cv/upload">Importer un CV</ButtonLink>}
      />

      {cvs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Votre CV maître"
          description="Importez votre CV pour commencer à analyser et personnaliser vos candidatures."
          actionLabel="Importer mon CV"
          actionHref="/dashboard/cv/upload"
        />
      ) : (
        <div className="space-y-4">
          {cvs.map((cv) => (
            <CvLibraryCard key={cv.id} cv={cv} />
          ))}
        </div>
      )}
    </div>
  );
}
