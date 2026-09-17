import { Crown, Pencil } from "lucide-react";
import type { ParsedCv } from "@/lib/validations/cv";
import { toggleCvFavoriteAction } from "@/lib/actions/cv";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CvStatusBadge } from "@/components/cv/cv-status-badge";
import { ButtonLink } from "@/components/ui/button-link";
import { DeleteCvDialog } from "@/components/cv/delete-cv-dialog";
import { DownloadOriginalButton } from "@/components/cv/download-original-button";
import { DownloadPdfButton } from "@/components/cv/download-pdf-button";
import { SetMasterButton } from "@/components/cv/set-master-button";
import { FavoriteButton } from "@/components/ui/favorite-button";

function skillsCount(skills: ParsedCv["skills"]) {
  return Object.values(skills).reduce((total, list) => total + list.length, 0);
}

export function CvLibraryCard({
  cv,
}: {
  cv: {
    id: string;
    name: string;
    status: string;
    isMaster: boolean;
    isFavorite: boolean;
    storagePath: string | null;
    updatedAt: Date;
    parsedData: ParsedCv;
  };
}) {
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            {cv.isMaster && <Crown className="size-4 shrink-0 fill-foreground text-foreground" aria-hidden="true" />}
            {cv.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            {cv.isMaster && <Badge>Maître</Badge>}
            <CvStatusBadge status={cv.status} />
            <FavoriteButton id={cv.id} isFavorite={cv.isFavorite} action={toggleCvFavoriteAction} label="favori" />
          </div>
        </div>
        <CardDescription>Mis à jour le {dateFormatter.format(cv.updatedAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-2xl font-semibold">{cv.parsedData.experiences.length}</p>
            <p className="text-sm text-muted-foreground">Expériences</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{cv.parsedData.education.length}</p>
            <p className="text-sm text-muted-foreground">Formations</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{skillsCount(cv.parsedData.skills)}</p>
            <p className="text-sm text-muted-foreground">Compétences</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{cv.parsedData.projects.length}</p>
            <p className="text-sm text-muted-foreground">Projets</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <ButtonLink href={`/dashboard/cv/${cv.id}`} size="sm">
          <Pencil className="size-4" aria-hidden="true" />
          Modifier
        </ButtonLink>
        {!cv.isMaster && cv.status === "READY" && <SetMasterButton cvId={cv.id} />}
        {cv.status === "READY" && <DownloadPdfButton href={`/api/cv/${cv.id}/pdf`} />}
        {cv.storagePath && <DownloadOriginalButton cvId={cv.id} />}
        <DeleteCvDialog cvId={cv.id} />
      </CardFooter>
    </Card>
  );
}
