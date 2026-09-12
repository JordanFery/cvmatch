import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAuthUser } from "@/lib/data/profile";
import { SUPPORT_EMAIL, LEGAL_ENTITY_NAME } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment CVMatch collecte, utilise et protège vos données personnelles.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "12 septembre 2026";

export default async function PrivacyPage() {
  const [{ dict, locale }, user] = await Promise.all([getDictionary(), getAuthUser()]);

  return (
    <div className="flex min-h-full flex-col">
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Politique de confidentialité</h1>
          <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : {LAST_UPDATED}</p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-foreground">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">1. Qui sommes-nous</h2>
              <p className="text-muted-foreground">
                CVMatch est un service édité par {LEGAL_ENTITY_NAME}, à titre personnel (particulier, sans société
                enregistrée), basé à Montréal, Québec, Canada, qui vous aide à adapter votre CV et vos candidatures
                aux offres d&apos;emploi. Cette politique explique quelles données nous collectons, pourquoi, et
                comment vous pouvez les contrôler.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">2. Données que nous collectons</h2>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Compte</span> : prénom, nom, e-mail, et toute
                  information de profil que vous ajoutez (téléphone, localisation, liens).
                </li>
                <li>
                  <span className="font-medium text-foreground">Contenu de candidature</span> : le texte de votre
                  CV (importé ou saisi), les offres d&apos;emploi que vous enregistrez, ainsi que les CV adaptés,
                  lettres de motivation et analyses générés par nos outils IA.
                </li>
                <li>
                  <span className="font-medium text-foreground">Données de paiement</span> : gérées entièrement
                  par Stripe — nous ne stockons jamais votre numéro de carte. Nous conservons uniquement
                  l&apos;identifiant client Stripe et le statut de votre abonnement.
                </li>
                <li>
                  <span className="font-medium text-foreground">Données d&apos;usage</span> : crédits consommés,
                  historique de candidatures, préférences (langue, thème), à des fins de fonctionnement du service.
                </li>
                <li>
                  <span className="font-medium text-foreground">Cookies techniques</span> : session
                  d&apos;authentification, langue et thème choisis — toujours actifs, nécessaires au
                  fonctionnement du site.
                </li>
                <li>
                  <span className="font-medium text-foreground">Cookies d&apos;analyse</span> (Google Analytics) :
                  déposés uniquement si vous les acceptez via le bandeau affiché lors de votre première visite —
                  jamais de cookies publicitaires.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">3. Comment nous utilisons ces données</h2>
              <p className="text-muted-foreground">Nous utilisons vos données uniquement pour :</p>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Fournir le service : stocker votre CV et vos offres, suivre vos candidatures.</li>
                <li>
                  Générer les analyses et documents que vous demandez (compatibilité ATS, CV adapté, lettre de
                  motivation) — pour cela, le contenu concerné de votre CV et de l&apos;offre visée est envoyé à
                  l&apos;API d&apos;Anthropic (Claude) pour traitement. Pour la lettre de motivation, une recherche
                  web automatisée peut aussi être effectuée pour trouver des informations publiques sur
                  l&apos;entreprise visée.
                </li>
                <li>Traiter vos paiements et gérer votre abonnement via Stripe.</li>
                <li>Vous contacter pour des raisons liées au service (confirmation de compte, support).</li>
              </ul>
              <p className="text-muted-foreground">
                Nous ne vendons jamais vos données et ne les utilisons pas pour entraîner des modèles d&apos;IA.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">4. Avec qui nous partageons vos données</h2>
              <p className="text-muted-foreground">
                Nous faisons appel aux sous-traitants suivants, chacun n&apos;ayant accès qu&apos;aux données
                nécessaires à son rôle :
              </p>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Supabase</span> — hébergement de la base de
                  données, authentification et stockage de vos fichiers CV.
                </li>
                <li>
                  <span className="font-medium text-foreground">Anthropic</span> — traitement IA de votre CV et
                  des offres d&apos;emploi pour générer analyses, CV adaptés et lettres de motivation.
                </li>
                <li>
                  <span className="font-medium text-foreground">Stripe</span> — traitement des paiements et
                  gestion des abonnements.
                </li>
                <li>
                  <span className="font-medium text-foreground">Google Analytics</span> — statistiques
                  d&apos;usage anonymisées, uniquement si vous avez donné votre consentement via le bandeau de
                  cookies.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">5. Conservation des données</h2>
              <p className="text-muted-foreground">
                Vos données sont conservées tant que votre compte est actif. Si vous supprimez votre compte, vos
                CV, offres, analyses et documents générés sont supprimés définitivement de notre base, sauf ce que
                la loi nous impose de conserver (par exemple les données de facturation).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">6. Vos droits</h2>
              <p className="text-muted-foreground">Vous pouvez à tout moment :</p>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Accéder à vos données, les corriger ou les exporter depuis votre profil.</li>
                <li>Supprimer votre CV, vos offres ou tout contenu généré individuellement.</li>
                <li>
                  Demander la suppression complète de votre compte et de vos données en nous contactant à{" "}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-foreground hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </li>
                <li>
                  Vous opposer à un traitement ou déposer une réclamation auprès de la{" "}
                  <a
                    href="https://www.cai.gouv.qc.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:underline"
                  >
                    Commission d&apos;accès à l&apos;information du Québec (CAI)
                  </a>
                  , l&apos;autorité compétente pour la protection des renseignements personnels au Québec.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">7. Sécurité</h2>
              <p className="text-muted-foreground">
                Vos données sont chiffrées en transit (HTTPS) et isolées par des règles d&apos;accès au niveau de
                la base de données (Row Level Security) : chaque utilisateur ne peut techniquement accéder qu&apos;à
                ses propres données.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">8. Mineurs</h2>
              <p className="text-muted-foreground">
                CVMatch n&apos;est pas destiné aux personnes de moins de 16 ans. Nous ne collectons pas
                sciemment de données concernant des mineurs.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">9. Modifications</h2>
              <p className="text-muted-foreground">
                Nous pouvons mettre à jour cette politique. Toute modification importante vous sera communiquée
                par e-mail ou via une notification dans l&apos;application.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">10. Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question sur cette politique ou vos données, contactez-nous à{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-foreground hover:underline">
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <LandingFooter dict={dict} />
    </div>
  );
}
