import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site.config";
import { siteUrl } from "@/lib/seo/metadata";
import {
  locationPath,
  locationServicePath,
  servicePath,
} from "@/lib/paths";

/**
 * Every indexable route, generated from the config. New services or studios
 * appear here automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/locations`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/book`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/manage-appointment`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/insurance-pricing`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = siteConfig.services.map(
    (service) => ({
      url: `${siteUrl}${servicePath(service.slug)}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const locationRoutes: MetadataRoute.Sitemap = siteConfig.locations.map(
    (location) => ({
      url: `${siteUrl}${locationPath(location.slug)}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const combinedRoutes: MetadataRoute.Sitemap = siteConfig.locations.flatMap(
    (location) =>
      siteConfig.services.map((service) => ({
        url: `${siteUrl}${locationServicePath(location.slug, service.slug)}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  );

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...locationRoutes,
    ...combinedRoutes,
  ];
}
