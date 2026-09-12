import Link from "next/link";

export function QuestCeQuUnAts() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Si vous cherchez un emploi en 2026, il y a de fortes chances que votre CV ne soit jamais lu par un humain
        avant d&apos;avoir été trié par un logiciel. Ce logiciel s&apos;appelle un ATS —{" "}
        <em>Applicant Tracking System</em>, ou système de suivi des candidatures. Comprendre comment il fonctionne
        change radicalement la façon dont on devrait construire un CV.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Un ATS, concrètement, à quoi ça sert ?</h2>
        <p>
          Dès qu&apos;une entreprise reçoit plus qu&apos;une poignée de candidatures pour un poste, il devient
          impossible de toutes les lire manuellement. Un ATS centralise les candidatures, en extrait les
          informations clés (expérience, compétences, diplômes, coordonnées), puis les classe ou les filtre selon
          les critères du poste. Certains recruteurs configurent des filtres stricts — les candidatures qui ne
          contiennent pas certains mots-clés obligatoires sont automatiquement écartées, sans qu&apos;un humain ne
          les voie jamais.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce qui perturbe un ATS</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Les mises en page complexes</strong> — colonnes multiples, tableaux,
            zones de texte, en-têtes/pieds de page contenant des informations importantes. Beaucoup d&apos;ATS
            extraient le texte dans le désordre ou perdent carrément certaines sections.
          </li>
          <li>
            <strong className="text-foreground">Les intitulés de poste trop créatifs</strong> — « Ninja du
            développement » sera rarement reconnu comme équivalent à « Développeur logiciel » par un système de
            correspondance automatique.
          </li>
          <li>
            <strong className="text-foreground">L&apos;absence des mots-clés de l&apos;offre</strong> — un ATS (ou
            le recruteur qui configure sa recherche) cherche souvent des termes précis tirés de l&apos;annonce :
            noms d&apos;outils, certifications, méthodologies. S&apos;ils n&apos;apparaissent nulle part dans le CV,
            même sous une formulation équivalente, la candidature perd des points.
          </li>
          <li>
            <strong className="text-foreground">Les formats non standards</strong> — un CV en image, en PDF scanné,
            ou dans un fichier que l&apos;ATS ne sait pas parser correctement, peut tout simplement arriver vide côté
            recruteur.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Passer le filtre ne suffit pas</h2>
        <p>
          Un CV compatible ATS qui obtient un bon score n&apos;est que la première étape : il doit ensuite convaincre
          un humain. L&apos;objectif n&apos;est donc pas de « tromper » le logiciel avec des mots-clés invisibles ou
          répétés artificiellement (une pratique que la plupart des ATS modernes détectent et pénalisent), mais
          d&apos;aligner honnêtement le vocabulaire de votre CV avec celui de l&apos;offre, à partir de votre vraie
          expérience.
        </p>
        <p>
          C&apos;est exactement ce que fait l&apos;analyse ATS de CVMatch : elle compare votre CV à une offre
          précise, indique un score de compatibilité et liste les écarts concrets à corriger — sans jamais inventer
          une compétence ou une expérience que vous n&apos;avez pas.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Envie de savoir où en est votre CV actuel ?{" "}
          <Link href="/register" className="font-medium underline underline-offset-4">
            Créez un compte gratuit
          </Link>{" "}
          et obtenez votre premier score de compatibilité ATS en quelques minutes.
        </p>
      </div>
    </div>
  );
}
