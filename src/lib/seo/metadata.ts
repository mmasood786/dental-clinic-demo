import type { Metadata } from "next";

import { siteConfig } from "@/config/site.config";

/** Site origin without a trailing slash, e.g. `https://www.example.com`. */
export const siteUrl = siteConfig.url.replace(/\/$/, "");

/** Turns a route path into a fully qualified URL. */
export function absoluteUrl(path = "/"): string {
  if (path === "/") {
    return siteUrl;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Keeps meta descriptions inside the ~155 character window search engines
 * usually render, cutting on a word boundary rather than mid-word.
 */
export function clampDescription(text: string, maxLength = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();

  if (clean.length <= maxLength) {
    return clean;
  }

  const slice = clean.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;

  return `${cut.replace(/[.,;:!?]$/, "")}…`;
}

type PageMetadataInput = {
  /** Page title without the clinic name; the root layout template adds that. */
  title: string;
  description: string;
  /** Canonical route path, e.g. `/services/implants`. */
  path: string;
  noIndex?: boolean;
};

/**
 * One source for every page's title, description, canonical and Open Graph
 * tags. Pages only pass their own unique values.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const summary = clampDescription(description);

  return {
    title,
    description: summary,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      title,
      description: summary,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
