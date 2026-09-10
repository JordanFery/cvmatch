"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyLetterButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier la lettre.");
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      {copied ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          Copié
        </>
      ) : (
        <>
          <Copy className="size-4" aria-hidden="true" />
          Copier
        </>
      )}
    </Button>
  );
}
