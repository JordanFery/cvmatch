import Link from "next/link";

export function CvNouvelArrivantCanada() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Beaucoup de nouveaux arrivants postulent d&apos;abord avec le CV qu&apos;ils utilisaient dans leur pays
        d&apos;origine, simplement traduit. Le problème n&apos;est presque jamais le parcours lui-même — c&apos;est
        que le document contient des éléments qu&apos;un recruteur canadien n&apos;attend pas, et qu&apos;il en
        manque d&apos;autres qu&apos;il cherche par réflexe. Ce sont des détails de forme, mais ils se voient en
        quelques secondes, avant même que le contenu ne soit lu.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce qui disparaît complètement</h2>
        <p>
          Ces éléments sont courants dans de nombreux pays (en particulier en France, au Maghreb et dans une bonne
          partie de l&apos;Europe) mais n&apos;ont pas leur place sur un CV canadien — les inclure n&apos;est pas
          seulement inutile, c&apos;est parfois vu comme un manque de connaissance des codes locaux :
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">La photo.</strong> Elle n&apos;est jamais demandée et son absence
            n&apos;est jamais remarquée — beaucoup d&apos;employeurs l&apos;évitent volontairement pour se protéger
            d&apos;accusations de discrimination à l&apos;embauche.
          </li>
          <li>
            <strong className="text-foreground">La date de naissance et l&apos;âge.</strong> Ne figurent jamais sur
            un CV nord-américain, pour la même raison.
          </li>
          <li>
            <strong className="text-foreground">La situation familiale.</strong> Marié·e, célibataire, nombre
            d&apos;enfants — une information qui n&apos;a rien à faire ici et qui peut même mettre mal à l&apos;aise
            un recruteur qui sait qu&apos;il ne devrait pas en tenir compte.
          </li>
          <li>
            <strong className="text-foreground">La nationalité affichée comme un intitulé.</strong> Pas besoin
            d&apos;écrire « Nationalité : marocaine » ou « Nationalité : française » en en-tête — voir plus bas pour
            ce qu&apos;il est utile de préciser à la place.
          </li>
          <li>
            <strong className="text-foreground">La signature et la date en bas de page.</strong> Une convention de
            document administratif français qui n&apos;existe pas sur un CV nord-américain.
          </li>
          <li>
            <strong className="text-foreground">« Références disponibles sur demande ».</strong> Sous-entendu par
            défaut — l&apos;écrire n&apos;apporte rien et prend une ligne pour rien.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">CV ou resume ? Une question de mot, pas seulement de langue</h2>
        <p>
          En anglais, le mot « CV » désigne presque exclusivement un document académique ou médical, long et
          exhaustif (publications, conférences, etc.). Pour un poste standard, le terme attendu est « resume » — un
          document court et ciblé. Au Québec, en français, « CV » reste le terme utilisé sans ambiguïté. Cette
          nuance de vocabulaire compte autant que la structure elle-même, et elle s&apos;ajoute à une question plus
          large — celle de la langue à utiliser selon l&apos;entreprise et la région — que nous détaillons dans{" "}
          <Link href="/fr/blog/cv-francais-vs-anglais-canada" className="font-medium underline underline-offset-4">
            CV en français ou en anglais : que choisir pour postuler au Canada ?
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce qu&apos;il est utile d&apos;ajouter</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Votre statut légal de travail, en une ligne.</strong> « Résident
            permanent », « Citoyen canadien » ou « Permis de travail ouvert » suffit — cela répond immédiatement à
            la première question que se pose un recruteur (« cette personne peut-elle légalement être embauchée ? »)
            sans qu&apos;il ait à la poser. Vérifiez la formulation exacte qui correspond à votre situation auprès
            d&apos;une source officielle plutôt que de la deviner.
          </li>
          <li>
            <strong className="text-foreground">Une ville et un moyen de vous joindre localement</strong>, même sans
            adresse complète — un numéro canadien ou une mention « Basé·e à Montréal » ou « Disponible pour
            déménager dès [date] » rassure sur votre disponibilité réelle.
          </li>
          <li>
            <strong className="text-foreground">Un profil professionnel de 2 à 3 lignes en haut du CV</strong>, à la
            place de l&apos;ancien « objectif de carrière » — ce qui vous définit professionnellement et ce que vous
            apportez, pas ce que vous cherchez.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Présenter une expérience ou un diplôme obtenus à l&apos;étranger</h2>
        <p>
          Gardez le nom réel de votre employeur et de votre établissement — n&apos;inventez jamais un équivalent
          canadien qui n&apos;existe pas, cela se vérifie et se retourne toujours contre vous. Si un intitulé de
          poste ou un diplôme risque de ne rien évoquer pour un recruteur nord-américain, ajoutez une courte
          précision entre parenthèses (taille de l&apos;équipe, secteur, équivalent approximatif) plutôt que de
          renommer le poste ou le diplôme lui-même.
        </p>
        <p>
          La reconnaissance officielle d&apos;un diplôme étranger (équivalence, ordre professionnel, etc.) est un
          processus séparé, administratif — ce n&apos;est pas au CV de la régler. Le CV décrit ce que vous avez
          réellement fait ; la démarche de reconnaissance se mène en parallèle.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Le format attendu, dans les grandes lignes</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Ordre antichronologique : l&apos;expérience la plus récente en premier, toujours.</li>
          <li>Une à deux pages maximum — pas le CV détaillé de plusieurs pages courant dans d&apos;autres pays.</li>
          <li>
            Des réalisations chiffrées en puces courtes (« Réduit les délais de traitement de 20 % »), pas des
            paragraphes qui décrivent des responsabilités.
          </li>
          <li>Des verbes d&apos;action en début de puce, jamais « je » ou « j&apos;ai » — implicite en anglais comme en français nord-américain.</li>
        </ul>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          CVMatch part de votre CV maître — avec votre parcours réel, sans rien inventer — et l&apos;adapte à chaque
          offre, dans la langue qu&apos;elle demande :{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
