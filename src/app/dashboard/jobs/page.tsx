import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getJobOffers } from "@/lib/data/job-offer";
import { JobOfferCard } from "@/components/jobs/job-offer-card";
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
        <div className="grid gap-4 sm:grid-cols-2">
          {offers.map((offer) => (
            <JobOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
