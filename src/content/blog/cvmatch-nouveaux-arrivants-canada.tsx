import Link from "next/link";

export function CvmatchNouveauxArrivantsCanada() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Vous venez d&apos;arriver au Canada et vous cherchez un emploi ? Vous gérez déjà beaucoup de choses en même
        temps — un nouveau logement, de nouveaux repères, parfois une nouvelle langue au quotidien — et la recherche
        d&apos;emploi s&apos;ajoute à tout ça, avec des codes que vous ne connaissez pas encore. CVMatch a été pensé
        pour enlever une partie de cette charge, pas pour l&apos;ajouter.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce qui rend cette recherche d&apos;emploi différente</h2>
        <p>
          Chercher un emploi dans un pays qu&apos;on connaît depuis toujours et chercher un emploi en arrivant sont
          deux exercices très différents. Vous avez probablement déjà un CV solide — mais formaté selon les codes
          d&apos;un autre pays. Vous ne savez pas forcément ce qu&apos;un recruteur canadien attend de voir, ni ce
          qu&apos;il faut retirer. Vous n&apos;avez pas encore de réseau local pour obtenir des recommandations.
          Et souvent, chaque semaine compte davantage que pour quelqu&apos;un déjà installé. Dans ce contexte, un CV
          mal adapté ou une candidature mal ciblée coûtent plus cher qu&apos;ailleurs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce que CVMatch fait concrètement pour vous</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Votre CV existant, peu importe son origine, devient exploitable en
            quelques secondes.</strong> Importez le CV que vous avez déjà — dans son format d&apos;origine — et
            CVMatch en extrait automatiquement le contenu structuré. Pas besoin de tout retaper à la main pour
            commencer.
          </li>
          <li>
            <strong className="text-foreground">Un score de compatibilité ATS pour chaque offre</strong>, au lieu
            de deviner si votre profil correspond. La plupart des recruteurs canadiens utilisent un logiciel de tri
            avant même de lire une candidature — un système que peu de pays utilisent de la même façon.
          </li>
          <li>
            <strong className="text-foreground">Un CV adapté à chaque offre, généré automatiquement</strong>,
            reformulé avec le vocabulaire et les intitulés de poste réellement utilisés ici — sans jamais inventer
            une expérience que vous n&apos;avez pas.
          </li>
          <li>
            <strong className="text-foreground">Disponible en français et en anglais</strong>, utile dans un marché
            où le choix de la langue dépend de l&apos;entreprise, du secteur et de la région — voir notre article sur{" "}
            <Link href="/fr/blog/cv-francais-vs-anglais-canada" className="font-medium underline underline-offset-4">
              le choix de la langue pour postuler au Canada
            </Link>
            .
          </li>
          <li>
            <strong className="text-foreground">Un suivi centralisé de vos candidatures</strong>, pour ne rien
            perdre quand vous postulez à plusieurs offres en même temps dans un marché que vous découvrez encore.
          </li>
        </ul>
        <p>
          Pour le détail complet de ce qui change dans la mise en forme elle-même — ce qu&apos;il faut retirer,
          ajouter, ou présenter différemment — notre article{" "}
          <Link href="/fr/blog/cv-nouvel-arrivant-canada" className="font-medium underline underline-offset-4">
            CV de nouvel arrivant au Canada
          </Link>{" "}
          couvre chaque section en détail.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce que CVMatch ne fait pas</h2>
        <p>
          CVMatch ne remplace pas une démarche de reconnaissance de diplôme ou d&apos;équivalence professionnelle —
          c&apos;est une démarche administrative séparée, à mener en parallèle. L&apos;outil ne soumet pas non plus
          vos candidatures à votre place : il prépare le CV et vous indique où postuler, mais l&apos;envoi final se
          fait toujours sur le site de l&apos;employeur. Et bien sûr, aucun outil ne garantit un emploi — CVMatch
          vous aide à présenter votre profil le mieux possible, le reste dépend de votre parcours et du marché.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Essayez notre{" "}
          <Link href="/fr/tools/ats-score" className="font-medium underline underline-offset-4">
            vérificateur ATS gratuit
          </Link>{" "}
          sans créer de compte, ou{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>{" "}
          pour importer votre CV et commencer.
        </p>
      </div>
    </div>
  );
}
