import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAuthUser } from "@/lib/data/profile";
import { BLOG_POSTS } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conseils concrets pour optimiser votre CV, passer les filtres ATS et structurer votre recherche d'emploi.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogIndexPage() {
  const [{ dict, locale }, user] = await Promise.all([getDictionary(), getAuthUser()]);
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="flex min-h-full flex-col">
      <LandingNavbar dict={dict} locale={locale} isAuthenticated={!!user} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Conseils concrets pour optimiser votre CV, passer les filtres ATS et structurer votre recherche
            d&apos;emploi.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full transition-colors hover:border-foreground/30">
                  <CardHeader>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min de lecture
                    </p>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter dict={dict} />
    </div>
  );
}
