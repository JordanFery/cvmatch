import Link from "next/link";

export function LettreDeMotivationAvecIa() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        « Je vous écris pour vous faire part de mon vif intérêt pour le poste... » — si cette phrase vous est déjà
        venue en tête en ouvrant une page blanche, vous n&apos;êtes pas seul. La lettre de motivation reste l&apos;un
        des exercices les plus redoutés d&apos;une candidature, et l&apos;IA a changé la donne — pour le meilleur et
        pour le pire.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Le problème des lettres générées trop vite</h2>
        <p>
          Un recruteur qui lit des dizaines de candidatures repère très vite une lettre générique : formulations
          creuses, aucune mention précise de l&apos;entreprise ou du poste, ton impersonnel. Demander à un
          générateur d&apos;IA générique « écris-moi une lettre de motivation pour un poste de [titre] » produit
          exactement ce résultat — techniquement correct, mais interchangeable avec n&apos;importe quel autre
          candidat.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce qui fait la différence</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Partir de votre vrai parcours</strong> — une lettre efficace relie
            une expérience réelle et précise à un besoin réel de l&apos;offre, pas une liste de qualités
            génériques.
          </li>
          <li>
            <strong className="text-foreground">Mentionner l&apos;entreprise et le poste explicitement</strong> —
            un détail tiré de l&apos;offre (un projet, une technologie, une mission précise) montre que vous
            l&apos;avez vraiment lue.
          </li>
          <li>
            <strong className="text-foreground">Rester courte</strong> — trois à quatre paragraphes suffisent ; une
            lettre trop longue signale souvent qu&apos;elle compense un manque de précision.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Le bon usage de l&apos;IA ici</h2>
        <p>
          L&apos;IA est utile pour structurer et formuler rapidement une première version — pas pour inventer une
          expérience que vous n&apos;avez pas, ni pour produire un texte interchangeable d&apos;une candidature à
          l&apos;autre. La génération de lettre de motivation de CVMatch part de votre CV réel et de l&apos;offre
          précise que vous visez, pour produire une lettre alignée sur les deux — que vous pouvez ensuite ajuster en
          quelques minutes plutôt que partir d&apos;une page blanche.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Essayez sur votre prochaine candidature :{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>{" "}
          et générez une lettre de motivation adaptée à une offre précise.
        </p>
      </div>
    </div>
  );
}
