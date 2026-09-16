import Link from "next/link";

export function CvReconversionProfessionnelle() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Changer de métier pose une question que peu de guides de CV abordent vraiment : comment présenter un
        parcours qui, sur papier, ne mène pas directement au poste visé ? La réponse n&apos;est pas de cacher son
        passé, mais de le raconter différemment.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Le réflexe à éviter : minimiser son ancien métier</h2>
        <p>
          Beaucoup de personnes en reconversion résument leur expérience précédente en une ligne, comme pour
          s&apos;en excuser. C&apos;est une erreur : un recruteur qui ne comprend pas d&apos;où vous venez ne peut
          pas évaluer ce que vous apportez de différent. Le bon réflexe est l&apos;inverse — expliciter clairement ce
          que ce parcours a développé, puis relier ces éléments au nouveau poste.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Identifier ce qui se transfère réellement</h2>
        <p>
          La plupart des métiers partagent plus de compétences transférables qu&apos;il n&apos;y paraît :
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Gestion de projet et coordination</strong> — présente dans
            l&apos;enseignement, la restauration, le commerce autant que dans la gestion de projet formelle.
          </li>
          <li>
            <strong className="text-foreground">Relation client et communication</strong> — un vendeur, un
            réceptionniste ou un infirmier développent tous une vraie expertise relationnelle, transférable à des
            postes très différents.
          </li>
          <li>
            <strong className="text-foreground">Résolution de problèmes sous contrainte</strong> — un métier
            opérationnel (logistique, cuisine, terrain) forme souvent mieux à ça qu&apos;un poste de bureau.
          </li>
        </ul>
        <p>
          L&apos;exercice consiste à nommer précisément ces compétences avec le vocabulaire du secteur visé, plutôt
          que de les laisser implicites dans la description de l&apos;ancien poste.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">La limite à ne pas franchir</h2>
        <p>
          Reformuler une expérience réelle avec un vocabulaire différent est légitime. Lui attribuer des
          responsabilités qu&apos;elle n&apos;avait pas ne l&apos;est pas — et se voit presque toujours en entretien,
          au premier suivi de question. La différence entre les deux : une reformulation honnête survit à
          n&apos;importe quelle question de suivi ; une exagération s&apos;effondre à la deuxième.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Une formation récente ne suffit pas toujours</h2>
        <p>
          Une certification ou une formation courte dans le nouveau domaine aide, mais un CV qui ne contient que ça
          sans relier le reste du parcours laisse un vide difficile à combler pour le recruteur. Montrer le fil
          entre ce qui a été fait avant, ce qui a été appris récemment, et ce qui est visé, raconte une histoire
          cohérente plutôt qu&apos;un recommencement à zéro.
        </p>
        <p>
          C&apos;est exactement ce que permet d&apos;objectiver l&apos;analyse ATS de CVMatch : elle indique
          précisément quelles compétences de l&apos;offre sont déjà couvertes par votre parcours réel, formulées ou
          non dans votre CV actuel — un repère utile pour savoir quoi reformuler en priorité.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Voyez ce qui, dans votre parcours, correspond déjà au poste visé :{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
