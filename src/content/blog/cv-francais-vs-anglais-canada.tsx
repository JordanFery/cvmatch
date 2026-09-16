import Link from "next/link";

export function CvFrancaisVsAnglaisCanada() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Postuler au Québec ou ailleurs au Canada pose une question que peu d&apos;autres marchés posent aussi
        directement : dans quelle langue envoyer son CV ? La réponse dépend moins de vos préférences que de
        l&apos;entreprise, du secteur et parfois de la région.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce n&apos;est pas qu&apos;une traduction</h2>
        <p>
          Un CV en anglais et un CV en français ne se structurent pas toujours de la même façon. Les intitulés de
          poste standards diffèrent (« Chargé de projet » ne se traduit pas littéralement en anglais nord-américain
          — on écrira plutôt « Project Coordinator » ou « Project Manager » selon le niveau réel de responsabilité),
          et certaines conventions de mise en page varient aussi selon la culture de recrutement visée.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Quelques repères pour trancher</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">L&apos;offre est rédigée en anglais</strong> → répondez en anglais,
            même à Montréal — c&apos;est souvent un signal que l&apos;environnement de travail l&apos;est aussi.
          </li>
          <li>
            <strong className="text-foreground">Organisme public ou parapublic au Québec</strong> → le français est
            généralement attendu, parfois exigé par la Charte de la langue française.
          </li>
          <li>
            <strong className="text-foreground">Entreprise multinationale ou tech avec des équipes hors Québec</strong>{" "}
            → un CV bilingue (deux versions distinctes, pas une seule traduite mot à mot) maximise vos chances.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">L&apos;erreur la plus fréquente</h2>
        <p>
          Faire traduire son CV littéralement — souvent via un traducteur automatique généraliste — produit des
          intitulés de poste et des tournures qui sonnent étrangement pour un recruteur nord-américain. Un CV
          « recréé » dans l&apos;autre langue, avec le vocabulaire réellement utilisé dans ce marché, se distingue
          nettement d&apos;un CV traduit mot à mot.
        </p>
        <p>
          C&apos;est une situation où adapter son CV à l&apos;offre — pas seulement dans le contenu, mais dans la
          langue et le vocabulaire du marché visé — fait une vraie différence. C&apos;est exactement ce que CVMatch
          permet de faire à partir de votre CV maître, pour chaque offre, dans la langue qu&apos;elle demande.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Adaptez votre CV à la bonne langue et à la bonne offre :{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
