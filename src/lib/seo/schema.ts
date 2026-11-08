import type {
  Address,
  Location,
  OpeningHours,
  Service,
  ServiceFaq,
} from "@/config/site.config";
import { siteConfig } from "@/config/site.config";

import { absoluteUrl, siteUrl } from "./metadata";

/** A schema.org node, kept loose so builders stay readable. */
export type SchemaNode = Record<string, unknown>;

/**
 * Aggregate rating passed to `dentistSchema` only when the numbers come from a
 * real source (the Google Places API), never from placeholder content.
 */
export type AggregateRating = {
  ratingValue: number;
  reviewCount: number;
};

/** Minimal shape of a breadcrumb, matching the UI component. */
export type SchemaCrumb = {
  label: string;
  href?: string;
};

export const clinicId = `${siteUrl}/#dentist`;
export const websiteId = `${siteUrl}/#website`;

export function locationId(location: Location): string {
  return `${absoluteUrl(`/locations/${location.slug}`)}#dentist`;
}

export function postalAddress(address: Address): SchemaNode {
  return {
    "@type": "PostalAddress",
    streetAddress: [address.line1, address.line2].filter(Boolean).join(", "),
    addressLocality: address.city,
    addressRegion: address.state,
    postalCode: address.postalCode,
    addressCountry: address.country,
  };
}

/**
 * Groups weekdays that share the same hours, which is the shape Google
 * recommends instead of one specification per day.
 */
export function openingHoursSpecification(hours: OpeningHours[]): SchemaNode[] {
  const groups = new Map<string, string[]>();

  for (const entry of hours) {
    if (!entry.opens || !entry.closes) {
      continue;
    }

    const key = `${entry.opens}|${entry.closes}`;
    const days = groups.get(key) ?? [];
    days.push(`https://schema.org/${entry.day}`);
    groups.set(key, days);
  }

  return [...groups.entries()].map(([key, dayOfWeek]) => {
    const [opens, closes] = key.split("|");

    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek,
      opens,
      closes,
    };
  });
}

function servicesCatalog(): SchemaNode {
  return {
    "@type": "OfferCatalog",
    name: "Dental treatments",
    itemListElement: siteConfig.services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.shortDescription,
        url: absoluteUrl(`/services/${service.slug}`),
      },
      ...(service.priceFrom !== null
        ? { price: service.priceFrom, priceCurrency: siteConfig.currency }
        : {}),
    })),
  };
}

/**
 * The practice itself. Without a location this is the main clinic for the home
 * page; with one it is that studio, linked back to the main clinic with
 * `branchOf`. `aggregateRating` is only passed when live Google data exists,
 * because inventing rating markup is a structured-data violation.
 */
export function dentistSchema(
  location?: Location,
  aggregateRating?: AggregateRating | null,
): SchemaNode {
  const address = location?.address ?? siteConfig.address;
  const geo = location?.geo ?? siteConfig.geo;
  const path = location ? `/locations/${location.slug}` : "/";

  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": location ? locationId(location) : clinicId,
    name: location
      ? `${siteConfig.name} — ${location.area}`
      : siteConfig.name,
    description: location
      ? `${siteConfig.name} dental studio in ${location.area}, ${location.city}. ${location.description}`
      : siteConfig.description,
    url: absoluteUrl(path),
    telephone: location?.phone ?? siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.seo.priceRange,
    address: postalAddress(address),
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.lat,
      longitude: geo.lng,
    },
    openingHoursSpecification: openingHoursSpecification(
      siteConfig.openingHours,
    ),
    sameAs: siteConfig.social.map((link) => link.url),
    areaServed: siteConfig.seo.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    ...(aggregateRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(location
      ? { branchOf: { "@id": clinicId } }
      : { hasOfferCatalog: servicesCatalog() }),
  };
}

export function websiteSchema(): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-US",
    publisher: { "@id": clinicId },
  };
}

function offerFor(service: Service, url: string): SchemaNode | null {
  if (service.priceFrom === null) {
    return null;
  }

  return {
    "@type": "Offer",
    price: service.priceFrom,
    priceCurrency: siteConfig.currency,
    url,
    description: "Starting price, confirmed in writing after an examination.",
  };
}

export function serviceSchema(service: Service): SchemaNode {
  const url = absoluteUrl(`/services/${service.slug}`);
  const offer = offerFor(service, url);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.shortDescription,
    url,
    provider: {
      "@type": "Dentist",
      "@id": clinicId,
      name: siteConfig.name,
      telephone: siteConfig.phone,
      address: postalAddress(siteConfig.address),
    },
    areaServed: siteConfig.seo.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    ...(offer ? { offers: offer } : {}),
  };
}

/**
 * The service offered at one studio, used on the combined
 * `/locations/[city]/[service]` landing pages.
 */
export function locationServiceSchema(
  service: Service,
  location: Location,
): SchemaNode {
  const url = absoluteUrl(`/locations/${location.slug}/${service.slug}`);
  const offer = offerFor(service, url);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `${service.title} in ${location.area}, ${location.city}`,
    serviceType: service.title,
    description: service.shortDescription,
    url,
    provider: {
      "@type": "Dentist",
      "@id": locationId(location),
      name: `${siteConfig.name} — ${location.area}`,
      telephone: location.phone,
      address: postalAddress(location.address),
    },
    areaServed: [
      { "@type": "City", name: location.city },
      { "@type": "Place", name: `${location.area}, ${location.city}` },
    ],
    ...(offer ? { offers: offer } : {}),
  };
}

export function faqPageSchema(faqs: ServiceFaq[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList built from the same crumbs the page shows in its hero, so the
 * visible trail and the structured data can never drift apart.
 */
export function breadcrumbSchema(
  crumbs: SchemaCrumb[],
  currentPath: string,
): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href ?? currentPath),
    })),
  };
}

export function itemListSchema(
  name: string,
  items: Array<{ name: string; path: string }>,
): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
