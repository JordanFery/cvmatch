import Link from "next/link";

export function PourquoiVotreCvEstRejeteAvantDetreLu() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Aucune réponse, pas même un refus automatique : c&apos;est souvent le signe qu&apos;une candidature a été
        écartée avant qu&apos;un humain ne la voie. Voici les raisons les plus fréquentes, et comment les repérer sur
        votre propre CV.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">1. Une mise en page que le logiciel ne sait pas lire</h2>
        <p>
          Colonnes multiples, tableaux, zones de texte, icônes remplaçant des mots — visuellement agréable pour un
          humain, souvent illisible pour un ATS qui extrait le texte dans un ordre différent de celui affiché à
          l&apos;écran. Résultat : des informations importantes (dates, titres de poste) se retrouvent mélangées ou
          disparaissent entièrement de la version que voit le recruteur.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">2. Des intitulés de poste trop éloignés du marché</h2>
        <p>
          « Architecte d&apos;expériences digitales » peut être vrai et flatteur, mais si l&apos;offre cherche un
          « Product Designer », la correspondance automatique — et le recruteur pressé qui scanne vite — risquent de
          passer à côté. Garder un intitulé standard, quitte à préciser votre spécificité juste après, aide sur les
          deux plans.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">3. Les mots-clés de l&apos;offre, absents du CV</h2>
        <p>
          Un recruteur qui filtre ses candidatures cherche souvent des termes précis : un outil, une certification,
          une méthodologie citée dans l&apos;annonce. S&apos;ils sont absents de votre CV — même si vous les
          maîtrisez, mais sous un autre nom — la candidature perd des points invisibles à l&apos;œil nu.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">4. Un fichier mal exporté</h2>
        <p>
          Un CV envoyé en image, en PDF scanné, ou généré par un outil qui produit un PDF non sélectionnable, peut
          arriver totalement vide côté ATS : aucun texte à extraire, donc aucune information à évaluer. Un simple
          test — essayer de sélectionner et copier le texte de votre propre CV — suffit à détecter ce problème.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">5. Un seul CV envoyé à toutes les offres</h2>
        <p>
          Même sans aucune des erreurs ci-dessus, un CV générique reste en moyenne moins bien classé qu&apos;un CV
          dont le vocabulaire et les priorités reflètent l&apos;offre précise. Ce n&apos;est pas une erreur technique
          — c&apos;est simplement moins optimisé pour chaque candidature spécifique.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Comment le vérifier sans deviner</h2>
        <p>
          Plutôt que d&apos;essayer de repérer ces problèmes à l&apos;œil, l&apos;analyse ATS de CVMatch compare
          directement votre CV à une offre donnée et pointe les écarts concrets — mots-clés manquants, format à
          risque, sections mal structurées — avec un score de compatibilité à l&apos;appui.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          Vérifiez votre CV actuel :{" "}
          <Link href="/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>{" "}
          et obtenez votre score de compatibilité ATS en quelques minutes.
        </p>
      </div>
    </div>
  );
}
