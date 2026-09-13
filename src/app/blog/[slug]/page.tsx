import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAuthUser } from "@/lib/data/profile";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site-url";
import { QuestCeQuUnAts } from "@/content/blog/quest-ce-qu-un-ats";
import { AdapterSonCvAChaqueOffre } from "@/content/blog/adapter-son-cv-a-chaque-offre";
import { PourquoiVotreCvEstRejeteAvantDetreLu } from "@/content/blog/pourquoi-votre-cv-est-rejete-avant-detre-lu";
import { LettreDeMotivationAvecIa } from "@/content/blog/lettre-de-motivation-avec-ia";
import { CombienDeCandidaturesParJour } from "@/content/blog/combien-de-candidatures-par-jour";
import { OrganiserSonSuiviDeCandidatures } from "@/content/blog/organiser-son-suivi-de-candidatures";
import { IaEtCvCeQuilFautSavoir } from "@/content/blog/ia-et-cv-ce-quil-faut-savoir";
import { CvFrancaisVsAnglaisCanada } from "@/content/blog/cv-francais-vs-anglais-canada";
import { RelancerUnRecruteurApresUneCandidature } from "@/content/blog/relancer-un-recruteur-apres-une-candidature";

// Static import per post rather than a dynamic component map — with only a
// handful of articles this stays simple and fully type-checked; a CMS or
// MDX pipeline would only be worth the extra complexity at a much larger
// volume of posts.
const CONTENT: Record<string, () => React.ReactElement> = {
  "quest-ce-qu-un-ats": QuestCeQuUnAts,
  "adapter-son-cv-a-chaque-offre": AdapterSonCvAChaqueOffre,
  "pourquoi-votre-cv-est-rejete-avant-detre-lu": PourquoiVotreCvEstRejeteAvantDetreLu,
  "lettre-de-motivation-avec-ia": LettreDeMotivationAvecIa,
  "combien-de-candidatures-par-jour": CombienDeCandidaturesParJour,
  "organiser-son-suivi-de-candidatures": OrganiserSonSuiviDeCandidatures,
  "ia-et-cv-ce-quil-faut-savoir": IaEtCvCeQuilFautSavoir,
  "cv-francais-vs-anglais-canada": CvFrancaisVsAnglaisCanada,
  "relancer-un-recruteur-apres-une-candidature": RelancerUnRecruteurApresUneCandidature,
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
}

function structuredData(post: NonNullable<ReturnType<typeof getBlogPost>>) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "CVMatch" },
    url: `${SITE_URL}/blog/${post.slug}`,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const Content = CONTENT[slug];
  if (!post || !Content) notFound();

  const [{ dict, locale }, user] = await Promise.all([getDictionary(), getAuthUser()]);

  return (
    <div className="flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(post)) }}
      />
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Retour au blog
          </Link>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min de lecture
          </p>

          <div className="mt-10">
            <Content />
          </div>
        </article>
      </main>
      <LandingFooter dict={dict} />
    </div>
  );
}
