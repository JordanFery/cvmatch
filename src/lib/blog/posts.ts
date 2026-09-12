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
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
