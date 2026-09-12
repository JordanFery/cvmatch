import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAuthUser } from "@/lib/data/profile";
import { SUPPORT_EMAIL, LEGAL_ENTITY_NAME } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Les conditions d'utilisation du service CVMatch.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "12 septembre 2026";

export default async function TermsPage() {
  const [{ dict, locale }, user] = await Promise.all([getDictionary(), getAuthUser()]);

  return (
    <div className="flex min-h-full flex-col">
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Conditions d&apos;utilisation</h1>
          <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : {LAST_UPDATED}</p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-foreground">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">1. Objet</h2>
              <p className="text-muted-foreground">
                Les présentes conditions régissent l&apos;utilisation du service CVMatch, édité par{" "}
                {LEGAL_ENTITY_NAME}, à titre personnel (particulier, sans société enregistrée), basé à Montréal,
                Québec, Canada. En créant un compte, vous acceptez ces conditions dans leur intégralité.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">2. Compte utilisateur</h2>
              <p className="text-muted-foreground">
                Vous devez fournir des informations exactes lors de l&apos;inscription et êtes responsable de la
                confidentialité de votre mot de passe. Un compte est personnel et ne doit pas être partagé ou créé
                de façon automatisée ou répétée pour contourner les limites d&apos;usage gratuit.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">3. Description du service</h2>
              <p className="text-muted-foreground">
                CVMatch propose des outils d&apos;analyse et de génération assistées par IA (compatibilité ATS, CV
                adapté, lettre de motivation) consommant des crédits, ainsi qu&apos;un suivi de candidatures. Le
                forfait gratuit inclut un nombre limité de crédits mensuels ; les forfaits payants en incluent
                davantage, selon les modalités affichées sur la page{" "}
                <a href="/pricing" className="font-medium text-foreground hover:underline">
                  Tarifs
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">4. Facturation et abonnements</h2>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Les abonnements payants sont facturés mensuellement et se renouvellent automatiquement.</li>
                <li>
                  Vous pouvez annuler à tout moment depuis votre espace de facturation ; l&apos;abonnement reste
                  actif jusqu&apos;à la fin de la période déjà payée, sans remboursement au prorata de la période
                  en cours.
                </li>
                <li>Les crédits non utilisés en fin de mois ne sont pas reportés au mois suivant.</li>
                <li>
                  Les prix affichés sont <span className="font-medium text-foreground">hors taxes</span> ; les
                  taxes applicables (TPS/TVQ ou équivalent selon votre lieu de résidence) sont ajoutées au moment
                  du paiement.
                </li>
                <li>Les paiements sont traités par Stripe ; nous ne stockons aucune donnée de carte bancaire.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">5. Utilisation acceptable</h2>
              <p className="text-muted-foreground">Il est interdit de :</p>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Créer des comptes multiples ou automatisés pour contourner les limites de crédits gratuits.</li>
                <li>Utiliser le service pour générer du contenu frauduleux, trompeur ou usurpant l&apos;identité d&apos;un tiers.</li>
                <li>Tenter de perturber, sonder ou contourner les mesures de sécurité du service.</li>
                <li>Revendre ou redistribuer l&apos;accès au service sans autorisation écrite.</li>
              </ul>
              <p className="text-muted-foreground">
                Tout manquement peut entraîner la suspension ou la résiliation immédiate de votre compte.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">6. Propriété intellectuelle</h2>
              <p className="text-muted-foreground">
                Vous restez propriétaire du contenu de votre CV et des informations que vous fournissez. En les
                soumettant, vous nous accordez uniquement le droit de les traiter (y compris via des services
                d&apos;IA tiers) pour vous fournir le service demandé — jamais pour un autre usage.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">7. Contenu généré par IA</h2>
              <p className="text-muted-foreground">
                Les analyses, CV adaptés et lettres de motivation sont générés automatiquement et peuvent
                contenir des erreurs ou inexactitudes. Vous êtes seul responsable de relire et vérifier tout
                contenu avant de l&apos;envoyer à un recruteur. CVMatch ne garantit aucun résultat de recherche
                d&apos;emploi (réponse, entretien, embauche).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">8. Résiliation</h2>
              <p className="text-muted-foreground">
                Vous pouvez supprimer votre compte à tout moment. Nous pouvons suspendre ou résilier un compte en
                cas de violation de ces conditions, avec un préavis raisonnable sauf en cas de fraude ou d&apos;abus
                manifeste.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">9. Limitation de responsabilité</h2>
              <p className="text-muted-foreground">
                Le service est fourni « en l&apos;état ». Dans la mesure permise par la loi, CVMatch ne peut être
                tenu responsable des décisions prises sur la base du contenu généré, ni des dommages indirects
                résultant de l&apos;utilisation du service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">10. Droit applicable</h2>
              <p className="text-muted-foreground">
                Ces conditions sont régies par les lois de la province de Québec et les lois fédérales du Canada
                qui s&apos;y appliquent. Tout litige sera soumis aux tribunaux compétents du district de Montréal,
                Québec.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">11. Modifications</h2>
              <p className="text-muted-foreground">
                Nous pouvons modifier ces conditions ; toute modification importante vous sera communiquée à
                l&apos;avance par e-mail ou notification dans l&apos;application.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">12. Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question sur ces conditions, contactez-nous à{" "}
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
