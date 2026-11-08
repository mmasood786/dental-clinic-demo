import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  TrackedBookingLink,
  TrackedCallLink,
} from "@/components/analytics/tracked-links";
import {
  ArrowRightIcon,
  CalendarIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";
import { Container } from "@/components/layout/container";
import { PricingTable } from "@/components/pricing/pricing-table";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { getLocation, getService, siteConfig } from "@/config/site.config";
import { directionsHref, formatAddress } from "@/lib/contact";
import { formatDuration, formatPriceFrom } from "@/lib/format";
import { locationPath, locationServicePath, servicePath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, dentistSchema, locationServiceSchema } from "@/lib/seo/schema";

/**
 * Combined "treatment in area" landing page, e.g. `/locations/riverside/implants`.
 *
 * The first segment is the studio slug: both studios are in the same city, so
 * the area is what makes each page (and its local copy) unique. It shares the
 * `[slug]` segment name with `/locations/[slug]`, which the router requires.
 */
type LocationServicePageProps = {
  params: Promise<{ slug: string; service: string }>;
};

export function generateStaticParams() {
  return siteConfig.locations.flatMap((location) =>
    siteConfig.services.map((service) => ({
      slug: location.slug,
      service: service.slug,
    })),
  );
}

// See services/[slug]/page.tsx: unknown slugs must 404 before streaming starts.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LocationServicePageProps): Promise<Metadata> {
  const { slug, service: serviceSlug } = await params;
  const location = getLocation(slug);
  const service = getService(serviceSlug);

  if (!location || !service) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }

  return pageMetadata({
    title: `${service.title} in ${location.area}, ${location.city}`,
    description: `${service.title} at our ${location.area}, ${location.city} dental studio. ${service.shortDescription}`,
    path: locationServicePath(location.slug, service.slug),
  });
}

