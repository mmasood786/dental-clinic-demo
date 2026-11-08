import type { Metadata } from "next";

import { ContactDetails } from "@/components/contact/contact-details";
import { ContactActions } from "@/components/cta/contact-actions";
import { ContactForm } from "@/components/forms/contact-form";
import { GoogleIcon, MapPinIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { LocationHours } from "@/components/sections/location-hours";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { HeroChip, PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site.config";
import { formatAddress } from "@/lib/contact";
import { googleMapHref, googlePlaceHref } from "@/lib/reviews";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Contact us",
  description: `Contact ${siteConfig.name} in ${siteConfig.address.city} by phone, WhatsApp or email, or send an enquiry through the form.`,
  path: "/contact",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Contact" }];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs, "/contact")} />

      <PageHero
        eyebrow="Contact"
        title={`Contact ${siteConfig.shortName}`}
        intro={siteConfig.contactForm.intro}
        breadcrumbs={crumbs}
        actions={
          <ContactActions placement="contact-hero" layout="row" size="lg" />
        }
        highlights={
          <>
            <HeroChip icon={<MapPinIcon className="size-3.5 text-brand" />}>
              {formatAddress(siteConfig.address)}
            </HeroChip>
            <HeroChip icon={<GoogleIcon className="size-3.5 text-brand" />}>
              Google Business Profile
            </HeroChip>
          </>
        }
      />

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12">
          <ScrollReveal>
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-h3 text-ink">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                We reply within one business day. Required fields are marked
                with an asterisk.
              </p>
              <div className="mt-6">
                <ContactForm
                  copy={siteConfig.contactForm}
                  serviceOptions={siteConfig.services.map((service) => ({
                    value: service.slug,
                    label: service.title,
                  }))}
                  locationOptions={siteConfig.locations.map((location) => ({
                    value: location.slug,
                    label: `${location.area}, ${location.city}`,
                  }))}
                />
              </div>
            </div>
          </ScrollReveal>

          <aside className="space-y-5">
            <ScrollReveal>
              <ContactDetails />
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <LocationHours />
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-ink">
                  Find us on Google
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Our Business Profile has studio photos, live opening hours
                  and patient reviews. You can also leave a review after your
                  visit.
                </p>
                <div className="mt-4 flex flex-col gap-2.5 text-sm">
                  <a
                    href={googlePlaceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-brand-dark transition-colors hover:text-brand"
                  >
                    <GoogleIcon className="size-4" />
                    Find us on Google
                  </a>
                  <a
                    href={googleMapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-brand"
                  >
                    <MapPinIcon className="size-4 text-brand" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </aside>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
