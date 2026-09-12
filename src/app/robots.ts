import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Everything behind auth is private, per-user data — nothing here
      // should ever be indexed, and there's no public content to crawl.
      disallow: ["/dashboard/", "/api/", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
