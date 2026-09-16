import Link from "next/link";

export function IaEtCvCeQuilFautSavoir() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Utiliser l&apos;intelligence artificielle pour son CV suscite autant d&apos;enthousiasme que de méfiance —
        souvent avec raison. Voici ce qui distingue un usage utile d&apos;un usage qui peut se retourner contre vous.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Le vrai risque : l&apos;invention</h2>
        <p>
          Le problème n&apos;est pas l&apos;IA elle-même, c&apos;est ce qu&apos;on lui demande de faire. Un outil mal
          conçu (ou un prompt mal formulé) peut « enrichir » une expérience au point d&apos;inventer une
          responsabilité, une compétence ou une réalisation qui n&apos;a jamais existé. Ça se voit rarement sur le
          CV — ça se voit en entretien, quand on vous demande de détailler ce que vous avez soi-disant fait.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce que l&apos;IA fait réellement bien</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Reformuler</strong> une expérience réelle avec un vocabulaire plus
            précis ou mieux aligné sur une offre.
          </li>
          <li>
            <strong className="text-foreground">Prioriser</strong> — faire remonter les éléments les plus pertinents
            pour un poste précis parmi tout votre parcours.
          </li>
          <li>
            <strong className="text-foreground">Détecter des écarts</strong> — repérer qu&apos;un mot-clé important
            de l&apos;offre n&apos;apparaît nulle part dans votre CV, alors qu&apos;il correspond à quelque chose que
            vous avez réellement fait.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Une question simple pour trancher</h2>
        <p>
          Avant d&apos;accepter une suggestion générée par IA sur votre CV, une question suffit :{" "}
          <em>pourrais-je en parler quinze minutes en entretien sans hésiter ?</em> Si la réponse est non, ce
          n&apos;est pas une reformulation, c&apos;est une invention — et ça vaut la peine de la retirer avant
          d&apos;envoyer.
        </p>
        <p>
          C&apos;est le principe sur lequel repose CVMatch : l&apos;IA adapte, priorise et signale les écarts avec
          une offre, mais ne fabrique jamais une expérience que vous n&apos;avez pas. Le contrôle final reste
          toujours le vôtre.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Voyez la différence par vous-même :{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>{" "}
          et testez l&apos;adaptation de CV sur une offre réelle.
        </p>
      </div>
    </div>
  );
}
