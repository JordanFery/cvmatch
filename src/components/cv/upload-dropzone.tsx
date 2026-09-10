"use client";

import { useEffect, useRef, useState, useTransition, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, FileText, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { uploadCvAction } from "@/lib/actions/cv";
import { ALLOWED_CV_MIME_TYPES, MAX_CV_FILE_SIZE } from "@/lib/validations/cv";
import { Button } from "@/components/ui/button";
import { AI_MESSAGES, AiLoadingHint } from "@/components/ui/ai-loading";
import { cn } from "@/lib/utils";

const STEPS = ["Fichier importé", "Texte extrait", "Analyse du contenu", "Vérification"];

export function UploadDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isPending) return;
    // Backend does upload -> extraction -> LLM parsing in one call; this just
    // gives the user a sense of progress while that request is in flight.
    const timers = [
      setTimeout(() => setStepIndex(1), 600),
      setTimeout(() => setStepIndex(2), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isPending]);

  const submitFile = (file: File) => {
    setError(null);

    if (!Object.keys(ALLOWED_CV_MIME_TYPES).includes(file.type)) {
      setError("Format non supporté. Seuls les fichiers PDF et DOCX sont acceptés.");
      return;
    }
    if (file.size > MAX_CV_FILE_SIZE) {
      setError("Le fichier dépasse la taille maximale autorisée (10 Mo).");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    setStepIndex(0);

    startTransition(async () => {
      const result = await uploadCvAction(formData);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setStepIndex(3);
      router.push(`/dashboard/cv/review?cv=${result.cvId}`);
    });
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) submitFile(file);
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-muted/30 px-6 py-16 text-center">
        <div className="relative flex size-14 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-foreground/10" />
          <span className="relative flex size-14 items-center justify-center rounded-full bg-foreground text-background">
            <Sparkles className="size-6 animate-bounce" aria-hidden="true" />
          </span>
        </div>
        <div>
          <p className="font-medium">Analyse de votre CV...</p>
          <AiLoadingHint messages={AI_MESSAGES.cv} className="mt-1" />
        </div>
        <ul className="space-y-2 text-sm">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              {index < stepIndex ? (
                <Check className="size-4 text-foreground" aria-hidden="true" />
              ) : index === stepIndex ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" />
              ) : (
                <span className="size-4 rounded-full border border-border" aria-hidden="true" />
              )}
              <span className={index <= stepIndex ? "text-foreground" : "text-muted-foreground"}>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center gap-4 rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors",
          isDragging ? "border-foreground bg-muted/50" : "border-border",
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <UploadCloud className="size-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium">Déposez votre CV ici</p>
          <p className="mt-1 text-sm text-muted-foreground">PDF ou DOCX, 10 Mo maximum</p>
        </div>
        <Button type="button" onClick={() => inputRef.current?.click()}>
          <FileText className="size-4" aria-hidden="true" />
          Choisir un fichier
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) submitFile(file);
          }}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
