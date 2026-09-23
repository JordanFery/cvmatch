export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) — used for both display and sitemap lastModified. */
  publishedAt: string;
  readingTimeMinutes: number;
};

// Ordered newest first — the source of truth for /blog, /blog/[slug], and
// the sitemap. Add a new entry here plus its content component in
// src/content/blog/ and the matching case in src/app/blog/[slug]/page.tsx.
export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "quest-ce-qu-un-ats",
    title: "Qu'est-ce qu'un ATS, et pourquoi votre CV doit être compatible",
    description:
      "La plupart des candidatures sont filtrées par un logiciel avant d'atteindre un recruteur. Voici comment ces systèmes lisent votre CV et ce qui les fait échouer.",
    publishedAt: "2026-09-15",
    readingTimeMinutes: 6,
  },
  {
    slug: "adapter-son-cv-a-chaque-offre",
    title: "Faut-il vraiment un CV différent pour chaque offre d'emploi ?",
    description:
      "Envoyer le même CV partout est le réflexe le plus naturel — et le moins efficace. Ce qui change vraiment d'une candidature à l'autre, et ce qui ne doit jamais changer.",
    publishedAt: "2026-09-15",
    readingTimeMinutes: 5,
  },
  {
    slug: "pourquoi-votre-cv-est-rejete-avant-detre-lu",
    title: "5 raisons pour lesquelles votre CV est rejeté avant d'être lu par un humain",
    description:
      "Un format trop créatif, des intitulés de poste mal alignés, des mots-clés absents : les erreurs les plus courantes qui éliminent un CV avant même l'entretien.",
    publishedAt: "2026-09-15",
    readingTimeMinutes: 7,
  },
  {
    slug: "lettre-de-motivation-avec-ia",
    title: "Rédiger une lettre de motivation avec l'IA sans qu'elle sonne générique",
    description:
      "La plupart des lettres générées par IA se ressemblent toutes. Voici ce qui fait vraiment la différence, et comment l'IA peut aider sans produire un texte interchangeable.",
    publishedAt: "2026-09-16",
    readingTimeMinutes: 5,
  },
  {
    slug: "combien-de-candidatures-par-jour",
    title: "Combien de candidatures faut-il envoyer par jour ?",
    description:
      "Le volume ne compense pas la qualité. Un repère réaliste pour avancer sans s'épuiser, et pourquoi perdre le fil coûte souvent plus cher que le manque de candidatures.",
    publishedAt: "2026-09-16",
    readingTimeMinutes: 4,
  },
  {
    slug: "organiser-son-suivi-de-candidatures",
    title: "Comment organiser son suivi quand on a plusieurs candidatures en cours",
    description:
      "Tableur, boîte mail, onglets ouverts partout : le système que beaucoup finissent par utiliser, et pourquoi il craque dès que la recherche s'intensifie.",
    publishedAt: "2026-09-16",
    readingTimeMinutes: 5,
  },
  {
    slug: "ia-et-cv-ce-quil-faut-savoir",
    title: "Faut-il utiliser l'intelligence artificielle pour son CV ?",
    description:
      "Le vrai risque n'est pas l'IA elle-même, c'est ce qu'on lui demande de faire. Ce qui distingue un usage utile d'un usage qui peut se retourner contre vous en entretien.",
    publishedAt: "2026-09-16",
    readingTimeMinutes: 5,
  },
  {
    slug: "cv-francais-vs-anglais-canada",
    title: "CV en français ou en anglais : que choisir pour postuler au Canada ?",
    description:
      "La réponse dépend de l'entreprise, du secteur et de la région. Quelques repères concrets pour trancher, et l'erreur la plus fréquente à éviter.",
    publishedAt: "2026-09-16",
    readingTimeMinutes: 5,
  },
  {
    slug: "relancer-un-recruteur-apres-une-candidature",
    title: "Comment relancer un recruteur sans paraître insistant",
    description:
      "Beaucoup de candidatures se perdent simplement dans le volume reçu par un recruteur. Quand relancer, comment le faire, et pourquoi c'est surtout une question d'organisation.",
    publishedAt: "2026-09-16",
    readingTimeMinutes: 4,
  },
  {
    slug: "cv-reconversion-professionnelle",
    title: "CV pour une reconversion professionnelle : comment valoriser une expérience différente",
    description:
      "Changer de métier ne veut pas dire repartir de zéro. Comment identifier ce qui se transfère réellement d'un parcours à l'autre, sans jamais exagérer ce qu'il contient.",
    publishedAt: "2026-09-17",
    readingTimeMinutes: 5,
  },
  {
    slug: "cv-nouvel-arrivant-canada",
    title: "CV de nouvel arrivant au Canada : quelles sections garder, lesquelles retirer",
    description:
      "Photo, âge, situation familiale, signature : ce qui doit disparaître d'un CV formaté pour un autre pays, ce qu'il faut ajouter à la place, et comment présenter une expérience obtenue à l'étranger.",
    publishedAt: "2026-09-21",
    readingTimeMinutes: 6,
  },
  {
    slug: "erreurs-de-mise-en-forme-cv-ats",
    title: "Les erreurs de mise en forme qui empêchent un ATS de lire votre CV",
    description:
      "Colonnes, tableaux, en-têtes, images, PDF scanné : les pièges de mise en page les plus courants qui rendent un CV invisible pour un logiciel de tri, et comment vérifier le vôtre en 2 minutes.",
    publishedAt: "2026-09-23",
    readingTimeMinutes: 6,
  },
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
