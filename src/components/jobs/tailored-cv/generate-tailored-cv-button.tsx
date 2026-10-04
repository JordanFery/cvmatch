"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateTailoredCvAction } from "@/lib/actions/tailored-cv";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AI_MESSAGES, AiLoadingHint } from "@/components/ui/ai-loading";
import { CREDIT_COSTS } from "@/lib/billing/plans";
import type { Locale } from "@/lib/i18n/config";

const COST = CREDIT_COSTS.TAILORED_CV;

const LANGUAGE_LABELS: Record<Locale, string> = { fr: "Français", en: "Anglais" };

export function GenerateTailoredCvButton({
  jobOfferId,
  label,
  defaultLanguage = "fr",
}: {
  jobOfferId: string;
  label: string;
  defaultLanguage?: Locale;
}) {
  const router = useRouter();
  const [language, setLanguage] = useState<Locale>(defaultLanguage);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await generateTailoredCvAction(jobOfferId, language);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={language} onValueChange={(value) => value && setLanguage(value as Locale)} disabled={isPending}>
          <SelectTrigger size="sm" aria-label="Langue du CV adapté" className="w-32">
            <SelectValue>{(current: Locale | null) => (current ? LANGUAGE_LABELS[current] : "")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">{LANGUAGE_LABELS.fr}</SelectItem>
            <SelectItem value="en">{LANGUAGE_LABELS.en}</SelectItem>
          </SelectContent>
        </Select>

        <Button type="button" onClick={onClick} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Génération en cours...
            </>
          ) : (
            <>
              <Wand2 className="size-4" aria-hidden="true" />
              {label}
            </>
          )}
        </Button>
      </div>
      {isPending ? (
        <AiLoadingHint messages={AI_MESSAGES.tailoredCv} />
      ) : (
        <p className="text-xs text-muted-foreground">
          Coûte {COST} crédit{COST > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
