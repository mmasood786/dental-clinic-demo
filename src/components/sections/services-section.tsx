import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { ServiceCard } from "@/components/services/service-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";

export function ServicesSection() {
  if (siteConfig.services.length === 0) {
    return null;
  }

  return (
    <Section tone="surface" aria-labelledby="services-heading">
      <Container>
        <ScrollReveal>
          <SectionHeading
            id="services-heading"
            eyebrow="What we do"
            title="Dentistry for every stage of your smile"
            intro="From a routine clean to a full implant, every treatment starts with a clear explanation, a written plan and a price you agree to first."
            action={
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-brand-dark transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                All services
                <ArrowRightIcon className="size-4" />
              </Link>
            }
          />
        </ScrollReveal>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.services.map((service, index) => (
            <ScrollReveal
              key={service.slug}
              delay={Math.min(index, 3) * 80}
              className="h-full"
            >
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
