import type { Metadata } from "next";
import { Send } from "lucide-react";
import { getApplicationsBoard } from "@/lib/data/application";
import { ApplicationsTable } from "@/components/applications/applications-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Candidatures" };

export default async function ApplicationsPage() {
  const rows = await getApplicationsBoard();

  return (
    <div className="space-y-6">
      <PageHeader title="Candidatures" description="Suivez l'état de chacune de vos candidatures." />

      {rows.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Votre espace de candidatures est prêt."
          description="Importez une offre pour commencer à suivre vos candidatures."
          actionLabel="Trouver une offre"
          actionHref="/dashboard/jobs"
        />
      ) : (
        <ApplicationsTable rows={rows} />
      )}
    </div>
  );
}
