import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { LocationCard } from "@/components/locations/location-card";
import { OpeningHours } from "@/components/locations/opening-hours";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";
import { locationPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: `Dentist locations in ${siteConfig.address.city}`,
  description: `Find your nearest ${siteConfig.shortName} studio in ${siteConfig.address.city}. Addresses, opening hours, phone numbers and directions for both studios.`,
  path: "/locations",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Locations" }];

export default function LocationsPage() {
  return (
    <>
      <JsonLd
        data={[
          itemListSchema(
            `${siteConfig.name} studios`,
            siteConfig.locations.map((location) => ({
              name: `${location.area}, ${location.city}`,
              path: locationPath(location.slug),
            })),
          ),
          breadcrumbSchema(crumbs, "/locations"),
        ]}
      />
      <PageHero
        eyebrow="Locations"
        title={`Dentist in ${siteConfig.address.city}`}
        intro={`${siteConfig.shortName} has studios on both sides of ${siteConfig.address.city}. Same team standards, same full range of treatments, whichever is easier for your commute.`}
        breadcrumbs={crumbs}
      />

      <section className="py-14 lg:py-16">
        <Container>
          <SectionHeading
            title="Choose your studio"
            intro="Each studio runs the same treatments and the same standards, so pick whichever is easier for your commute."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {siteConfig.locations.map((location) => (
              <LocationCard key={location.slug} location={location} />
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <OpeningHours />
            <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-white p-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  Not sure which studio to pick?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Our studios share the same clinical team. Call us and we will
                  find the earliest appointment at whichever location suits
                  you.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href="/book">Book Now</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Contact us
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
