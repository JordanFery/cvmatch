import Link from "next/link";

export function OrganiserSonSuiviDeCandidatures() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Un tableur, une boîte mail, quelques notes dans le téléphone, un onglet de navigateur ouvert par offre :
        c&apos;est le système — ou plutôt l&apos;absence de système — que beaucoup de chercheurs d&apos;emploi
        finissent par utiliser. Il fonctionne, jusqu&apos;au jour où un recruteur rappelle et où on ne se souvient
        plus de quel poste il s&apos;agit.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce qu&apos;un bon suivi doit permettre de répondre en 5 secondes</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>À qui, pour quel poste, ai-je envoyé ma candidature, et quand ?</li>
          <li>Quelle version de mon CV ai-je utilisée pour cette candidature précise ?</li>
          <li>Où en est chaque candidature — envoyée, en attente, entretien, refus ?</li>
          <li>Ai-je déjà postulé chez cette entreprise auparavant ?</li>
        </ul>
        <p>
          Si l&apos;une de ces questions demande plus de quelques secondes de réflexion, le système actuel coûte du
          temps — et parfois des occasions, quand une relance arrive trop tard ou qu&apos;une candidature part en
          double vers la même entreprise.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Le piège du doublon</h2>
        <p>
          Repostuler par erreur à une offre déjà envoyée quelques semaines plus tôt — parfois sous une référence
          différente — arrive plus souvent qu&apos;on ne le pense, surtout quand la recherche s&apos;étend sur
          plusieurs semaines. Ce n&apos;est pas grave en soi, mais ça n&apos;aide pas non plus l&apos;image renvoyée
          au recruteur.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Centraliser plutôt que jongler</h2>
        <p>
          L&apos;objectif n&apos;est pas d&apos;ajouter de la complexité à une recherche déjà prenante, mais de
          retirer la charge mentale de s&apos;en souvenir soi-même. Le suivi de candidatures de CVMatch centralise le
          statut de chaque candidature, garde la trace de la version de CV utilisée, et signale automatiquement si
          vous avez déjà postulé chez une entreprise avant de recandidater.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Reprenez le contrôle de votre recherche :{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>{" "}
          et centralisez vos candidatures en un seul endroit.
        </p>
      </div>
    </div>
  );
}
