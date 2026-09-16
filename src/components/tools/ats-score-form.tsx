"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { runPublicAtsScoreAction } from "@/lib/actions/public-tools";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import type { AtsAnalysisData } from "@/lib/validations/ats-analysis";

const COPY: Record<
  Locale,
  {
    cvLabel: string;
    cvPlaceholder: string;
    jobLabel: string;
    jobPlaceholder: string;
    submit: string;
    submitting: string;
    matchedSkills: string;
    missingSkills: string;
    strengths: string;
    gaps: string;
    recommendations: string;
    ctaText: string;
    ctaButton: string;
  }
> = {
  fr: {
    cvLabel: "Votre CV (texte)",
    cvPlaceholder: "Collez ici le contenu de votre CV…",
    jobLabel: "L'offre d'emploi (texte)",
    jobPlaceholder: "Collez ici le texte complet de l'offre…",
    submit: "Analyser mon CV",
    submitting: "Analyse en cours…",
    matchedSkills: "Compétences correspondantes",
    missingSkills: "Compétences manquantes",
    strengths: "Points forts",
    gaps: "Points à travailler",
    recommendations: "Recommandations",
    ctaText: "Pour générer un CV adapté à cette offre et suivre vos candidatures, créez un compte gratuit.",
    ctaButton: "Créer un compte gratuit",
  },
  en: {
    cvLabel: "Your resume (text)",
    cvPlaceholder: "Paste your resume content here…",
    jobLabel: "The job posting (text)",
    jobPlaceholder: "Paste the full text of the job posting here…",
    submit: "Analyze my resume",
    submitting: "Analyzing…",
    matchedSkills: "Matched skills",
    missingSkills: "Missing skills",
    strengths: "Strengths",
    gaps: "Areas to improve",
    recommendations: "Recommendations",
    ctaText: "To generate a resume tailored to this posting and track your applications, create a free account.",
    ctaButton: "Create a free account",
  },
};

function scoreTextClass(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

function scoreFillClass(score: number) {
  if (score >= 75) return "bg-success";
  if (score >= 50) return "bg-warning";
  return "bg-destructive";
}

export function AtsScoreForm({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsAnalysisData | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await runPublicAtsScoreAction(cvText, jobText, locale);
      if ("error" in res) {
        setError(res.error);
        setResult(null);
      } else {
        setResult(res.data);
      }
    });
  };

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cv-text">{t.cvLabel}</Label>
          <Textarea
            id="cv-text"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder={t.cvPlaceholder}
            rows={10}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="job-text">{t.jobLabel}</Label>
          <Textarea
            id="job-text"
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder={t.jobPlaceholder}
            rows={10}
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? t.submitting : t.submit}
        </Button>
      </form>

      {result && (
        <div className="space-y-5 rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <span className={cn("text-3xl font-semibold tabular-nums", scoreTextClass(result.score))}>
              {result.score}%
            </span>
            <Progress value={result.score} className="flex-1" indicatorClassName={scoreFillClass(result.score)} />
          </div>

          {result.summary && <p className="text-sm text-muted-foreground">{result.summary}</p>}

          {result.matchedSkills.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">{t.matchedSkills}</p>
              <div className="flex flex-wrap gap-1.5">
                {result.matchedSkills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {result.missingSkills.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">{t.missingSkills}</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missingSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {result.strengths.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">{t.strengths}</p>
              <ul className="space-y-1">
                {result.strengths.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.gaps.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">{t.gaps}</p>
              <ul className="space-y-1">
                {result.gaps.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.recommendations.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">{t.recommendations}</p>
              <ul className="space-y-1">
                {result.recommendations.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-sm text-foreground">{t.ctaText}</p>
            <ButtonLink href={localeHref(locale, "/register")} size="sm" className="mt-3">
              {t.ctaButton}
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
