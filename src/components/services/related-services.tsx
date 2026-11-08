import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { ServiceCard } from "@/components/services/service-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { Service } from "@/config/site.config";
import { servicePath } from "@/lib/paths";

/**
 * A row of other treatments, so a visitor who landed on the wrong service page
 * can move sideways instead of back to the index.
 */
export function RelatedServices({
  services,
  heading = "Other treatments",
}: {
  services: Service[];
  heading?: string;
}) {
  if (services.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-h3 text-ink">{heading}</h2>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          All services
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ScrollReveal
            key={service.slug}
            delay={Math.min(index, 3) * 70}
            className="h-full"
          >
            <ServiceCard
              service={service}
              href={servicePath(service.slug)}
              ctaLabel="View treatment"
            />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
