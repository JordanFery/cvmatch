"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cycles through a list of messages every `intervalMs`, looping — used to
 * keep long AI waits entertaining instead of static. Callers always pass a
 * stable module-level array (see AI_MESSAGES below), so it never needs to
 * reset mid-mount when `messages` changes.
 */
function useRotatingMessages(messages: string[], intervalMs = 2200) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % messages.length), intervalMs);
    return () => clearInterval(timer);
  }, [messages, intervalMs]);

  return messages[index % messages.length] ?? "";
}

export const AI_MESSAGES = {
  cv: [
    "Notre IA lit votre CV ligne par ligne...",
    "Elle compte vos années d'expérience...",
    "Elle traque vos compétences cachées...",
    "Elle range tout dans le bon ordre...",
  ],
  jobOffer: [
    "Notre IA décortique cette offre d'emploi...",
    "Elle traduit le jargon RH...",
    "Elle repère les compétences clés...",
    "Presque prêt...",
  ],
  ats: [
    "Notre IA compare votre CV à l'offre...",
    "Elle traque les mots-clés manquants...",
    "Elle calcule votre score de compatibilité...",
    "Elle prépare ses recommandations...",
  ],
  tailoredCv: [
    "Notre IA adapte votre CV sur mesure...",
    "Elle met en avant vos meilleurs atouts...",
    "Elle peaufine chaque mot...",
    "Dernières retouches...",
  ],
  coverLetter: [
    "Notre IA se renseigne sur l'entreprise...",
    "Elle fouille le site officiel de l'entreprise...",
    "Elle rédige une lettre sur mesure...",
    "Dernières retouches...",
  ],
} satisfies Record<string, string[]>;

/**
 * Bouncing sparkle + rotating witty caption — a full-block replacement for
 * whatever the user was looking at, for flows that already swap their
 * entire content out while pending (CV upload, job import).
 */
export function AiLoadingCard({
  messages,
  title,
  className,
}: {
  messages: string[];
  title: string;
  className?: string;
}) {
  const message = useRotatingMessages(messages);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-foreground/10" />
        <span className="relative flex size-14 items-center justify-center rounded-full bg-foreground text-background">
          <Sparkles className="size-6 animate-bounce" aria-hidden="true" />
        </span>
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p key={message} className="mt-1 animate-in fade-in text-sm text-muted-foreground duration-500">
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Compact inline variant for buttons/sections that stay in place while
 * pending (Analyser, Générer) — a small rotating caption under the trigger
 * instead of a static "Chargement..." label.
 */
export function AiLoadingHint({ messages, className }: { messages: string[]; className?: string }) {
  const message = useRotatingMessages(messages, 2000);

  return (
    <p key={message} className={cn("animate-in fade-in text-sm text-muted-foreground duration-500", className)}>
      {message}
    </p>
  );
}
