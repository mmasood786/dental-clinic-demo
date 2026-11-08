import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  TrackedCallLink,
  TrackedDirectionsLink,
} from "@/components/analytics/tracked-links";
import { ContactActions } from "@/components/cta/contact-actions";
import {
  ArrowRightIcon,
  CalendarIcon,
  ExternalLinkIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";
import { Container } from "@/components/layout/container";
import { MapEmbed } from "@/components/locations/map-embed";
import { LocationHours } from "@/components/sections/location-hours";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { ReviewsSkeleton } from "@/components/reviews/reviews-skeleton";
import { ReviewsWidget } from "@/components/reviews/reviews-widget";
import { HeroChip, PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { getLocation, siteConfig } from "@/config/site.config";
import { directionsHref, formatAddress, mailtoHref } from "@/lib/contact";
import { locationPath, locationServicePath } from "@/lib/paths";
import { aggregateRatingFrom, getGoogleReviews } from "@/lib/reviews";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, dentistSchema } from "@/lib/seo/schema";

type LocationPageProps = {
  params: Promise<{ slug: string }>;
};

// Re-render at most daily so live Google review data stays fresh.
export const revalidate = 86400;

export function generateStaticParams() {
  return siteConfig.locations.map((location) => ({ slug: location.slug }));
}

// See services/[slug]/page.tsx: unknown slugs must 404 before streaming starts.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);

  if (!location) {
    return { title: "Location not found" };
  }

  return pageMetadata({
    title: `Dentist in ${location.area}, ${location.city}`,
    description: `Visit ${siteConfig.name} in ${location.area}, ${location.city}. Address, opening hours, directions and phone number for our ${location.area} dental studio.`,
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = getLocation(slug);

  if (!location) {
    notFound();
  }

  const otherLocations = siteConfig.locations.filter(
    (item) => item.slug !== location.slug,
  );
  const address = formatAddress(location.address);
  const directions = directionsHref(address);
  const reviews = await getGoogleReviews();
  const aggregateRating = aggregateRatingFrom(reviews);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: `${location.area}, ${location.city}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          dentistSchema(location, aggregateRating),
          breadcrumbSchema(crumbs, `/locations/${location.slug}`),
        ]}
      />

      <PageHero
        eyebrow={`${location.area} studio`}
        title={`Dentist in ${location.area}, ${location.city}`}
        intro={location.description}
        breadcrumbs={crumbs}
        actions={
          <>
            <TrackedDirectionsLink
              href={directions}
              placement="location-hero"
              location={location.slug}
              ariaLabel={`Get directions to the ${location.area} studio`}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto sm:text-base"
            >
              <MapPinIcon className="size-4" />
              Get directions
            </TrackedDirectionsLink>
            <TrackedCallLink
              phone={location.phone}
              placement="location-hero"
              location={location.slug}
              size="lg"
              variant="secondary"
              ariaLabel={`Call the ${location.area} studio on ${location.phone}`}
              className="w-full sm:w-auto"
            >
              <PhoneIcon className="size-4 text-brand" />
              {location.phone}
            </TrackedCallLink>
          </>
        }
        highlights={
          <>
            <HeroChip icon={<MapPinIcon className="size-3.5 text-brand" />}>
              {address}
            </HeroChip>
            <HeroChip icon={<CalendarIcon className="size-3.5 text-brand" />}>
              New patients welcome
            </HeroChip>
          </>
        }
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-12">
          <div className="min-w-0 space-y-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <ScrollReveal className="h-full">
                <div className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
                  <h2 className="font-display text-xl font-semibold text-ink">
                    Address &amp; contact
                  </h2>
                  <address className="mt-4 flex-1 space-y-3 text-sm not-italic">
                    <p className="flex gap-2 text-ink/80">
                      <MapPinIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                      {address}
                    </p>
                    <TrackedCallLink
                      phone={location.phone}
                      placement="location-page"
                      location={location.slug}
                      className="flex items-center gap-2 font-semibold text-ink transition-colors hover:text-brand"
                    >
                      <PhoneIcon className="size-4 text-brand" />
                      {location.phone}
                    </TrackedCallLink>
                    <a
                      href={mailtoHref}
                      className="flex items-center gap-2 break-all text-muted transition-colors hover:text-brand"
                    >
                      <MailIcon className="size-4 shrink-0 text-brand" />
                      {siteConfig.email}
                    </a>
                  </address>
                  <TrackedDirectionsLink
                    href={directions}
                    placement="location-page"
                    location={location.slug}
                    className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Get directions
                    <ExternalLinkIcon className="size-3.5" />
                  </TrackedDirectionsLink>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={80} className="h-full">
                <div className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
                  <h2 className="font-display text-xl font-semibold text-ink">
                    Treatments here
                  </h2>
                  <ul className="mt-4 flex-1 space-y-1 text-sm">
                    {siteConfig.services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={locationServicePath(location.slug, service.slug)}
                          className="flex min-h-10 items-center justify-between gap-3 border-b border-ink/5 text-ink transition-colors last:border-0 hover:text-brand"
                        >
                          <span>{service.title}</span>
                          <ArrowRightIcon className="size-4 shrink-0 text-brand" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/services"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand"
                  >
                    Compare all treatments
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal>
              <div>
                <h2 className="font-display text-h3 text-ink">
                  Find the {location.area} studio
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  We are at {address}. Use the map for live traffic and parking,
                  or call the studio if you need help finding us.
                </p>
                <MapEmbed
                  src={location.mapEmbedUrl}
                  title={`Map showing ${siteConfig.name} at ${address}`}
                  className="mt-4 shadow-card"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div>
                <h2 className="font-display text-h3 text-ink">
                  Looking for a dentist in {location.city}?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink/75">
                  Our {location.area} studio offers{" "}
                  {siteConfig.services
                    .map((service) => service.title.toLowerCase())
                    .join(", ")}{" "}
                  and more, all under one roof. Every appointment includes a
                  written plan and a fixed price before treatment begins, and we
                  bill most major insurers directly.
                </p>
                <p className="mt-3 text-base leading-relaxed text-ink/75">
                  We hold same-day slots for emergencies every day we are open.
                  If you are in pain, call{" "}
                  <TrackedCallLink
                    phone={location.phone}
                    placement="location-page"
                    location={location.slug}
                    className="font-semibold text-brand-dark transition-colors hover:text-brand"
                  >
                    {location.phone}
                  </TrackedCallLink>{" "}
                  and we will triage you over the phone before you travel.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <aside className="order-first space-y-4 lg:order-none lg:sticky lg:top-28 lg:self-start">
            <ScrollReveal>
              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-ink">
                  Book at {location.area}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  New patients are welcome. Choose a time online or call the
                  studio and we will confirm by text.
                </p>
                <ContactActions
                  placement="location-aside"
                  location={location.slug}
                  phone={location.phone}
                  className="mt-4"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={70}>
              <LocationHours />
            </ScrollReveal>

            {otherLocations.length > 0 ? (
              <ScrollReveal delay={140}>
                <div className="rounded-3xl border border-ink/10 bg-surface p-5">
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Also nearby
                  </h2>
                  <ul className="mt-3 space-y-1 text-sm">
                    {otherLocations.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={locationPath(item.slug)}
                          className="inline-flex min-h-9 items-center gap-1.5 text-brand-dark transition-colors hover:text-brand"
                        >
                          {item.area}, {item.city}
                          <ArrowRightIcon className="size-3.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ) : null}
          </aside>
        </Container>
      </Section>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsWidget studioLabel={`the ${location.area} studio`} />
      </Suspense>

      <FinalCta />
    </>
  );
}
