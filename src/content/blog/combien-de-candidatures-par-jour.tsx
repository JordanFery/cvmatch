import Link from "next/link";

export function CombienDeCandidaturesParJour() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Il n&apos;existe pas de chiffre magique qui garantit une embauche. Mais il existe une différence nette entre
        une recherche d&apos;emploi qui avance et une recherche qui stagne, et elle tient souvent à la régularité
        plus qu&apos;au volume brut.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Pourquoi « le plus possible » n&apos;est pas la bonne stratégie</h2>
        <p>
          Envoyer 30 candidatures identiques en une soirée donne l&apos;impression d&apos;avancer vite, mais chaque
          candidature générique a statistiquement moins de chances d&apos;aboutir qu&apos;une candidature adaptée à
          l&apos;offre. Le volume ne compense pas la qualité — il la dilue, et épuise en plus la motivation sur le
          long terme.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Un repère plus réaliste</h2>
        <p>
          Beaucoup de conseillers en emploi recommandent entre 3 et 5 candidatures réellement adaptées par jour,
          plutôt qu&apos;un nombre plus élevé de candidatures génériques. Ce rythme laisse le temps de :
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>Lire l&apos;offre en entier et repérer ce qui compte vraiment pour ce poste précis</li>
          <li>Ajuster le CV et la lettre en conséquence</li>
          <li>Garder une trace claire de qui a été contacté, quand, et où en est chaque échange</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Le vrai risque : perdre le fil</h2>
        <p>
          Au-delà d&apos;une dizaine de candidatures actives, il devient difficile de se souvenir de ce qui a été
          envoyé à qui, avec quelle version du CV, et depuis combien de temps. C&apos;est souvent ce désordre — pas
          le manque de candidatures — qui fait rater une relance ou une réponse à un recruteur.
        </p>
        <p>
          Se fixer un objectif quotidien réaliste et suivre sa progression change la dynamique : c&apos;est
          exactement ce que permet le tableau de bord de CVMatch, avec un objectif de candidatures par jour et une
          vue centralisée de chaque candidature envoyée.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Structurez votre recherche :{" "}
          <Link href="/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>{" "}
          et fixez votre premier objectif quotidien.
        </p>
      </div>
    </div>
  );
}
