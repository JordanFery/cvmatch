"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateCoverLetterAction } from "@/lib/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { AI_MESSAGES, AiLoadingHint } from "@/components/ui/ai-loading";

export function GenerateCoverLetterButton({ jobOfferId, label }: { jobOfferId: string; label: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await generateCoverLetterAction(jobOfferId);
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
            Génération en cours...
          </>
        ) : (
          <>
            <Wand2 className="size-4" aria-hidden="true" />
            {label}
          </>
        )}
      </Button>
      {isPending && <AiLoadingHint messages={AI_MESSAGES.coverLetter} />}
    </div>
  );
}
