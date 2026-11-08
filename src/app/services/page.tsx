import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceCard } from "@/components/services/service-card";
import { PageHero } from "@/components/ui/page-hero";
import { siteConfig } from "@/config/site.config";
import { servicePath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: `Dental services in ${siteConfig.address.city}`,
  description: `Dental treatments at ${siteConfig.name}: implants, braces, whitening, emergency care and check-ups, with published starting prices.`,
  path: "/services",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Services" }];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          itemListSchema(
            `Dental services at ${siteConfig.name}`,
            siteConfig.services.map((service) => ({
              name: service.title,
              path: servicePath(service.slug),
            })),
          ),
          breadcrumbSchema(crumbs, "/services"),
        ]}
      />
      <PageHero
        eyebrow="Treatments"
        title={`Dental services in ${siteConfig.address.city}`}
        intro="Every treatment begins with a proper diagnosis, a plain-English explanation and a written price. Here is what we do — and what happens next."
        breadcrumbs={crumbs}
      />

      <section className="py-14 lg:py-16">
        <Container>
          <h2 className="sr-only">All treatments</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
