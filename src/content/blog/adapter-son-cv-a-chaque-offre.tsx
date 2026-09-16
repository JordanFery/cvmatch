import Link from "next/link";

export function AdapterSonCvAChaqueOffre() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Envoyer le même CV à toutes les offres est le réflexe le plus naturel : c&apos;est rapide, et il faut bien
        candidater vite. C&apos;est aussi ce qui explique pourquoi tant de candidatures pourtant qualifiées ne
        reçoivent jamais de réponse.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce qui change réellement d&apos;une offre à l&apos;autre</h2>
        <p>Adapter un CV ne veut pas dire le réécrire en entier à chaque fois. Trois éléments font la majorité de la différence :</p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">L&apos;ordre et la mise en avant des expériences</strong> — les
            missions les plus pertinentes pour ce poste précis remontent en premier, ou sont détaillées davantage.
          </li>
          <li>
            <strong className="text-foreground">Le vocabulaire utilisé</strong> — reprendre les termes exacts de
            l&apos;offre (nom des outils, intitulés, méthodologies) quand ils correspondent réellement à votre
            expérience, plutôt que des synonymes qui ne « matchent » pas dans une recherche automatisée.
          </li>
          <li>
            <strong className="text-foreground">Le résumé en tête de CV</strong> — s&apos;il existe, c&apos;est
            l&apos;endroit le plus rapide pour dire explicitement en quoi votre profil répond à ce poste précis.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce qui ne doit jamais changer</h2>
        <p>
          Adapter n&apos;est pas inventer. Les dates, les titres réels de vos postes précédents, les diplômes et les
          responsabilités effectivement exercées restent identiques d&apos;une candidature à l&apos;autre. Un CV
          adapté reformule et priorise une expérience réelle — il n&apos;en crée pas une nouvelle. C&apos;est aussi
          une question de cohérence : un recruteur qui reçoit deux versions très différentes de votre parcours (par
          exemple via LinkedIn et par CV) y verra un signal négatif.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Pourquoi ça vaut le coup, même si ça prend du temps</h2>
        <p>
          Un CV générique doit plaire à tout le monde, donc il ne se démarque pour personne. Un CV adapté, même
          légèrement, montre que vous avez lu l&apos;offre et compris ce que le poste demande réellement — un signal
          simple mais qui manque à la majorité des candidatures reçues par un recruteur.
        </p>
        <p>
          Le vrai obstacle, c&apos;est le temps : réécrire un CV à la main pour chaque offre n&apos;est pas
          réaliste quand on postule à dix ou vingt postes par semaine. C&apos;est le problème que CVMatch résout —
          en générant une version de votre CV adaptée à une offre précise, à partir de votre CV maître, sans jamais
          inventer une expérience que vous n&apos;avez pas.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Essayez sur votre prochaine candidature :{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>{" "}
          et générez une version adaptée de votre CV en quelques minutes.
        </p>
      </div>
    </div>
  );
}
