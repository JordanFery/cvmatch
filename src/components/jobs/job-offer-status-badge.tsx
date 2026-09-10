import { Badge } from "@/components/ui/badge";

const labels: Record<string, string> = {
  PROCESSING: "Analyse en cours",
  READY: "Prêt",
  FAILED: "Échec",
};

const variants: Record<string, "success" | "warning" | "destructive"> = {
  PROCESSING: "warning",
  READY: "success",
  FAILED: "destructive",
};

export function JobOfferStatusBadge({ status }: { status: string }) {
  return <Badge variant={variants[status] ?? "warning"}>{labels[status] ?? status}</Badge>;
}
