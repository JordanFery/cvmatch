"use client";

import { useEffect, useRef, useState } from "react";
import { FileUp, Search, Wand2, Send, LineChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const icons = [FileUp, Search, Wand2, Send, LineChart];

// Time between each pastille lighting up — 5 steps means the last one
// activates at 4 * 800ms = 3.2s. One-shot reveal, no looping/restart.
const STEP_DELAY_MS = 800;

export function HowItWorksTrail({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  const containerRef = useRef<HTMLOListElement>(null);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        steps.forEach((_, i) => {
          const timer = setTimeout(() => {
            if (!cancelled) setActiveCount(i + 1);
          }, i * STEP_DELAY_MS);
          timers.push(timer);
        });
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [steps]);

  return (
    <ol
      ref={containerRef}
      className="mt-16 grid items-stretch gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
    >
      {steps.map((step, index) => {
        const Icon = icons[index];
        const isLast = index === steps.length - 1;
        const active = index < activeCount;
        const lineFilled = active;

        return (
          <li key={step.title} className="flex flex-col items-center gap-4 text-center">
            <div className="relative flex w-full justify-center">
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="absolute top-5 left-1/2 hidden h-px w-full -translate-y-1/2 bg-border lg:block"
                >
                  <div
                    className="h-full bg-primary transition-[width] ease-linear"
                    style={{
                      width: lineFilled ? "100%" : "0%",
                      transitionDuration: `${STEP_DELAY_MS}ms`,
                    }}
                  />
                </div>
              )}
              <div
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-500",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </div>
            </div>
            <Card className="w-full flex-1">
              <CardContent className="flex h-full flex-col items-center gap-2">
                <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ol>
  );
}
