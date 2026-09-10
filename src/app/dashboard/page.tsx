import type { Metadata } from "next";
import { Wand2, Search, Send, CalendarCheck, FileCheck2, TrendingUp, Award } from "lucide-react";
import { getCurrentProfile } from "@/lib/data/profile";
import { getMasterCv } from "@/lib/data/cv";
import {
  countSentApplications,
  countInterviews,
  countRespondedApplications,
  countTodaysSentApplications,
  getRecentApplications,
} from "@/lib/data/application";
import { countTailoredCvs } from "@/lib/data/tailored-cv";
import { countEarnedBadges } from "@/lib/data/badges";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { DailyGoalCard } from "@/components/dashboard/daily-goal-card";
import { ButtonLink } from "@/components/ui/button-link";
import { CvStatusBadge } from "@/components/cv/cv-status-badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [profile, cv, sentCount, interviewCount, respondedCount, recentApplications, sentToday, tailoredCount, badgeCounts] =
    await Promise.all([
      getCurrentProfile(),
      getMasterCv(),
      countSentApplications(),
      countInterviews(),
      countRespondedApplications(),
      getRecentApplications(5),
      countTodaysSentApplications(),
      countTailoredCvs(),
      countEarnedBadges(),
    ]);
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
  const responseRate = sentCount > 0 ? Math.round((respondedCount / sentCount) * 100) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bonjour, {profile.firstName} 👋</h1>
          <p className="mt-1 text-muted-foreground">Voici où vous en êtes dans votre recherche d&apos;emploi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={cv ? "/dashboard/cv" : "/dashboard/cv/upload"} variant="outline">
            <Wand2 className="size-4" aria-hidden="true" />
            Optimiser mon CV
          </ButtonLink>
          <ButtonLink href="/dashboard/jobs/add">
            <Search className="size-4" aria-hidden="true" />
            Trouver une offre
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Candidatures envoyées" value={sentCount} icon={Send} />
        <StatCard label="Entretiens" value={interviewCount} icon={CalendarCheck} />
        <StatCard label="Taux de réponse" value={responseRate != null ? `${responseRate}%` : "—"} icon={TrendingUp} />
        <StatCard label="CV optimisés" value={tailoredCount} icon={FileCheck2} />
      </div>

      {profile.dailyApplicationGoal != null && (
        <DailyGoalCard goal={profile.dailyApplicationGoal} sentToday={sentToday} />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{cv ? cv.name : "Votre CV principal"}</CardTitle>
              {cv && <CvStatusBadge status={cv.status} />}
            </div>
            <CardDescription>
              {cv ? `Mis à jour le ${dateFormatter.format(cv.updatedAt)}` : "Aucun CV importé"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cv ? (
              <ButtonLink href="/dashboard/cv">Voir mon CV</ButtonLink>
            ) : (
              <ButtonLink href="/dashboard/cv/upload">Importer mon CV</ButtonLink>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières candidatures</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <EmptyState
                icon={Send}
                title="Vous n'avez encore envoyé aucune candidature."
                description="Trouvez une offre pertinente pour commencer à suivre vos candidatures."
                actionLabel="Trouver une offre"
                actionHref="/dashboard/jobs"
              />
            ) : (
              <RecentApplications rows={recentApplications} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-4" aria-hidden="true" />
              Récompenses
            </CardTitle>
            <CardDescription>
              {badgeCounts.earned} / {badgeCounts.total} badges débloqués.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonLink href="/dashboard/badges" variant="outline">
              Voir mes récompenses
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
