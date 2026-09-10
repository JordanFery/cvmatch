import type { Metadata } from "next";
import { getUserBadges } from "@/lib/data/badges";
import { BadgeCard } from "@/components/badges/badge-card";
import { PageHeader } from "@/components/ui/page-header";
import { BADGE_CATEGORY_LABELS, BADGE_CATEGORY_ORDER } from "@/lib/badges/catalog";

export const metadata: Metadata = { title: "Récompenses" };

export default async function BadgesPage() {
  const badges = await getUserBadges();
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Récompenses"
        description={`${earnedCount} / ${badges.length} badges débloqués. Continuez à utiliser CVMatch pour en débloquer d'autres — les paliers les plus élevés offrent des crédits bonus, et à terme un mois gratuit.`}
      />

      {BADGE_CATEGORY_ORDER.map((category) => {
        const items = badges.filter((b) => b.badge.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category} className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">{BADGE_CATEGORY_LABELS[category]}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((view) => (
                <BadgeCard key={view.badge.id} view={view} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
