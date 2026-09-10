"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateCoverLetterAction } from "@/lib/actions/cover-letter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CoverLetterEditor({ id, initialContent }: { id: string; initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    startTransition(async () => {
      const result = await updateCoverLetterAction(id, content);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Lettre enregistrée.");
    });
  };

  return (
    <div className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        className="font-sans text-sm leading-relaxed"
      />
      <Button type="button" onClick={onSave} disabled={isPending}>
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
}
