import { Building2, MapPin } from "lucide-react";
import { toggleJobOfferFavoriteAction } from "@/lib/actions/job-offer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { JobOfferStatusBadge } from "@/components/jobs/job-offer-status-badge";
import { DeleteJobOfferDialog } from "@/components/jobs/delete-job-offer-dialog";

export function JobOfferCard({
  offer,
}: {
  offer: {
    id: string;
    title: string;
    company: string | null;
    location: string | null;
    status: string;
    isFavorite: boolean;
    keySkills: unknown;
    updatedAt: Date;
  };
}) {
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
  const skills = Array.isArray(offer.keySkills) ? (offer.keySkills as string[]) : [];

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-medium">{offer.title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {offer.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="size-3.5" aria-hidden="true" />
                  {offer.company}
                </span>
              )}
              {offer.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {offer.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <JobOfferStatusBadge status={offer.status} />
            <FavoriteButton
              id={offer.id}
              isFavorite={offer.isFavorite}
              action={toggleJobOfferFavoriteAction}
              label="favori"
            />
          </div>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 6).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
            {skills.length > 6 && <Badge variant="secondary">+{skills.length - 6}</Badge>}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <p className="text-xs text-muted-foreground">Mis à jour le {dateFormatter.format(offer.updatedAt)}</p>
          <div className="flex items-center gap-2">
            <DeleteJobOfferDialog jobOfferId={offer.id} />
            <ButtonLink href={`/dashboard/jobs/${offer.id}`} variant="outline" size="sm">
              Voir l&apos;offre
            </ButtonLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
