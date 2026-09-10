import { Badge } from "@/components/ui/badge";

const labels: Record<string, string> = {
  UPLOADED: "Envoyé",
  PROCESSING: "Analyse en cours",
  READY: "Prêt",
  FAILED: "Échec",
};

const variants: Record<string, "success" | "warning" | "destructive"> = {
  UPLOADED: "warning",
  PROCESSING: "warning",
  READY: "success",
  FAILED: "destructive",
};

export function CvStatusBadge({ status }: { status: string }) {
  return <Badge variant={variants[status] ?? "warning"}>{labels[status] ?? status}</Badge>;
}
