"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, Link2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const SCENE_DURATION_MS = 3200;
const SCENE_COUNT = 4;
const ATS_SCORE = 87;
const ACTIVE_APPLICATIONS = 12;

/**
 * A four-scene, auto-looping mockup of the actual product journey — CV
 * import, job import, ATS scoring, application tracking — inside a static
 * "browser window" frame. One consistent, clearly-fictional storyline runs
 * through all four scenes (same candidate, same TechCorp posting reappears
 * in the ATS scene and again — now at "Entretien" — in the tracking list)
 * so it reads as one coherent journey rather than four disconnected mockups.
 * Not a video: pure CSS/React animation, so it never goes stale when the
 * app's UI changes and costs nothing to load or serve.
 */
export function HeroShowcase({ dict }: { dict: Dictionary }) {
  const s = dict.heroShowcase;
  const scenes = [s.cv.tabLabel, s.job.tabLabel, s.ats.tabLabel, s.tracking.tabLabel];
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        timer = setInterval(() => {
          setActive((current) => {
            const next = (current + 1) % SCENE_COUNT;
            if (next === 0) setCycle((c) => c + 1);
            return next;
          });
        }, SCENE_DURATION_MS);
      },
      { threshold: 0.4 },
    );
    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="mx-auto mt-16 w-full max-w-2xl">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
          <Circle className="size-2.5 fill-muted-foreground/30 text-muted-foreground/30" aria-hidden="true" />
          <Circle className="size-2.5 fill-muted-foreground/30 text-muted-foreground/30" aria-hidden="true" />
          <Circle className="size-2.5 fill-muted-foreground/30 text-muted-foreground/30" aria-hidden="true" />
          <span className="ml-2 text-xs text-muted-foreground">{scenes[active]}</span>
        </div>
        <div className="h-72 overflow-hidden p-6">
          <div key={`${active}-${cycle}`} className="h-full">
            {active === 0 && <CvScene dict={s.cv} />}
            {active === 1 && <JobScene dict={s.job} />}
            {active === 2 && <AtsScene dict={s.ats} />}
            {active === 3 && <TrackingScene dict={s.tracking} />}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {scenes.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            aria-label={label}
            aria-current={i === active}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function CvScene({ dict }: { dict: Dictionary["heroShowcase"]["cv"] }) {
  return (
    <div className="flex h-full flex-col justify-center space-y-4">
      <div className="animate-in fade-in slide-in-from-bottom-1 space-y-0.5 duration-500 fill-mode-both">
        <p className="text-sm font-semibold">{dict.name}</p>
        <p className="text-xs text-muted-foreground">{dict.title}</p>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-1 space-y-1 delay-150 duration-500 fill-mode-both">
        <p className="text-xs font-medium text-muted-foreground">{dict.experienceLabel}</p>
        <p className="text-sm">{dict.experience1}</p>
        <p className="text-sm text-muted-foreground">{dict.experience2}</p>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-1 space-y-1.5 delay-300 duration-500 fill-mode-both">
        <p className="text-xs font-medium text-muted-foreground">{dict.skillsLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge>React</Badge>
          <Badge>TypeScript</Badge>
          <Badge>Node.js</Badge>
        </div>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-1 flex items-center gap-1.5 text-xs text-success delay-[450ms] duration-500 fill-mode-both">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        {dict.doneLabel}
      </div>
    </div>
  );
}

function JobScene({ dict }: { dict: Dictionary["heroShowcase"]["job"] }) {
  return (
    <div className="flex h-full flex-col justify-center space-y-4">
      <div className="animate-in fade-in slide-in-from-bottom-1 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground duration-500 fill-mode-both">
        <Link2 className="size-3.5 shrink-0" aria-hidden="true" />
        {dict.pasteLabel}
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-1 space-y-2 rounded-lg border border-border p-3 delay-150 duration-500 fill-mode-both">
        <p className="text-sm font-medium">{dict.jobTitle}</p>
        <p className="text-sm text-muted-foreground">{dict.jobCompany}</p>
        <p className="text-xs text-muted-foreground">{dict.jobLocation}</p>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-1 flex items-center gap-1.5 text-xs text-success delay-300 duration-500 fill-mode-both">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        {dict.doneLabel}
      </div>
    </div>
  );
}

function AtsScene({ dict }: { dict: Dictionary["heroShowcase"]["ats"] }) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScore((current) => (current >= ATS_SCORE ? current : current + 3));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full flex-col justify-center space-y-5">
      <p className="animate-in fade-in text-xs text-muted-foreground duration-500 fill-mode-both">{dict.subtitle}</p>
      <div className="animate-in fade-in flex items-center gap-4 duration-500 fill-mode-both">
        <span className="text-3xl font-semibold tabular-nums text-success">{score}%</span>
        <Progress value={score} className="flex-1" indicatorClassName="bg-success" />
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-1 space-y-1.5 delay-150 duration-500 fill-mode-both">
        <p className="text-sm font-medium">{dict.matchedLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge>React</Badge>
          <Badge>TypeScript</Badge>
          <Badge>Tailwind CSS</Badge>
        </div>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-1 space-y-1.5 delay-300 duration-500 fill-mode-both">
        <p className="text-sm font-medium">{dict.missingLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">GraphQL</Badge>
        </div>
      </div>
    </div>
  );
}

function TrackingScene({ dict }: { dict: Dictionary["heroShowcase"]["tracking"] }) {
  const [count, setCount] = useState(0);
  const rows: { company: string; label: string; variant: "success" | "warning" | "outline" }[] = [
    { company: dict.company1, label: dict.statusInterview, variant: "success" },
    { company: dict.company2, label: dict.statusReplied, variant: "warning" },
    { company: dict.company3, label: dict.statusSent, variant: "outline" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((current) => (current >= ACTIVE_APPLICATIONS ? current : current + 1));
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full flex-col justify-center space-y-4">
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={row.company}
            className="animate-in fade-in slide-in-from-bottom-1 flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 duration-500 fill-mode-both"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <span className="text-sm">{row.company}</span>
            <Badge variant={row.variant}>{row.label}</Badge>
          </div>
        ))}
      </div>
      <div className="animate-in fade-in flex items-center gap-1.5 text-xs text-muted-foreground delay-[450ms] duration-500 fill-mode-both">
        <TrendingUp className="size-3.5" aria-hidden="true" />
        {count} {dict.activeLabel}
      </div>
    </div>
  );
}
