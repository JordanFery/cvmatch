import Link from "next/link";

export function RelancerUnRecruteurApresUneCandidature() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Relancer fait souvent peur : peur de déranger, peur de paraître impatient, peur que le silence signifie déjà
        un refus. Dans la majorité des cas, une relance bien faite ne coûte rien et peut faire toute la différence —
        beaucoup de candidatures se perdent simplement dans le volume que reçoit un recruteur.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Quand relancer</h2>
        <p>
          Une à deux semaines après l&apos;envoi d&apos;une candidature, en l&apos;absence de réponse, est un délai
          raisonnable pour la plupart des postes. Si l&apos;offre précisait un échéancier de réponse, attendez qu&apos;il
          soit dépassé de quelques jours avant de relancer.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Comment relancer sans paraître insistant</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Restez bref</strong> — trois ou quatre phrases suffisent : rappel du
            poste, réaffirmation de l&apos;intérêt, question simple sur l&apos;état d&apos;avancement.
          </li>
          <li>
            <strong className="text-foreground">Une seule relance, pas plusieurs</strong> — au-delà d&apos;un
            rappel, une seconde relance sans réponse envoie un signal contraire à celui recherché.
          </li>
          <li>
            <strong className="text-foreground">Le même canal que la candidature initiale</strong> — répondre au
            fil existant plutôt que d&apos;ouvrir un nouveau message évite au recruteur de devoir retrouver le
            contexte.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Le vrai obstacle : se souvenir de relancer</h2>
        <p>
          Le problème n&apos;est généralement pas de savoir comment relancer, mais de s&apos;en souvenir au bon
          moment, surtout avec plusieurs candidatures actives en parallèle. Sans un suivi centralisé, la plupart des
          relances qui auraient dû partir ne partent tout simplement jamais.
        </p>
        <p>
          Garder une vue d&apos;ensemble sur la date d&apos;envoi et le statut de chaque candidature — ce que permet
          le suivi de CVMatch — rend ces relances beaucoup plus faciles à ne pas oublier.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Ne perdez plus le fil de vos candidatures :{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
