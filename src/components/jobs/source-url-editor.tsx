"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Link2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateSourceUrlAction } from "@/lib/actions/job-offer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SourceUrlEditor({ jobOfferId, sourceUrl }: { jobOfferId: string; sourceUrl: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(sourceUrl ?? "");
  const [savedUrl, setSavedUrl] = useState(sourceUrl);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    startTransition(async () => {
      const result = await updateSourceUrlAction(jobOfferId, value);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setSavedUrl(value.trim() || null);
      setEditing(false);
      router.refresh();
    });
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          autoFocus
          type="url"
          placeholder="https://..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-8 max-w-sm text-sm"
        />
        <Button type="button" size="sm" onClick={onSave} disabled={isPending}>
          {isPending ? "..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
          Annuler
        </Button>
      </div>
    );
  }

  if (!savedUrl) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
        <Link2 className="size-4" aria-hidden="true" />
        Ajouter le lien de l&apos;offre
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <a
        href={savedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
      >
        Voir l&apos;annonce d&apos;origine
        <ExternalLink className="size-3.5" aria-hidden="true" />
      </a>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Modifier le lien"
        onClick={() => setEditing(true)}
      >
        <Pencil className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}
