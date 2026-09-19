# Audit UX complet de CVMatch

Date : 2026-09-20
Auteur : Claude (Claude Code), à la demande du fondateur
Version du code auditée : branche `main`, commit `f5b01d1`

---

## 1. Résumé exécutif

### Vue d'ensemble

CVMatch est un produit jeune (quelques jours de mise en production) mais **techniquement et éditorialement plus mature que la moyenne des SaaS à ce stade** : proposition de valeur claire, modèle de crédits transparent, formulaires accessibles, message de confidentialité précis et nommé (pas de boilerplate juridique vague), et un vrai souci de ne jamais laisser l'IA « inventer » une expérience sur le CV de l'utilisateur — un point de confiance rappelé à deux endroits différents du produit. Le code est propre (TypeScript strict, lint et build sans erreur), les écrans de chargement sont pensés, et les messages d'erreur sont presque tous des textes actionnables plutôt que des codes techniques.

Le produit souffre en revanche de **deux failures structurelles de cohérence** qui touchent directement les objectifs business énoncés en introduction :

1. **Le bilinguisme FR/EN est un vernis marketing, pas une réalité produit.** Le site public (`/fr`, `/en`) est intégralement traduit, avec hreflang et SEO travaillés. Mais dès que l'utilisateur passe à l'action — payer (`/en/pricing` mélange du français non traduit dans une page anglaise), ou utiliser le produit (l'éditeur de CV, l'éditeur d'offre, le tableau de candidatures, les badges sont **100 % français**, quelle que soit la langue choisie) — la promesse s'effondre. Un visiteur anglophone converti sur la page d'accueil anglaise atterrit, une fois inscrit, dans un formulaire d'édition de CV entièrement en français.
2. **Une bannière de cookies mal positionnée bloque un bouton d'action principal au premier chargement, sur mobile, sur la page d'accueil.** C'est le pire endroit possible pour un bug visuel : le tout premier écran vu par un nouveau visiteur.

Le reste des problèmes identifiés sont d'ampleur P2/P3 : transparence du coût en crédits au moment de l'action, absence de page 404 personnalisée, densité d'information de la page offre, table des candidatures illisible sur mobile sans indice visuel de défilement.

### Forces observées

- Proposition de valeur claire dès le titre (« Décrochez plus d'entretiens. Sans y passer vos soirées. ») avec un bénéfice concret, pas un jargon marketing creux.
- Modèle de crédits traduit en langage utilisateur (« jusqu'à 33 CV adaptés ou lettres de motivation par mois » plutôt qu'un simple nombre de crédits abstrait).
- Vraie intégration Stripe Checkout / Customer Portal, pas une simulation.
- Formulaires accessibles de façon systématique : `Label`/`htmlFor`, `aria-invalid`, `aria-describedby` liés au message d'erreur, `role="alert"`, anneaux de focus visibles sur tous les boutons.
- Politique de confidentialité nommée et spécifique (cite Anthropic/Claude, Supabase, Stripe individuellement, précise que les données ne servent jamais à l'entraînement de modèles).
- Composant `EmptyState` réutilisé de façon cohérente sur toutes les listes vides.
- Écran de chargement à l'import de CV pensé (icône animée, messages IA qui tournent) — imparfait dans le détail (voir P2), mais l'intention est la bonne.
- Zéro erreur console détectée sur l'ensemble des pages publiques testées.

### Risques UX prioritaires

| # | Risque | Impact |
|---|--------|--------|
| 1 | Bannière de cookies qui recouvre le CTA principal au premier chargement mobile | Perte de conversion dès la première visite |
| 2 | Produit « anglais » qui redevient français dès la première action réelle | Confusion et perte de confiance pour tout utilisateur anglophone converti |
| 3 | Aucun indice de coût en crédits avant de lancer une action IA | Surprise négative au moment où les crédits s'épuisent, juste avant la conversion payante |

### Opportunités d'amélioration

Les corrections rapides (bannière de cookies, indicateur de coût en crédits, page 404 personnalisée, alignement des cartes tarifaires) sont à faible effort et faible risque de régression — elles devraient passer avant tout le reste. La question du bilinguisme du produit est un vrai chantier de contenu, pas un correctif ; ce rapport le documente précisément pour qu'il soit traité comme un projet à part entière plutôt que découvert par un client anglophone mécontent.

---

## 2. Périmètre et méthode

### Pages inspectées

L'intégralité des routes de l'application a été lue dans le code (`src/app/**/page.tsx`, layouts, actions serveur, schémas de validation) : les 10 pages publiques (`/`, `/pricing`, `/contact`, `/privacy`, `/terms`, `/blog`, `/blog/[slug]`, `/tools/ats-score`, `/login`, `/register`), les 15 pages du dashboard authentifié, et les 5 routes API.

### Parcours testés

- Visite du site public (page d'accueil, tarifs, inscription, connexion) — **vérifié visuellement** (captures d'écran réelles à 375 / 768 / 1440 px) sur un serveur `next dev` réel.
- Import de CV, import d'offre, analyse ATS, génération de CV adapté, génération de lettre de motivation, candidature, suivi des candidatures, facturation, badges — **vérifiés par lecture de code** (composants, actions serveur, schémas de validation, messages d'erreur) et, pour les pages du tableau de bord les plus centrales (accueil, détail d'offre, liste d'offres, table des candidatures, sidebar/menu mobile), **vérifiés visuellement** via une reproduction isolée sans authentification (les composants réels du produit rendus avec des données factices réalistes, car la création d'un compte de test réel se heurte à des limites d'envoi d'e-mails de Supabase dans cet environnement).

### Outils utilisés

- Lecture directe du code source (TypeScript/React, Prisma, Tailwind).
- `tsc --noEmit` et `eslint` (build technique propre au moment de l'audit).
- Navigateur Chromium piloté par Playwright contre un serveur de développement réel, aux largeurs 375 px (mobile), 768 px (tablette) et 1440 px (desktop), avec relevé de la console navigateur.
- Recherche de fichiers pour vérifier l'absence de certains éléments (ex. `not-found.tsx`, `error.tsx`).

### Limites de l'audit

- **Aucun test avec de vrais utilisateurs.** Toutes les hypothèses d'abandon ou de confusion sont déduites du code et de l'interface, jamais mesurées.
- **Aucune donnée analytique consultée** (pas d'accès à Google Analytics / Vercel Analytics pour ce rapport) — aucun taux de conversion, taux de rebond ou taux d'abandon réel n'est cité nulle part dans ce document.
- **Authentification réelle non testée** : les pages du tableau de bord ont été vérifiées visuellement via des composants réels rendus hors du flux d'authentification, pas via un compte utilisateur connecté de bout en bout. Le comportement exact en production (latence réseau réelle, appels IA réels, webhooks Stripe réels) n'a pas été observé.
- **Accessibilité** : audit par inspection de code uniquement (structure sémantique, labels, ARIA, focus). Aucun test au lecteur d'écran, aucun score Lighthouse/axe exécuté — ces vérifications sont listées comme hypothèses à tester (section 17).
- **Contraste des couleurs** : les valeurs de la palette (`oklch`) ont été lues mais aucun calcul de ratio de contraste WCAG n'a été exécuté ; toute affirmation de contraste correct ou insuffisant serait une invention — ce point est explicitement renvoyé à un outil automatisé (section 8).
- Le badge noir « N » visible sur toutes les captures d'écran est l'indicateur de mode développement de Next.js (jamais présent en production) — ignoré dans toutes les observations.

---

## 3. Cartographie des pages et fonctionnalités

### Pages publiques (`src/app/[locale]/`, FR/EN)

| Route | Fonctionnalité | Accès |
|---|---|---|
| `/` | Landing (proposition de valeur, fonctionnement, tarifs, CTA) | Public |
| `/pricing` | Détail des forfaits, checkout Stripe | Public (checkout nécessite un compte) |
| `/contact` | Page de contact statique (mailto) | Public |
| `/privacy`, `/terms` | Pages légales (FR uniquement) | Public |
| `/blog`, `/blog/[slug]` | Contenu SEO (FR uniquement) | Public |
| `/(auth)/login`, `/(auth)/register` | Authentification | Public |
| `/tools/ats-score` | Vérificateur ATS gratuit, anonyme, 3 essais/jour/IP | Public, sans compte |

### Pages authentifiées (`src/app/dashboard/`, non préfixées par locale)

| Route | Fonctionnalité | Parcours |
|---|---|---|
| `/dashboard` | Vue d'ensemble (statistiques, CV, candidatures récentes, badges) | A, C |
| `/dashboard/cv`, `/cv/[id]`, `/cv/upload`, `/cv/review` | Bibliothèque de CV, édition, import, vérification post-import | B |
| `/dashboard/jobs`, `/jobs/add`, `/jobs/review`, `/jobs/[id]` | Liste d'offres, import, vérification, page hub par offre | B |
| `/dashboard/jobs/[id]/tailored-cv`, `/cover-letter` | Résultat CV adapté / lettre de motivation | B |
| `/dashboard/applications` | Table de suivi des candidatures | C |
| `/dashboard/billing` | Forfait, crédits, changement de forfait, portail Stripe | E |
| `/dashboard/badges` | Gamification (13 badges, récompenses en crédits) | C |
| `/dashboard/profile` | Informations personnelles, objectif quotidien | C |
| `/dashboard/admin` | Panneau interne (recherche utilisateurs, crédits, forfaits) | Interne uniquement |

---

## 4. Audit de la proposition de valeur

**Page concernée : `/` (landing).**

Le message est clair et répond honnêtement aux questions posées par la mission :

- *Ce que fait CVMatch* : énoncé dès le sous-titre (« CVMatch analyse chaque offre, adapte votre CV aux mots-clés recherchés et centralise toutes vos candidatures »).
- *À qui il s'adresse* : implicite mais cohérent — le ton et le vocabulaire (« Décrochez plus d'entretiens », pas de jargon technique) parlent à un candidat généraliste, pas seulement à un profil tech, ce qui correspond à la cible énoncée.
- *Comment ça marche* : une section dédiée en 5 étapes concrètes (Importez → Trouvez → Adaptez → Postulez → Suivez).
- *Ce que l'utilisateur obtient* : la section « Voyez exactement où vous en êtes » montre un exemple concret de résultat (score de compatibilité, compétences manquantes) plutôt qu'une promesse abstraite, avec la mention honnête « Généré automatiquement à partir de votre CV et de l'offre » — évite de faire passer une maquette pour une vraie capture d'écran.
- *L'IA est-elle expliquée clairement ?* Oui, et de façon rassurante plutôt qu'anxiogène : la section « CV adapté » précise explicitement « sans jamais inventer d'expérience », un point repris mot pour mot dans le produit réel (`tailored-cv-section.tsx`) — cohérence entre promesse marketing et fonctionnement réel, vérifiée dans le code.
- *Prochaine étape* : un seul CTA principal (« Commencer gratuitement ») répété à la fin de chaque section, jamais noyé parmi des choix concurrents.

**Un point à surveiller plutôt qu'un problème** : la section « Fonctionnalités » liste 8 éléments à plat, sans hiérarchie visuelle entre le cœur du produit (analyse ATS, CV sur mesure, suivi) et des éléments secondaires de rétention (objectifs quotidiens, récompenses, alertes de doublons). Un nouveau visiteur qui découvre ces 8 items d'un coup pourrait avoir du mal à identifier ce qui fait réellement la valeur du produit — sans pouvoir l'affirmer sans test utilisateur, il s'agit d'une hypothèse raisonnable à tester (section 17), pas d'un défaut confirmé.

**Absence de preuve sociale** : aucun témoignage, chiffre d'utilisateurs ou logo client sur la page d'accueil. Compte tenu de l'âge du produit (quelques jours), c'est cohérent et honnête — l'audit ne recommande **pas** d'en fabriquer, conformément à la consigne de ne jamais inventer de preuve sociale. À réintroduire une fois que des données réelles existent.

| ID | Priorité | Page | Problème | Impact | Effort | Confiance | Recommandation |
|----|----------|------|----------|--------|--------|-----------|-----------------|
| V1 | P3 | `/` | 8 fonctionnalités listées à plat, sans hiérarchie cœur/secondaire | Faible-moyen (hypothèse) | Faible | Hypothèse à tester | Regrouper visuellement 3-4 fonctionnalités "cœur" (analyse ATS, CV sur mesure, suivi) en avant, le reste en second plan |

---

## 5. Audit des parcours utilisateurs

### Parcours A — Première visite

Le trajet accueil → CTA → inscription → tableau de bord est court (aucune étape superflue) et cohérent. Le seul incident confirmé est visuel, pas structurel : voir **ID01** (bannière de cookies) en section 6/15 — elle recouvre le bouton « Se connecter » du hero sur mobile au premier chargement, avant tout choix de consentement. C'est un frein réel et évitable à l'action la plus importante de toute la page.

### Parcours B — Première adaptation de CV

Le chemin réel est : `/dashboard` → « Trouver une offre » → import (texte ou URL) → `/jobs/review` (vérification/correction) → confirmation → page hub de l'offre → « Analyser la compatibilité » et/ou « Générer un CV adapté » (nécessite d'avoir déjà importé un CV maître au préalable, sinon un lien de rappel apparaît à chaque section).

Points positifs vérifiés dans le code :
- Formats et limites annoncés clairement *avant* la sélection du fichier (« PDF ou DOCX, 10 Mo maximum ») — répond directement à l'exigence de la mission sur ce point.
- Double validation des fichiers (type déclaré **et** signature binaire réelle du fichier côté serveur) — empêche un fichier renommé de tromper le système, sans jamais le dire à l'utilisateur de façon technique.
- Message d'erreur actionnable si l'extraction échoue (« Vous pouvez réessayer ou saisir les informations manuellement »).

Points à corriger :
- **La barre de progression à l'import de CV est cosmétique**, pas connectée au traitement réel : les étapes 2 et 3 (« Texte extrait », « Analyse du contenu ») avancent sur des minuteurs fixes (600 ms / 1400 ms), alors qu'un appel réel à l'IA prend généralement plusieurs secondes. Si le traitement dépasse ces délais (cas courant), l'interface reste figée sur l'étape 3 sans indication de temps restant, ce qui peut donner une impression de blocage. *(ID11, P2)*
- **Aucune offre de coût en crédits visible avant de cliquer** sur « Analyser la compatibilité », « Générer un CV adapté » ou « Générer une lettre de motivation », alors que le prix exact de chaque action est déjà défini dans le code (`CREDIT_COSTS`) et affiché ailleurs (page tarifs). L'utilisateur découvre le coût seulement après l'action, ou doit consulter une page séparée. *(ID05, P1)*
- **Si l'échec d'extraction se répète, l'utilisateur doit tout ressaisir à la main**, champ par champ, sans pré-remplissage partiel — un vrai point de friction pour un CV scanné/image, mais qui reste une limite technique difficile à contourner sans OCR, pas un simple oubli UX.

### Parcours C — Utilisation récurrente

Le tableau de bord affiche des statistiques concrètes (candidatures envoyées, entretiens, taux de réponse, CV optimisés), les candidatures récentes, et un rappel de progression des badges. Le retour à une session précédente est cohérent — rien d'anormal identifié. Un point de cohérence mineur : sur mobile, le nombre de crédits restants n'est visible qu'après ouverture du menu hamburger, alors qu'il est en permanence affiché dans la barre latérale sur desktop — écart mineur mais réel entre les deux expériences. *(P3, non chiffré séparément — cf. section 15 ID15 pour le sujet mobile plus large)*

### Parcours D — Inscription et authentification

Formulaire d'inscription bien construit sur le plan technique et accessible (voir section 8). Deux problèmes concrets :

- **Les règles de mot de passe (8 caractères, une minuscule, une majuscule, un chiffre) ne sont jamais annoncées avant la soumission.** L'utilisateur les découvre une par une : react-hook-form n'affiche qu'un seul message d'erreur à la fois par champ, donc un mot de passe qui échoue à plusieurs règles simultanément ne montre que la première règle violée, poussant l'utilisateur à corriger, soumettre, corriger encore. *(ID04, P1)*
- **L'écran « Vérifiez votre boîte mail » après inscription est une impasse.** Aucun bouton pour renvoyer l'e-mail, aucun lien de retour vers la connexion, aucune indication de ce qu'il faut faire si l'e-mail n'arrive jamais. *(ID06, P2)*

Rien à signaler sur la page de connexion elle-même (erreurs mappées en français compréhensible pour les cas les plus courants — identifiants invalides, e-mail non confirmé).

### Parcours E — Abonnement et monétisation

L'implémentation est du vrai Stripe Checkout et Customer Portal, pas une simulation. Le modèle de crédits est **bien expliqué en langage utilisateur** sur la page tarifs (« 1 crédit ≈ une action IA légère… l'analyse de CV compte pour 2 crédits, la génération d'un CV adapté pour 3 crédits »), avec des équivalences concrètes par forfait (« jusqu'à 33 CV adaptés ou lettres de motivation par mois ») plutôt qu'un simple compteur abstrait — c'est un choix d'UX writing nettement au-dessus de la moyenne pour ce type de modèle.

Le point faible confirmé : **`/en/pricing` mélange du contenu français non traduit dans une page par ailleurs entièrement anglaise** — confirmé par capture d'écran. Les noms de forfaits, descriptions et listes de fonctionnalités restent en français (« Pour découvrir CVMatch. », « 20 crédits IA par mois », « Support par e-mail ») alors que le reste de la page (titres, CTA, badge « Populaire ») est bien traduit — ce n'est pas un oubli généralisé mais un contenu spécifique jamais traduit, comme le code le documente lui-même dans un commentaire. C'est le pire endroit possible pour ce genre d'incohérence : au moment précis où un visiteur anglophone décide s'il paie. *(ID03, P1)*

Défaut cosmétique mineur observé sur les captures : à 1440 px, les boutons d'action des 3 cartes tarifaires ne s'alignent pas verticalement (la carte « Gratuit », plus courte, laisse un vide). *(ID14, P3)*

---

## 6. Audit UI et design system

Le design system est cohérent et centralisé : une seule palette de couleurs définie en `oklch` (teinte indigo/violette pour le primaire, teal pour les accents secondaires), un seul jeu de rayons de bordure dérivés d'une variable unique, des composants shadcn/base-ui réutilisés partout (`Button`, `Card`, `Badge`, `Table`, `Dialog`) sans variante ad hoc constatée dans les fichiers inspectés. Aucune incohérence de style répétée (boutons à styles divergents, espacements irréguliers) n'a été trouvée dans l'échantillon audité.

Le seul vrai défaut d'interface confirmé visuellement est **structurel plutôt que stylistique** : la page hub d'une offre (`/dashboard/jobs/[id]`) empile verticalement 4 blocs fonctionnels distincts (analyse ATS, CV adapté, lettre de motivation, formulaire d'édition complet de l'offre) dans une seule colonne contrainte à `max-w-3xl`, ce qui produit une page très longue (2500 à 3600 px selon la largeur d'écran mesurés) alors qu'à 1440 px, environ 400 px de marge inutilisée subsistent de chaque côté du contenu, à côté d'une barre latérale de 256 px. *(ID08, P2)*

| ID | Priorité | Page | Problème | Impact | Effort | Confiance | Recommandation |
|----|----------|------|----------|--------|--------|-----------|-----------------|
| U1 | P2 | `/dashboard/jobs/[id]` | Page très longue, colonne étroite malgré un large écran disponible | Moyen | Moyen-élevé | Confirmé (capture) | Explorer une mise en page à deux colonnes sur desktop (ex. analyse/CV/lettre à côté du formulaire d'édition), **à valider avant refonte** — voir section 13 |

---

## 7. Audit responsive et mobile

Testé à 375 px, 768 px et 1440 px sur un navigateur réel.

**Ce qui fonctionne bien**, confirmé par capture d'écran, sans besoin de correction :
- Landing, tarifs, inscription, connexion, outil ATS gratuit : aucun débordement, aucun chevauchement, boutons pleine largeur bien dimensionnés sur mobile.
- La grille `firstName`/`lastName` à deux colonnes du formulaire d'inscription reste lisible à 375 px (hypothèse initiale de resserrement excessif infirmée par la capture).
- Le tableau de bord (statistiques, en-tête, cartes) se réorganise proprement en une colonne sur mobile.
- Le tiroir de navigation mobile (menu hamburger) affiche correctement le nombre de crédits et le menu utilisateur en bas, sans nécessiter de défilement interne.

**Problèmes confirmés :**

1. **Bannière de cookies (`src/components/cookie-consent-banner.tsx`) — `position: fixed`, ancrée en bas, sans aucune réserve d'espace dans la mise en page.** Elle recouvre systématiquement ce qui se trouve en bas du premier écran visible, sur toutes les pages publiques, aux trois largeurs testées. Sur mobile, elle recouvre entièrement le bouton « Se connecter » du hero — un CTA cliquable rendu inaccessible tant que la bannière n'est pas fermée. *(ID01, P0)*
2. **Table des candidatures (`applications-table.tsx`) illisible sur mobile sans indice visuel.** À 375 px, seules ~2,2 colonnes sur 7 sont visibles ; la colonne « Ville » n'affiche qu'un seul caractère avant d'être coupée net, sans ombre, dégradé ou flèche indiquant qu'il faut faire défiler horizontalement. Un utilisateur qui ne sait pas déjà que la table défile peut raisonnablement croire qu'elle est cassée ou incomplète. *(ID07, P2)*
3. **Le champ de recherche de la nouvelle page « Offres » tronque son texte indicatif (`placeholder`) en plein milieu d'un mot, sans points de suspension**, à 375 px — lisible mais donne une impression d'inachevé. *(ID13, P3)*
4. Mesure approximative (estimation visuelle, non mesurée dans le DOM) : les éléments de navigation du tiroir mobile semblent avoir une hauteur tactile d'environ 36 px, sous le minimum généralement recommandé de ~44 px pour une cible tactile pouce. *(ID15, P3, confiance : probable, à vérifier avec un outil de mesure DOM)*

| ID | Priorité | Page | Problème | Impact | Effort | Confiance | Recommandation |
|----|----------|------|----------|--------|--------|-----------|-----------------|
| ID01 | **P0** | Toutes les pages publiques | Bannière cookies recouvre le CTA principal au premier chargement mobile | Élevé | Faible | Confirmé (capture + code) | Réserver l'espace en bas de page (padding body) ou repositionner la bannière pour qu'elle ne chevauche jamais un élément interactif |
| ID07 | P2 | `/dashboard/applications` | Table 7 colonnes illisible sur mobile, aucun indice de défilement | Moyen | Moyen | Confirmé (capture) | Ajouter un dégradé/ombre en bord de table, ou basculer vers des cartes empilées sous un breakpoint |
| ID13 | P3 | `/dashboard/jobs` | Placeholder de recherche tronqué mi-mot sur mobile | Faible | Faible | Confirmé (capture) | Raccourcir le texte indicatif ou le rendre responsive |
| ID15 | P3 | Tiroir de navigation mobile | Cibles tactiles ~36 px, sous les ~44 px recommandés | Faible | Faible | Probable (estimation visuelle) | Vérifier avec un outil de mesure DOM ; augmenter le `padding` vertical des liens si confirmé |

---

## 8. Audit accessibilité

**Confirmé par inspection de code** (pas de test automatisé exécuté) :

- Structure de formulaire systématique et correcte : `<Label htmlFor>` lié à chaque `<Input id>`, `aria-invalid` posé dynamiquement, `aria-describedby` pointant vers l'identifiant du message d'erreur correspondant, message d'erreur en `role="alert"`. Constaté à l'identique sur les formulaires d'inscription, de connexion et d'import de CV.
- Tous les boutons icône-seule échantillonnés portent un `aria-label` explicite et pertinent (bascule thème clair/sombre avec libellé qui change selon l'état, bouton favori, suppression d'une expérience du CV, ouverture du menu mobile).
- Le composant `Button` de base applique un anneau de focus visible (`focus-visible:ring-3`) de façon uniforme à toutes les variantes — le focus clavier n'est jamais supprimé.
- HTML sémantique respecté dans l'échantillon lu (`<header>`, `<aside>`, `<nav>` via les composants de layout, titres `<h1>`/`<h2>` hiérarchisés sur la page d'accueil).

**À vérifier avec un outil automatisé (non exécuté dans cet audit)** :
- Contraste réel des couleurs `--muted-foreground` et `--border` sur fond clair et sombre — les valeurs `oklch` ont été lues mais aucun ratio WCAG n'a été calculé ; ne pas présumer d'un résultat.
- Score Lighthouse/axe global de chaque page.

**À vérifier avec un test manuel (lecteur d'écran / clavier seul)**, non réalisable dans le cadre de cet audit :
- Navigation complète au clavier du tiroir mobile (`Sheet`) et des boîtes de dialogue (`AlertDialog`, `Dialog`) — le focus trap et le retour de focus après fermeture n'ont pas été testés en conditions réelles.
- Annonce des changements d'état dynamiques (résultat d'analyse ATS qui apparaît, toast de badge débloqué) par un lecteur d'écran.

Aucun problème d'accessibilité majeur n'a été identifié dans le code inspecté — l'équipe applique déjà les bonnes pratiques de base de façon disciplinée. Le point le plus concret à traiter est indirect : la bannière de cookies (ID01) bloque aussi l'accès **clavier/tactile** au bouton qu'elle recouvre, pas seulement visuellement.

---

## 9. Audit UX writing

Le ton général est clair, concret, sans jargon inutile, et cohérent avec un public non technique — conforme à la cible énoncée en introduction. Les messages d'erreur observés dans `src/lib/actions/*.ts` sont presque tous actionnables (« Vous pouvez réessayer ou saisir les informations manuellement » plutôt qu'un simple « Erreur »).

Deux problèmes concrets identifiés :

1. **Un message d'erreur Supabase peut fuiter tel quel, en anglais technique, dans une interface française.** Dans `mapAuthError` (`src/lib/actions/auth.ts`), seuls trois messages Supabase connus sont traduits (identifiants invalides, compte existant, e-mail non confirmé) ; tout autre message renvoyé par Supabase passe tel quel à l'utilisateur. C'est un filet de sécurité incomplet plutôt qu'un bug systématique — mais un cas non prévu (ex. erreur réseau Supabase, erreur de configuration) afficherait un texte anglais technique dans une interface par ailleurs entièrement française.
2. **L'incohérence de langue documentée en section 5/section 11** (formulaires produit restant français quelle que soit la langue choisie) est aussi, fondamentalement, un problème d'UX writing : le texte n'existe simplement pas en anglais pour ces écrans.

| ID | Priorité | Page/fichier | Texte actuel | Problème | Proposition | Justification |
|----|----------|------|-----------|----------|--------------|----------------|
| W1 | P3 | `src/lib/actions/auth.ts` (`mapAuthError`) | Passe le message Supabase brut si non reconnu | Risque de texte technique anglais dans une UI française | Ajouter un message générique de repli (« Une erreur est survenue. Merci de réessayer. ») pour tout message non mappé | Évite qu'un cas limite expose un texte non traduit ou trop technique à l'utilisateur final |

---

## 10. Audit de la confiance et de la transparence

C'est l'un des points les plus solides du produit, à créditer explicitement :

- La politique de confidentialité **nomme précisément** chaque sous-traitant (Supabase pour l'hébergement, Anthropic pour le traitement IA du CV, Stripe pour le paiement) plutôt que de rester vague sur « nos partenaires ».
- Elle affirme explicitement que les données ne sont **jamais utilisées pour entraîner des modèles d'IA** — une clarification que peu de produits IA grand public formulent aussi directement.
- Le produit répète, à deux endroits distincts du code (description de la fonctionnalité et texte affiché à l'utilisateur), que la génération de CV adapté ne « invente jamais d'expérience » — cohérence entre le discours marketing et le comportement réel constatée dans le code, pas seulement affirmée sur la page d'accueil.
- Le flux « Postuler » est honnête *avant* que l'utilisateur ne s'engage : la boîte de dialogue précise clairement, avant confirmation, que « CVMatch ne soumet pas votre candidature à votre place » — évite de laisser croire à une candidature en un clic qui n'existe pas.

Un point à nuancer, pas à corriger à l'aveugle : dans ce même flux, **le statut de la candidature passe à « Envoyé » dès la confirmation dans la boîte de dialogue**, avant que l'utilisateur n'ait nécessairement ouvert ou terminé la candidature réelle sur le site de l'employeur. Si l'utilisateur ferme l'onglet sans finaliser sa candidature, son propre suivi devient inexact. La transparence du message atténue le risque (l'utilisateur sait ce qui se passe), mais le moment exact où le statut bascule reste un choix de conception discutable plutôt qu'une erreur évidente — voir section 13 pour la mise en balance des alternatives.

Enfin, la page d'import de CV — le moment où l'utilisateur confie le plus de données personnelles au produit — **ne rappelle aucune information de confidentialité localement**. L'utilisateur doit aller chercher la politique de confidentialité via le pied de page pour comprendre ce qui arrive à son CV, alors que ce contenu existe déjà et est de bonne qualité.

| ID | Priorité | Page | Problème | Impact | Effort | Confiance | Recommandation |
|----|----------|------|----------|--------|--------|-----------|-----------------|
| T1 | P2 | `/dashboard/cv/upload` | Aucun rappel de confidentialité au point d'import du CV | Moyen (confiance) | Faible | Confirmé | Ajouter une ligne courte avec lien vers la politique de confidentialité, près du bouton d'import |
| T2 | P2 | `apply-dialog.tsx` | Le statut passe à « Envoyé » avant confirmation de la candidature réelle | Moyen (intégrité du suivi) | Moyen (choix produit) | Confirmé, mais correction à valider | Voir section 13 — plusieurs options possibles, à trancher avec le fondateur |

---

## 11. Audit de la performance perçue

Les états de chargement existent presque partout (`loading.tsx` + squelette `PageSkeleton` sur 14 des 15 routes du tableau de bord), et les actions IA longues affichent un bouton désactivé avec libellé changeant (« Analyse en cours... ») plus, pour certaines, des messages contextuels qui tournent (`AiLoadingHint`) — une bonne pratique pour des appels IA qui prennent plusieurs secondes.

Deux écarts confirmés par lecture de code :

- **`src/app/dashboard/jobs/[id]/cover-letter/` est la seule route du tableau de bord sans `loading.tsx`** — une navigation vers cette page n'affiche donc aucun squelette pendant le chargement des données serveur, contrairement à toutes les autres pages du produit.
- **La checklist de progression de l'import de CV est un minuteur fixe, pas un reflet du traitement réel** (déjà signalé en section 5, ID11) — un décalage entre la performance perçue affichée et la performance réelle, qui peut se retourner contre l'utilisateur si le traitement réel dépasse les délais programmés.

Aucune mesure de performance réelle (temps de réponse serveur, Core Web Vitals) n'a été exécutée dans cet audit — uniquement des observations structurelles sur la présence/absence d'états de chargement.

| ID | Priorité | Page | Problème | Impact | Effort | Confiance | Recommandation |
|----|----------|------|----------|--------|--------|-----------|-----------------|
| P1id | P3 | `/dashboard/jobs/[id]/cover-letter` | Absence de `loading.tsx`, seule route dans ce cas | Faible | Très faible | Confirmé | Ajouter un `loading.tsx` identique aux routes voisines (`tailored-cv`) |

---

## 12. Audit heuristique de Nielsen

Seules les heuristiques où un problème concret a été observé sont détaillées ci-dessous ; les autres (cohérence des standards, reconnaissance plutôt que rappel, design minimaliste) n'ont pas révélé de problème significatif dans l'échantillon audité.

**1. Visibilité de l'état du système** — Globalement bonne (badges de statut, barres de progression de crédits, squelettes de chargement). Faiblesse : le coût en crédits d'une action n'est pas visible avant de la déclencher (ID05) ; l'utilisateur ne sait donc pas, au moment de choisir, quel impact son clic aura sur son solde.

**3. Contrôle et liberté de l'utilisateur** — L'écran « Vérifiez votre boîte mail » (ID06) est une impasse sans action de retour. La bannière de cookies (ID01), tant qu'elle recouvre un élément, retire une liberté d'action à l'utilisateur sans qu'il l'ait choisi.

**5. Prévention des erreurs** — Les règles de mot de passe non annoncées à l'avance (ID04) créent un cycle prévisible d'erreurs évitables. À l'inverse, la double validation de fichier (type déclaré + signature binaire) est un bon exemple de prévention appliquée correctement.

**9. Aide à la récupération après erreur** — Globalement bien traité : messages d'erreur actionnables, boutons de nouvelle tentative sur les échecs d'analyse IA. Faiblesse : un message Supabase non mappé (W1) pourrait s'afficher tel quel, sans traduction ni reformulation.

**10. Aide et documentation** — Aucune aide contextuelle (infobulle, lien d'aide) constatée sur les actions les plus coûteuses en crédits ou les plus ambiguës (ex. ce que signifie exactement « Postuler » dans l'outil). Pas critique vu la simplicité générale de l'interface, mais à garder en tête si le produit se complexifie.

---

## 13. Audit de conversion

VISITEUR → COMPRÉHENSION → INSCRIPTION → PREMIÈRE ACTION → RÉSULTAT → RETOUR → MONÉTISATION

- **Visiteur → Compréhension** : rapide et clair (section 4). Seul frein réel : ID01 (bannière de cookies) au tout premier contact mobile.
- **Compréhension → Inscription** : CTA unique et répété, faible friction de formulaire (4-5 champs), mais ID04 (règles de mot de passe non annoncées) peut provoquer plusieurs allers-retours évitables juste avant la conversion.
- **Inscription → Première action** : le compte est créé, mais nécessite une confirmation par e-mail avant de pouvoir utiliser une fonctionnalité IA (`consumeCredits` bloque toute action IA tant que l'e-mail n'est pas confirmé) — logique anti-abus compréhensible, mais combinée à ID06 (écran de vérification sans recours), un e-mail de confirmation perdu ou en spam devient un blocage total sans échappatoire visible dans l'interface.
- **Première action → Résultat** : chemin cohérent (import CV → import offre → analyse/génération), coût en crédits caché jusqu'à l'action (ID05).
- **Résultat → Retour** : tableau de bord et badges donnent des raisons concrètes de revenir (statistiques, progression, récompenses en crédits) — bonne mécanique de rétention pour un produit qui vit d'un usage répété.
- **Retour → Monétisation** : page tarifs claire en français, mais cassée en anglais (ID03) — un visiteur anglophone qui arrive jusqu'à la décision de payer peut être rebuté par du contenu non traduit à ce moment précis, le pire endroit pour perdre confiance.

Aucune donnée de taux de conversion réelle n'existe dans le cadre de cet audit — toutes les évaluations ci-dessus sont qualitatives, fondées sur l'inspection du parcours, pas sur des mesures.

### Le cas du statut « Postuler » (T2) — options à trancher

Ce point est signalé ici plutôt que corrigé directement car il s'agit d'un arbitrage produit, pas d'un bug :

- **Option A (statu quo)** : le statut passe à « Envoyé » dès la confirmation — simple, rapide, mais peut désynchroniser le suivi si l'utilisateur abandonne la candidature réelle après coup.
- **Option B** : ajouter une étape de confirmation *après* l'ouverture du lien externe (« Avez-vous bien envoyé votre candidature ? »), plus fidèle à la réalité mais ajoute une étape et suppose que l'utilisateur revient sur CVMatch après avoir postulé ailleurs — ce qui n'est pas garanti non plus.
- **Option C** : renommer l'état actuel en quelque chose de moins définitif (« Candidature préparée » plutôt que « Envoyée ») jusqu'à confirmation explicite ultérieure.

Aucune de ces options n'est strictement meilleure sans savoir comment les utilisateurs réels se comportent après avoir cliqué — à trancher avec le fondateur, pas à implémenter unilatéralement.

---

## 14. Problèmes techniques ayant un impact UX

- `npx tsc --noEmit` et `eslint` : **aucune erreur** au moment de l'audit — base technique saine.
- **Aucune erreur ni avertissement console** détecté sur l'ensemble des pages publiques testées (6 pages × 3 largeurs), navigateur réel.
- **Aucun fichier `not-found.tsx` ni `error.tsx` n'existe nulle part dans l'application** (recherche exhaustive du dossier `src/app`). Toute URL invalide ou erreur serveur non gérée affiche la page par défaut, générique et non stylée, de Next.js — aucune cohérence de marque, aucun lien de retour vers le produit. *(ID09, P2)*
- **Un utilisateur non administrateur qui accède à `/dashboard/admin` (lien externe, favori, URL devinée) est silencieusement redirigé vers `/dashboard`, sans aucun message.** Confirmé dans `src/lib/data/admin.ts` (`requireAdmin`). Impact réel très faible puisque cette route n'est jamais liée dans l'interface pour un non-administrateur, mais un simple message expliquerait la redirection plutôt que de la laisser ressembler à un lien cassé. *(ID16, P3)*
- Le lien « politique de confidentialité » de la bannière de cookies pointe en dur vers `/fr/privacy`, même quand la bannière s'affiche en anglais — incohérence mineure liée à ID01. *(ID12, P3)*

Ce périmètre reste volontairement limité aux problèmes techniques qui affectent directement la compréhension ou la confiance de l'utilisateur — ce n'est pas un audit de sécurité. Aucune vulnérabilité de sécurité évidente n'a été rencontrée pendant cette lecture ciblée UX ; un audit de sécurité dédié resterait un exercice séparé.

---

## 15. Liste consolidée des problèmes

| ID | Priorité | Page | Problème | Impact | Effort | Confiance | Recommandation |
|----|----------|------|----------|--------|--------|-----------|-----------------|
| ID01 | **P0** | Toutes pages publiques | Bannière de cookies (`fixed`, bas d'écran, sans réserve d'espace) recouvre le CTA « Se connecter » du hero sur mobile au premier chargement | Élevé | Faible | Confirmé (capture + code) | Réserver l'espace ou repositionner pour ne jamais chevaucher un élément interactif |
| ID02 | P1 | Tout le tableau de bord (CV, offres, candidatures, badges, admin) | Contenu produit 100 % français quelle que soit la langue choisie, malgré un site public bilingue | Élevé | Élevé (chantier de contenu) | Confirmé (code + commentaire explicite) | Prioriser la traduction des pages à plus fort trafic EN d'abord (éditeur CV, page offre) ; documenter le reste comme dette connue |
| ID03 | P1 | `/en/pricing` | Noms/descriptions/fonctionnalités des forfaits restent en français dans la page anglaise | Élevé (au moment du paiement) | Moyen | Confirmé (capture) | Traduire `PUBLIC_PLANS` (nom, description, features) par locale |
| ID04 | P1 | `/register` | Règles de mot de passe non annoncées avant soumission ; une seule erreur affichée à la fois | Moyen-élevé | Faible-moyen | Confirmé (code) | Afficher les règles sous le champ avant saisie, ou lister toutes les erreurs actives simultanément |
| ID05 | P1 | Page offre (analyse ATS, CV adapté, lettre) | Aucun coût en crédits affiché avant de cliquer sur une action IA | Moyen-élevé | Faible | Confirmé (code) | Afficher « 1 crédit », « 3 crédits » etc. à côté du bouton, à partir de `CREDIT_COSTS` déjà existant |
| ID06 | P2 | `/register` (écran post-inscription) | Écran « Vérifiez votre boîte mail » sans bouton de renvoi ni retour | Moyen | Faible | Confirmé (code) | Ajouter un bouton « Renvoyer l'e-mail » et un lien retour vers la connexion |
| ID07 | P2 | `/dashboard/applications` | Table 7 colonnes illisible sur mobile, aucun indice de défilement horizontal | Moyen | Moyen | Confirmé (capture) | Ombre/dégradé de bord, ou vue en cartes empilées sous breakpoint mobile |
| ID08 | P2 | `/dashboard/jobs/[id]` | Page très longue (jusqu'à 3600 px), colonne étroite malgré large écran disponible | Moyen | Moyen-élevé | Confirmé (capture) | Explorer une mise en page à deux colonnes sur desktop — à valider avant implémentation |
| ID09 | P2 | Toute l'application | Aucune page 404/erreur personnalisée | Moyen | Faible | Confirmé (recherche fichiers) | Ajouter `not-found.tsx` et `error.tsx` avec navigation de retour |
| T1 | P2 | `/dashboard/cv/upload` | Aucun rappel de confidentialité au moment de l'import du CV | Moyen (confiance) | Faible | Confirmé | Ajouter une ligne courte + lien vers la politique de confidentialité |
| T2 | P2 | `apply-dialog.tsx` | Statut « Envoyé » posé avant confirmation de la candidature réelle | Moyen (intégrité des données) | Moyen (arbitrage produit) | Confirmé, correction à discuter | Voir section 13, plusieurs options possibles |
| ID11 | P2 | `/dashboard/cv/upload` | Checklist de progression cosmétique (minuteur fixe), non connectée au traitement réel | Faible-moyen | Faible-moyen | Confirmé (code) | Remplacer par une progression indéterminée honnête, ou ajouter une estimation de temps |
| ID13 | P3 | `/dashboard/jobs` | Placeholder de recherche tronqué mi-mot sur mobile | Faible | Faible | Confirmé (capture) | Raccourcir le texte indicatif |
| ID14 | P3 | `/pricing` | Boutons des 3 cartes tarifaires non alignés verticalement à 1440 px | Faible | Faible | Confirmé (capture) | `mt-auto` sur le pied de carte |
| ID15 | P3 | Tiroir de navigation mobile | Cibles tactiles ~36 px, sous les ~44 px recommandés | Faible | Faible | Probable (estimation visuelle) | Vérifier par mesure DOM, ajuster le padding si confirmé |
| ID16 | P3 | `/dashboard/admin` | Redirection silencieuse d'un non-administrateur, sans message | Très faible | Très faible | Confirmé (code) | Toast explicatif avant redirection |
| ID12 | P3 | Bannière de cookies | Lien de confidentialité en dur vers `/fr/privacy` même en version anglaise | Faible | Très faible | Confirmé (code) | Lier dynamiquement selon la locale active |
| W1 | P3 | `mapAuthError` | Message Supabase non mappé affiché tel quel (risque de texte technique anglais) | Faible | Faible | Confirmé (code) | Message de repli générique pour tout cas non reconnu |
| V1 | P3 | `/` | 8 fonctionnalités listées à plat sans hiérarchie cœur/secondaire | Faible-moyen | Faible | Hypothèse à tester | Regrouper visuellement les fonctionnalités cœur en avant |

---

## 16. Plan d'action priorisé

### Corrections rapides (faible effort, fort bénéfice, faible risque)
- ID01 — Repositionner/réserver l'espace de la bannière de cookies.
- ID05 — Afficher le coût en crédits à côté de chaque bouton d'action IA.
- ID09 — Ajouter `not-found.tsx` / `error.tsx`.
- ID06 — Bouton de renvoi d'e-mail + lien retour sur l'écran post-inscription.
- ID14 — Aligner les boutons des cartes tarifaires.
- ID12 — Lien de confidentialité dynamique dans la bannière de cookies.
- W1 — Message de repli générique pour les erreurs Supabase non mappées.

### Améliorations prioritaires (impactent les parcours principaux)
- ID04 — Annoncer les règles de mot de passe avant soumission.
- ID07 — Affordance de défilement (ou vue alternative) pour la table des candidatures sur mobile.
- T1 — Rappel de confidentialité au moment de l'import du CV.
- ID11 — Rendre la progression d'import de CV honnête vis-à-vis du traitement réel.
- ID13 — Corriger le placeholder tronqué de la recherche d'offres.

### Améliorations intermédiaires (refonte partielle de composants)
- ID08 — Repenser la mise en page de la page hub d'une offre pour desktop.
- T2 — Trancher et implémenter l'une des options du statut « Postuler ».
- ID15 — Vérifier et corriger la taille des cibles tactiles du tiroir mobile.

### Évolutions nécessitant une validation supplémentaire
- ID02 / ID03 — Chantier de traduction complète du produit (CV, offres, candidatures, badges, admin, forfaits) : ampleur de contenu significative, à planifier comme projet propre, pas comme correctif ponctuel. Recommandation : prioriser d'abord la page tarifs (ID03, effort moyen, impact direct sur la conversion payante) avant le reste du produit (ID02, effort élevé).
- V1 — Réorganisation de la section fonctionnalités de la page d'accueil, à valider par un test utilisateur avant de toucher à un contenu qui fonctionne déjà raisonnablement bien.

---

## 17. Hypothèses à tester avec de vrais utilisateurs

- **V1** : la liste à plat de 8 fonctionnalités nuit-elle réellement à la compréhension, ou les visiteurs filtrent-ils naturellement ? À vérifier par test utilisateur ou heatmap (où les yeux/clics se concentrent réellement sur cette section).
- **ID08** : la longueur de la page offre provoque-t-elle un abandon mesurable, ou les utilisateurs scrollent-ils sans friction ? À vérifier avec des données analytiques réelles (profondeur de scroll, taux de sortie sur cette page) avant d'investir dans une refonte.
- **T2** : quel comportement réel les utilisateurs ont-ils après avoir cliqué « Confirmer la candidature » — reviennent-ils sur CVMatch après avoir réellement postulé, ou abandonnent-ils en cours de route ? Cette donnée trancherait directement entre les options A/B/C de la section 13.
- **ID11** : la checklist de progression cosmétique aide-t-elle réellement à faire patienter, ou sa nature « figée » en cas de traitement long crée-t-elle plus d'anxiété qu'une barre de progression indéterminée honnête ? Testable en A/B.
- **ID04** : combien de tentatives d'inscription échouent réellement à cause des règles de mot de passe non annoncées ? Mesurable via le taux d'erreurs de validation côté serveur, si un tel suivi existe ou peut être ajouté.
- **Accessibilité** : contraste réel des couleurs (outil automatisé), navigation clavier complète des dialogues et du tiroir mobile (test manuel), compatibilité lecteur d'écran (test manuel) — aucun n'a pu être exécuté dans le cadre de cet audit.
- **Score de performance réel** (Core Web Vitals, Lighthouse) — non mesuré ici, à exécuter séparément.

---

## 18. Conclusion

CVMatch part d'une base solide : proposition de valeur honnête, modèle de tarification transparent, formulaires accessibles par défaut, et une vraie discipline de confiance vis-à-vis du traitement IA des données personnelles — des qualités qui ne s'improvisent généralement pas à ce stade d'un projet. Les problèmes identifiés dans cet audit sont, pour la plupart, des corrections ponctuelles à faible risque plutôt que des défauts de conception profonds.

Deux priorités ressortent clairement pour la suite :

1. **Corriger la bannière de cookies (ID01) et ajouter la visibilité du coût en crédits (ID05) en premier** — les deux sont à faible effort, fort impact, et touchent respectivement le tout premier contact et le cœur du modèle économique.
2. **Traiter le bilinguisme du produit (ID02/ID03) comme un chantier de contenu à part entière**, en commençant par la page tarifs qui est le point de friction le plus visible et le plus coûteux en conversion, plutôt que de laisser la promesse « site bilingue » se déliter silencieusement à chaque page produit.

Les prochaines étapes recommandées : traiter la liste des corrections rapides (section 16) sans attendre, présenter les améliorations intermédiaires et les évolutions nécessitant une validation au fondateur avant toute implémentation (conformément au périmètre de cet audit, qui ne modifie aucun code sans accord explicite), et mettre en place un minimum de mesure (analytics de scroll sur la page offre, suivi des erreurs de validation d'inscription) avant d'investir du temps dans les points actuellement classés comme hypothèses plutôt que faits confirmés.
