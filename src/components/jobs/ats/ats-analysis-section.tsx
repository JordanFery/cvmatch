import Link from "next/link";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnalyzeButton } from "@/components/jobs/ats/analyze-button";
import { cn } from "@/lib/utils";

type Analysis = {
  status: string;
  errorMessage: string | null;
  score: number | null;
  summary: string | null;
  matchedSkills: unknown;
  missingSkills: unknown;
  strengths: unknown;
  gaps: unknown;
  recommendations: unknown;
} | null;

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

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

export function AtsAnalysisSection({
  jobOfferId,
  hasMasterCv,
  analysis,
}: {
  jobOfferId: string;
  hasMasterCv: boolean;
  analysis: Analysis;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compatibilité ATS</CardTitle>
        <CardDescription>Comparez cette offre à votre CV maître.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasMasterCv ? (
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard/cv/upload" className="font-medium text-foreground hover:underline">
              Importez votre CV
            </Link>{" "}
            pour lancer une analyse de compatibilité avec cette offre.
          </p>
        ) : !analysis || analysis.status === "FAILED" ? (
          <div className="space-y-3">
            {analysis?.status === "FAILED" && (
              <p className="text-sm text-destructive">
                {analysis.errorMessage ?? "L'analyse a échoué."}
              </p>
            )}
            <AnalyzeButton jobOfferId={jobOfferId} label="Analyser la compatibilité" />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className={cn("text-3xl font-semibold tabular-nums", scoreTextClass(analysis.score ?? 0))}>
                {analysis.score}%
              </span>
              <Progress
                value={analysis.score ?? 0}
                className="flex-1"
                indicatorClassName={scoreFillClass(analysis.score ?? 0)}
              />
            </div>

            {analysis.summary && <p className="text-sm text-muted-foreground">{analysis.summary}</p>}

            {asStringArray(analysis.matchedSkills).length > 0 && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Compétences correspondantes</p>
                <div className="flex flex-wrap gap-1.5">
                  {asStringArray(analysis.matchedSkills).map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {asStringArray(analysis.missingSkills).length > 0 && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Compétences manquantes</p>
                <div className="flex flex-wrap gap-1.5">
                  {asStringArray(analysis.missingSkills).map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {asStringArray(analysis.strengths).length > 0 && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Points forts</p>
                <ul className="space-y-1">
                  {asStringArray(analysis.strengths).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {asStringArray(analysis.gaps).length > 0 && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Points à travailler</p>
                <ul className="space-y-1">
                  {asStringArray(analysis.gaps).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {asStringArray(analysis.recommendations).length > 0 && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Recommandations</p>
                <ul className="space-y-1">
                  {asStringArray(analysis.recommendations).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Lightbulb className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <AnalyzeButton jobOfferId={jobOfferId} label="Réanalyser" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
