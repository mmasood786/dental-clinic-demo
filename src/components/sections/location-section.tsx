import { MapPin } from "lucide-react";
import Link from "next/link";

import {
  TrackedCallLink,
  TrackedDirectionsLink,
} from "@/components/analytics/tracked-links";
import { ArrowRightIcon, PhoneIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { LocationHours } from "@/components/sections/location-hours";
import { MapEmbed } from "@/components/locations/map-embed";
import { Icon } from "@/components/ui/icon";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site.config";
import { directionsHref, formatAddress } from "@/lib/contact";

export function LocationSection() {
  const location = siteConfig.locations[0];
  const address = location?.address ?? siteConfig.address;
  const phone = location?.phone ?? siteConfig.phone;
  const mapSrc = location?.mapEmbedUrl ?? null;
  const directions = directionsHref(formatAddress(address));

  return (
    <Section aria-labelledby="location-heading">
      <Container className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-14">
        <ScrollReveal>
          <p className="text-eyebrow font-semibold text-brand-dark uppercase">
            Visit us
          </p>
          <h2
            id="location-heading"
            className="mt-2 font-display text-h2 font-semibold tracking-tight text-ink"
          >
            {location ? `Find us in ${location.area}` : "Find us"}
          </h2>
          {location ? (
            <p className="mt-3 text-base leading-relaxed text-muted">
              {location.description}
            </p>
          ) : null}

          <div className="mt-6 flex gap-3">
            <Icon
              icon={MapPin}
              size="md"
              tone="brand"
              className="mt-0.5 shrink-0"
            />
            <address className="text-sm leading-relaxed text-ink/80 not-italic">
              <span className="block font-semibold text-ink">
                {siteConfig.name}
              </span>
              {address.line1}
              <br />
              {address.line2 ? (
                <>
                  {address.line2}
                  <br />
                </>
              ) : null}
              {address.city}, {address.state} {address.postalCode}
            </address>
          </div>

          <TrackedCallLink
            phone={phone}
            placement="home-location"
            location={location?.slug}
            ariaLabel={`Call ${siteConfig.name} on ${phone}`}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-dark transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <PhoneIcon className="size-4" />
            {phone}
          </TrackedCallLink>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <TrackedDirectionsLink
              href={directions}
              placement="home-location"
              location={location?.slug}
              ariaLabel="Get directions to the studio"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Icon icon={MapPin} size="sm" />
              Get directions
            </TrackedDirectionsLink>

            {siteConfig.locations.length > 1 ? (
              <Link
                href="/locations"
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                See both studios
                <ArrowRightIcon className="size-4" />
              </Link>
            ) : null}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={90}>
          {mapSrc ? (
            <MapEmbed
              src={mapSrc}
              title={`Map of the ${siteConfig.name} studio in ${
                location?.area ?? address.city
              }`}
              className="shadow-card"
            />
          ) : null}
          <LocationHours className="mt-5" />
        </ScrollReveal>
      </Container>
    </Section>
  );
}
