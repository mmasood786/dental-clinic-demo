/** Canonical internal paths, so links, canonicals and the sitemap agree. */

export function servicePath(slug: string): string {
  return `/services/${slug}`;
}

export function locationPath(slug: string): string {
  return `/locations/${slug}`;
}

export function locationServicePath(
  locationSlug: string,
  serviceSlug: string,
): string {
  return `/locations/${locationSlug}/${serviceSlug}`;
}

/** Booking funnel, optionally preselecting a treatment. */
export function bookingPath(serviceSlug?: string): string {
  return serviceSlug
    ? `/book?service=${encodeURIComponent(serviceSlug)}`
    : "/book";
}
