"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToggleResult = { error: string } | { success: true; isFavorite: boolean };

/**
 * `action` must be passed as a direct reference to a `"use server"` export
 * (e.g. `toggleCvFavoriteAction`), never wrapped in an inline arrow function
 * — Server Components can only forward Server Action references across the
 * boundary to a Client Component, not ad hoc closures that capture other
 * values. `id` is threaded through separately so the caller never needs to
 * wrap anything.
 */
export function FavoriteButton<T>({
  id,
  isFavorite,
  action,
  label = "favori",
  className,
}: {
  id: T;
  isFavorite: boolean;
  action: (id: T) => Promise<ToggleResult>;
  label?: string;
  className?: string;
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    const previous = favorite;
    setFavorite(!previous);
    startTransition(async () => {
      const result = await action(id);
      if ("error" in result) {
        setFavorite(previous);
        toast.error(result.error);
        return;
      }
      setFavorite(result.isFavorite);
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      disabled={isPending}
      aria-pressed={favorite}
      aria-label={favorite ? `Retirer des ${label}s` : `Ajouter aux ${label}s`}
      className={cn("shrink-0", className)}
    >
      <Star
        className={cn("size-4", favorite ? "fill-amber-400 text-amber-500" : "text-muted-foreground")}
        aria-hidden="true"
      />
    </Button>
  );
}