export default async function LocationServicePage({
  params,
}: LocationServicePageProps) {
  const { slug, service: serviceSlug } = await params;
  const location = getLocation(slug);
  const service = getService(serviceSlug);

  if (!location || !service) {
    notFound();
  }

  const address = formatAddress(location.address);
  const path = locationServicePath(location.slug, service.slug);
  const duration = formatDuration(service.durationMinutes);
  const priceRows = siteConfig.pricing.filter(
    (item) => item.serviceSlug === service.slug,
  );
  const otherServices = siteConfig.services.filter(
    (item) => item.slug !== service.slug,
  );
  const otherLocations = siteConfig.locations.filter(
    (item) => item.slug !== location.slug,
  );
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: `${location.area}, ${location.city}`, href: locationPath(location.slug) },
    { label: service.title },
  ];

  return (
    <>
      <JsonLd
        data={[
          locationServiceSchema(service, location),
          dentistSchema(location),
          breadcrumbSchema(crumbs, path),
        ]}
      />
      <PageHero
        eyebrow={`${location.area} studio`}
        title={`${service.title} in ${location.area}, ${location.city}`}
        intro={service.shortDescription}
        breadcrumbs={crumbs}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <TrackedBookingLink
            href={`/book?service=${service.slug}`}
            size="lg"
            placement="service-location-page"
            service={service.slug}
            location={location.slug}
          >
            <CalendarIcon className="size-4" />
            Book this treatment
          </TrackedBookingLink>
          <TrackedCallLink
            phone={location.phone}
            placement="service-location-page"
            location={location.slug}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <PhoneIcon className="size-4 text-brand" />
            Call {location.phone}
          </TrackedCallLink>
        </div>
      </PageHero>

      <section className="py-14 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-12">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {service.title} at the {location.area} studio
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink/75">
                Every {service.title.toLowerCase()} appointment at{" "}
                {location.area} is planned around about {duration} in the chair,
                including time for the dentist to examine, explain the options
                and agree the plan with you.
              </p>
              <p className="mt-3 text-base leading-relaxed text-ink/75">
                You see the same clinicians and equipment as at our other{" "}
                {location.city} studio, and the price stays the published one —
                from {formatPriceFrom(service.priceFrom)} — confirmed in writing
                before treatment starts.
              </p>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Appointment length",
                  value: `About ${duration}`,
                },
                {
                  label: "Starting price",
                  value: formatPriceFrom(service.priceFrom),
                },
                {
                  label: "Studio",
                  value: `${location.area}, ${location.city}`,
                },
                {
                  label: "Phone",
                  value: location.phone,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-ink/10 bg-surface p-4"
                >
                  <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            {priceRows.length > 0 ? (
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  What {service.title.toLowerCase()} costs in {location.area}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {siteConfig.pricingDisclaimer}
                </p>
                <div className="mt-4">
                  <PricingTable
                    items={priceRows}
                    caption={`${service.title} prices at the ${location.area} studio`}
                  />
                </div>
              </div>
            ) : null}

            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Getting to the {location.area} studio
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink/75">
                {location.description}
              </p>
              <div className="mt-4 rounded-2xl border border-ink/10 bg-white p-5 text-sm">
                <p className="flex gap-2 text-ink/80">
                  <MapPinIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                  {address}
                </p>
                <a
                  href={directionsHref(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-semibold text-brand-dark hover:text-brand"
                >
                  Get directions
                  <ExternalLinkIcon className="size-3.5" />
                </a>
                <p className="mt-3 border-t border-ink/10 pt-3 text-muted">
                  Opening hours are the same at both studios.{" "}
                  <Link
                    href={locationPath(location.slug)}
                    className="font-semibold text-brand-dark hover:text-brand"
                  >
                    Full {location.area} studio details
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Booking your {service.title.toLowerCase()} appointment
              </h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink/75">
                <li className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-light text-xs font-semibold text-brand-dark">
                    1
                  </span>
                  <span>
                    <TrackedBookingLink
                      href={`/book?service=${service.slug}`}
                      placement="service-location-page"
                      service={service.slug}
                      location={location.slug}
                      className="font-semibold text-brand-dark hover:text-brand"
                    >
                      Book online
                    </TrackedBookingLink>{" "}
                    and the calendar opens with {service.title.toLowerCase()}{" "}
                    already selected. Pick a time and your contact details.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-light text-xs font-semibold text-brand-dark">
                    2
                  </span>
                  <span>
                    Prefer to talk it through? Call{" "}
                    <TrackedCallLink
                      phone={location.phone}
                      placement="service-location-page"
                      location={location.slug}
                      className="font-semibold text-brand-dark hover:text-brand"
                    >
                      {location.phone}
                    </TrackedCallLink>{" "}
                    and the {location.area} front desk will find a time,
                    including same-day emergency slots.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-light text-xs font-semibold text-brand-dark">
                    3
                  </span>
                  <span>
                    You get an instant confirmation email with a calendar
                    invite, plus a link to reschedule or cancel if something
                    changes.
                  </span>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                More about {service.title.toLowerCase()}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Read the full treatment guide for aftercare, risks and the
                questions patients ask most.
              </p>
              <Link
                href={servicePath(service.slug)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark hover:text-brand"
              >
                {service.title} treatment guide
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="rounded-2xl bg-ink p-6 text-white">
              <h2 className="font-display text-xl font-semibold">
                Book at {location.area}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                New patients are welcome at {location.area}, {location.city}.
                Choose a time online or call the studio.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <TrackedBookingLink
                  href={`/book?service=${service.slug}`}
                  variant="inverted"
                  placement="service-location-aside"
                  service={service.slug}
                  location={location.slug}
                >
                  Book this treatment
                </TrackedBookingLink>
                <TrackedCallLink
                  phone={location.phone}
                  placement="service-location-aside"
                  location={location.slug}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <PhoneIcon className="size-4" />
                  {location.phone}
                </TrackedCallLink>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                Other treatments here
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {otherServices.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={locationServicePath(location.slug, item.slug)}
                      className="flex items-center justify-between gap-2 text-ink hover:text-brand"
                    >
                      {item.title}
                      <ArrowRightIcon className="size-4 shrink-0 text-brand" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {otherLocations.length > 0 ? (
              <div className="rounded-2xl border border-ink/10 bg-white p-5">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {service.title} at another studio
                </h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {otherLocations.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={locationServicePath(item.slug, service.slug)}
                        className="text-brand-dark hover:text-brand"
                      >
                        {service.title} in {item.area}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
