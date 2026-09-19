import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getJobOffers } from "@/lib/data/job-offer";
import { JobsList } from "@/components/jobs/jobs-list";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = { title: "Offres" };

export default async function JobsPage() {
  const offers = await getJobOffers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offres"
        description="Centralisez les offres qui vous intéressent."
        actions={offers.length > 0 && <ButtonLink href="/dashboard/jobs/add">Importer une offre</ButtonLink>}
      />

      {offers.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Aucune offre pour le moment"
          description="Importez une offre (texte ou lien) pour commencer à l'analyser et à préparer votre candidature."
          actionLabel="Importer une offre"
          actionHref="/dashboard/jobs/add"
        />
      ) : (
        <JobsList
          offers={offers.map((offer) => ({
            id: offer.id,
            title: offer.title,
            company: offer.company,
            location: offer.location,
            salaryRange: offer.salaryRange,
            status: offer.status,
            isFavorite: offer.isFavorite,
            keySkills: offer.keySkills,
            summary: offer.summary,
            responsibilities: offer.responsibilities,
            requirements: offer.requirements,
            niceToHave: offer.niceToHave,
            updatedAt: offer.updatedAt,
          }))}
        />
      )}
    </div>
  );
}
