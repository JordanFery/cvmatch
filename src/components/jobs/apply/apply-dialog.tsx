"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ExternalLink, FileText, Send } from "lucide-react";
import { toast } from "sonner";
import { applyToJobOfferAction } from "@/lib/actions/application";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type CvChoice = "TAILORED" | "MASTER";

type PriorApplication = {
  id: string;
  title: string;
  appliedAt: Date | null;
  applicationStatus: string;
};

export function ApplyDialog({
  jobOfferId,
  company,
  sourceUrl,
  hasMasterCv,
  hasTailoredCv,
  masterCvHref,
  tailoredCvHref,
  priorApplications = [],
}: {
  jobOfferId: string;
  company?: string | null;
  sourceUrl: string | null;
  hasMasterCv: boolean;
  hasTailoredCv: boolean;
  masterCvHref: string;
  tailoredCvHref: string;
  priorApplications?: PriorApplication[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"choose" | "done">("choose");
  const [choice, setChoice] = useState<CvChoice>(hasTailoredCv ? "TAILORED" : "MASTER");
  const [isPending, startTransition] = useTransition();
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

  const chosenHref = choice === "TAILORED" ? tailoredCvHref : masterCvHref;

  const onConfirm = () => {
    startTransition(async () => {
      const result = await applyToJobOfferAction(jobOfferId, choice);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setStep("done");
      for (const badge of result.newBadges) {
        toast.success(`Badge débloqué : ${badge.name}`, { description: badge.description });
      }
      router.refresh();
    });
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setStep("choose");
  };

  if (!hasMasterCv) {
    return (
      <Button type="button" disabled title="Importez d'abord votre CV">
        <Send className="size-4" aria-hidden="true" />
        Postuler à cette offre
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        <Send className="size-4" aria-hidden="true" />
        Postuler à cette offre
      </DialogTrigger>
      <DialogContent>
        {step === "choose" ? (
          <>
            <DialogHeader>
              <DialogTitle>Postuler à cette offre</DialogTitle>
              <DialogDescription>
                CVMatch ne soumet pas votre candidature à votre place — chaque site de candidature est
                différent. Choisissez votre CV, on ouvre l&apos;offre et votre CV prêts à l&apos;emploi, et on
                marque la candidature comme envoyée pour vous.
              </DialogDescription>
            </DialogHeader>

            {priorApplications.length > 0 && (
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-500" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    Vous avez déjà postulé chez {company} pour {priorApplications.length > 1 ? "ces postes" : "ce poste"} :
                  </p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {priorApplications.map((app) => (
                      <li key={app.id}>
                        {app.title}
                        {app.appliedAt && ` — ${dateFormatter.format(app.appliedAt)}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <RadioGroup value={choice} onValueChange={(value) => setChoice(value as CvChoice)}>
              <label className="flex items-center gap-2 rounded-md border border-border p-3 text-sm has-data-checked:border-foreground">
                <RadioGroupItem value="TAILORED" disabled={!hasTailoredCv} />
                <span className="flex-1">
                  CV adapté à cette offre
                  {!hasTailoredCv && <span className="block text-xs text-muted-foreground">Aucun CV adapté généré pour l&apos;instant</span>}
                </span>
              </label>
              <label className="flex items-center gap-2 rounded-md border border-border p-3 text-sm has-data-checked:border-foreground">
                <RadioGroupItem value="MASTER" />
                <span>CV maître, sans modification</span>
              </label>
            </RadioGroup>

            {!sourceUrl && (
              <p className="text-sm text-muted-foreground">
                Aucun lien renseigné pour cette offre — ajoutez-en un pour pouvoir l&apos;ouvrir directement.
              </p>
            )}

            <DialogFooter>
              <Button type="button" onClick={onConfirm} disabled={isPending}>
                {isPending ? "Enregistrement..." : "Confirmer la candidature"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Candidature enregistrée</DialogTitle>
              <DialogDescription>
                Le statut de cette offre est passé à « Envoyé ». Ouvrez l&apos;offre et votre CV pour
                finaliser votre candidature sur le site de l&apos;employeur.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              {sourceUrl && (
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<a href={sourceUrl} target="_blank" rel="noopener noreferrer" />}
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Ouvrir l&apos;offre d&apos;origine
                </Button>
              )}
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href={chosenHref} target="_blank" rel="noopener noreferrer" />}
              >
                <FileText className="size-4" aria-hidden="true" />
                Voir / imprimer mon CV
              </Button>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
