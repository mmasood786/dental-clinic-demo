import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo/metadata";

/**
 * Lets crawlers index the marketing site while keeping API endpoints and the
 * staff analytics dashboard out of the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
