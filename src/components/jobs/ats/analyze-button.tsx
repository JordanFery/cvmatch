"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { analyzeJobOfferAction } from "@/lib/actions/ats-analysis";
import { Button } from "@/components/ui/button";
import { AI_MESSAGES, AiLoadingHint } from "@/components/ui/ai-loading";

export function AnalyzeButton({ jobOfferId, label }: { jobOfferId: string; label: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await analyzeJobOfferAction(jobOfferId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <Button type="button" onClick={onClick} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Sparkles className="size-4" aria-hidden="true" />
            {label}
          </>
        )}
      </Button>
      {isPending && <AiLoadingHint messages={AI_MESSAGES.ats} />}
    </div>
  );
}
