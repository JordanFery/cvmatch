import type { Metadata } from "next";
import { ImportOfferForm } from "@/components/jobs/import-offer-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Importer une offre" };

export default function AddJobOfferPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Importer une offre"
        description="Collez le texte d'une offre ou son lien — nous extrayons et structurons automatiquement son contenu. Vous pourrez vérifier et corriger les informations avant de l'enregistrer."
      />
      <ImportOfferForm />
    </div>
  );
}
