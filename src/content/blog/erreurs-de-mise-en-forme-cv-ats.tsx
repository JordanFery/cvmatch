import Link from "next/link";

export function ErreursDeMiseEnFormeCvAts() {
  return (
    <div className="space-y-8 text-base leading-relaxed text-foreground/90">
      <p>
        Un CV peut contenir exactement les bonnes compétences et la bonne expérience, et rester malgré tout invisible
        pour un recruteur — parce qu&apos;un logiciel de tri n&apos;a jamais réussi à le lire correctement. Ce n&apos;est
        pas une question de contenu, mais de mise en forme : voici les erreurs les plus fréquentes, et comment les
        repérer sur votre propre CV avant de l&apos;envoyer.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Colonnes, tableaux et zones de texte : l&apos;ordre de lecture est brisé</h2>
        <p>
          La plupart des ATS extraient le texte d&apos;un document de façon linéaire, du haut vers le bas, sans
          comprendre la mise en page visuelle. Un CV en deux colonnes (souvent un choix esthétique très répandu) peut
          être lu en mélangeant une ligne de la colonne de gauche avec une ligne de la colonne de droite, produisant
          des phrases incohérentes. Les tableaux utilisés pour aligner des dates ou des compétences posent le même
          problème : certains parseurs ignorent purement leur contenu, d&apos;autres le lisent dans un ordre qui n&apos;a
          plus de sens. Les zones de texte flottantes (fréquentes dans les modèles créés sous Word ou Canva)
          subissent souvent le même sort — elles ne font pas partie du flux principal du document et sont
          simplement sautées.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Ce qui est en en-tête, en pied de page ou en image est souvent invisible</h2>
        <p>
          Placer vos coordonnées (nom, téléphone, e-mail) dans l&apos;en-tête du document semble pratique, mais
          plusieurs ATS n&apos;extraient que le corps du texte — vos coordonnées peuvent alors ne jamais atteindre la
          base de données du recruteur. Même logique pour tout ce qui est une image plutôt qu&apos;un vrai texte :
          une photo, une jauge de compétences en graphique, des icônes remplaçant des mots (« 4 étoiles » à la place
          de « 5 ans d&apos;expérience »). Un logiciel de tri ne lit pas les images — ce contenu n&apos;existe tout
          simplement pas pour lui, même s&apos;il est parfaitement lisible à l&apos;œil.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Un PDF scanné, c&apos;est zéro texte à évaluer</h2>
        <p>
          Un CV envoyé sous forme de photo ou de scan (même exporté en PDF) n&apos;a pas de couche de texte du
          tout — seulement une image de page. Un ATS n&apos;y trouve rien à extraire, ce qui revient à soumettre une
          candidature vide de son point de vue. C&apos;est aussi vrai pour certains PDF générés par des outils de
          conception graphique qui rasterisent le texte au lieu de le garder sélectionnable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Polices et puces trop créatives</h2>
        <p>
          Une police non standard ou des puces symboliques inhabituelles (flèches personnalisées, émoticônes) peuvent
          se convertir en caractères illisibles ou en symboles cassés une fois le PDF transformé en texte brut. Le
          risque est purement technique, mais le résultat est le même qu&apos;un vrai trou dans le contenu : des
          mots qui n&apos;existent plus une fois passés dans le système.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Des intitulés de section reconnaissables</h2>
        <p>
          « Expérience », « Formation », « Compétences » sont des intitulés que la plupart des systèmes savent
          catégoriser automatiquement. Un titre plus original — « Mon parcours », « Ce que je sais faire » — peut
          empêcher le logiciel de rattacher correctement le contenu à la bonne catégorie, même si l&apos;information
          elle-même est complète et pertinente.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Comment vérifier votre CV sans deviner</h2>
        <p>
          Un test simple et rapide : essayez de sélectionner tout le texte de votre CV (Ctrl+A) puis de le coller
          dans un éditeur de texte brut. Si des phrases se mélangent, si des sections entières manquent, ou si rien
          ne se sélectionne du tout, un ATS rencontrera probablement le même problème.
        </p>
        <p>
          Pour aller plus loin, notre{" "}
          <Link href="/fr/tools/ats-score" className="font-medium underline underline-offset-4">
            vérificateur ATS gratuit
          </Link>{" "}
          extrait le texte de votre CV exactement comme le ferait un vrai système de tri — sans compte, en quelques
          secondes — pour voir directement ce qui est réellement lu, et ce qui ne l&apos;est pas. Pour une vue plus
          large des raisons pour lesquelles un CV peut être écarté, notre article{" "}
          <Link href="/fr/blog/pourquoi-votre-cv-est-rejete-avant-detre-lu" className="font-medium underline underline-offset-4">
            5 raisons pour lesquelles votre CV est rejeté avant d&apos;être lu par un humain
          </Link>{" "}
          couvre les autres causes, au-delà de la mise en forme.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-6">
        <p className="text-foreground">
          CVMatch analyse la compatibilité de votre CV pour chaque offre, format compris :{" "}
          <Link href="/fr/register" className="font-medium underline underline-offset-4">
            créez un compte gratuit
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
