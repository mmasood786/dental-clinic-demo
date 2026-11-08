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
  CheckIcon,
  ClockIcon,
  PhoneIcon,
} from "@/components/icons";
import { Container } from "@/components/layout/container";
import { PricingTable } from "@/components/pricing/pricing-table";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedServices } from "@/components/services/related-services";
import { ServiceSideCard } from "@/components/services/service-side-card";
import { ServiceSteps } from "@/components/services/service-steps";
import { FaqList } from "@/components/ui/faq-list";
import { HeroChip, PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { getService, siteConfig } from "@/config/site.config";
import { formatAddress } from "@/lib/contact";
import { formatDuration, formatPriceFrom } from "@/lib/format";
import { locationPath, locationServicePath, servicePath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/seo/schema";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return siteConfig.services.map((service) => ({ slug: service.slug }));
}

// Unknown slugs must 404 at the routing layer: calling notFound() from a
// dynamically rendered page streams a 200 status, which search engines treat as
// a soft 404.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {
      title: "Service not found",
      robots: { index: false, follow: false },
    };
  }

  return pageMetadata({
    title: `${service.title} in ${siteConfig.address.city}`,
    description: `${service.title} at ${siteConfig.shortName} in ${siteConfig.address.city}. ${service.shortDescription}`,
    path: servicePath(service.slug),
  });
}

const headingClass = "font-display text-h3 text-ink";

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  const priceRows = siteConfig.pricing.filter(
    (item) => item.serviceSlug === service.slug,
  );
  const related = siteConfig.services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.title },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service),
          faqPageSchema(service.faq),
          breadcrumbSchema(crumbs, servicePath(service.slug)),
        ]}
      />

      <PageHero
        eyebrow="Treatment"
        title={service.title}
        intro={service.shortDescription}
        breadcrumbs={crumbs}
        actions={
          <>
            <TrackedBookingLink
              href={`/book?service=${service.slug}`}
              size="lg"
              placement="service-hero"
              className="w-full sm:w-auto"
            >
              <CalendarIcon className="size-4" />
              Book this treatment
            </TrackedBookingLink>
            <TrackedCallLink
              size="lg"
              variant="secondary"
              placement="service-hero"
              ariaLabel={`Call ${siteConfig.name} on ${siteConfig.phone}`}
              className="w-full sm:w-auto"
            >
              <PhoneIcon className="size-4 text-brand" />
              {siteConfig.phone}
            </TrackedCallLink>
          </>
        }
        highlights={
          <>
            {service.priceFrom !== null ? (
              <HeroChip>{formatPriceFrom(service.priceFrom)}</HeroChip>
            ) : null}
            <HeroChip icon={<ClockIcon className="size-3.5 text-brand" />}>
              {formatDuration(service.durationMinutes)} appointment
            </HeroChip>
            <HeroChip icon={<CheckIcon className="size-3.5 text-brand" />}>
              Written plan before treatment
            </HeroChip>
          </>
        }
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-12">
          <div className="min-w-0 space-y-12">
            <ScrollReveal>
              <section aria-labelledby="what-it-is">
                <h2 id="what-it-is" className={headingClass}>
                  What it is
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink/75">
                  {service.longDescription}
                </p>
              </section>
            </ScrollReveal>

            {service.whoFor.length > 0 ? (
              <ScrollReveal>
                <section aria-labelledby="who-its-for">
                  <h2 id="who-its-for" className={headingClass}>
                    Who it&rsquo;s for
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {service.whoFor.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-light text-brand-dark"
                        >
                          <CheckIcon className="size-3.5" />
                        </span>
                        <span className="text-sm leading-relaxed text-ink/75">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </ScrollReveal>
            ) : null}

            {service.steps.length > 0 ? (
              <ScrollReveal>
                <section aria-labelledby="what-to-expect">
                  <h2 id="what-to-expect" className={headingClass}>
                    What to expect
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    The same sequence every patient follows, so there are no
                    surprises about what happens next.
                  </p>
                  <ServiceSteps steps={service.steps} />
                </section>
              </ScrollReveal>
            ) : null}

            {priceRows.length > 0 ? (
              <ScrollReveal>
                <section
                  aria-labelledby="service-prices"
                  className="rounded-3xl border border-ink/10 bg-surface p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <h2 id="service-prices" className={headingClass}>
                      What it costs
                    </h2>
                    <p className="font-display text-2xl font-semibold text-brand-dark">
                      {formatPriceFrom(service.priceFrom)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {siteConfig.pricingDisclaimer}
                  </p>
                  <div className="mt-5">
                    <PricingTable
                      items={priceRows}
                      caption={`Indicative prices for ${service.title}`}
                    />
                  </div>
                  <Link
                    href="/insurance-pricing"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand"
                  >
                    Payment options and insurance
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </section>
              </ScrollReveal>
            ) : null}

            {service.faq.length > 0 ? (
              <ScrollReveal>
                <section aria-labelledby="service-faqs">
                  <h2 id="service-faqs" className={headingClass}>
                    Frequently asked questions
                  </h2>
                  <FaqList items={service.faq} className="mt-4" />
                </section>
              </ScrollReveal>
            ) : null}
          </div>

          <aside className="order-first lg:order-none lg:sticky lg:top-28 lg:self-start">
            <ServiceSideCard service={service} />
          </aside>
        </Container>
      </Section>

      <Section tone="surface" aria-labelledby="where-heading">
        <Container>
          <ScrollReveal>
            <h2 id="where-heading" className="font-display text-h2 text-ink">
              Where to have {service.title.toLowerCase()}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
              Both studios run the same team, equipment and published prices.
              Choose the one that is easier to reach, or read the local details
              for each studio.
            </p>
          </ScrollReveal>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {siteConfig.locations.map((location, index) => (
              <ScrollReveal key={location.slug} delay={index * 80}>
                <article className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    <Link
                      href={locationServicePath(location.slug, service.slug)}
                      className="transition-colors hover:text-brand"
                    >
                      {service.title} in {location.area}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {location.area}, {location.city} ·{" "}
                    {formatAddress(location.address)}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-4">
                    <Link
                      href={locationServicePath(location.slug, service.slug)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand"
                    >
                      Local prices &amp; access
                      <ArrowRightIcon className="size-4" />
                    </Link>
                    <Link
                      href={locationPath(location.slug)}
                      className="text-sm text-muted transition-colors hover:text-brand"
                    >
                      Studio details
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="related-heading">
        <Container>
          <h2 id="related-heading" className="sr-only">
            Related treatments
          </h2>
          <RelatedServices
            services={related}
            heading={`More ways we can help`}
          />
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
