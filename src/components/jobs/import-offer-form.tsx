"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Link2, TextCursorInput } from "lucide-react";
import { importJobOfferAction } from "@/lib/actions/job-offer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AI_MESSAGES, AiLoadingCard } from "@/components/ui/ai-loading";

export function ImportOfferForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await importJobOfferAction(
        mode === "text" ? { mode: "text", text } : { mode: "url", url },
      );
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.push(`/dashboard/jobs/review?job=${result.jobOfferId}`);
    });
  };

  if (isPending) {
    return <AiLoadingCard title="Analyse de l'offre..." messages={AI_MESSAGES.jobOffer} />;
  }

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(value) => setMode(value as "text" | "url")}>
        <TabsList>
          <TabsTrigger value="text">
            <TextCursorInput className="size-4" aria-hidden="true" />
            Coller le texte
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link2 className="size-4" aria-hidden="true" />
            Depuis une URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-4 space-y-2">
          <Label htmlFor="job-text">Description de l&apos;offre</Label>
          <Textarea
            id="job-text"
            rows={12}
            placeholder="Collez ici le texte complet de l'offre d'emploi..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-2">
          <Label htmlFor="job-url">Lien vers l&apos;offre</Label>
          <Input
            id="job-url"
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </TabsContent>
      </Tabs>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={onSubmit}
        disabled={mode === "text" ? text.trim().length < 50 : url.trim().length === 0}
      >
        Analyser l&apos;offre
      </Button>
    </div>
  );
}
