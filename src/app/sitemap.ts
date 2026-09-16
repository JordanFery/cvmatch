import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site-url";

// Genuinely bilingual pages (dictionary-driven, real /en content) — see
// i18n plan A1. Privacy/terms/blog stay French-only (A6) and are listed
// separately below.
const DUAL_LOCALE_PATHS: { path: string; changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  // Flagship free-tool SEO entry point — see the growth strategy discussion.
  { path: "/tools/ats-score", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/register", changeFrequency: "yearly", priority: 0.5 },
  { path: "/login", changeFrequency: "yearly", priority: 0.3 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const dualLocaleEntries: MetadataRoute.Sitemap = DUAL_LOCALE_PATHS.flatMap(({ path, changeFrequency, priority }) =>
    (["fr", "en"] as const).map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          fr: `${SITE_URL}/fr${path}`,
          en: `${SITE_URL}/en${path}`,
        },
      },
    })),
  );

  return [
    ...dualLocaleEntries,
    { url: `${SITE_URL}/fr/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/fr/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/fr/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE_URL}/fr/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
