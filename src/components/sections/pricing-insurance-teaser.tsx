import { Info, Receipt, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { Icon } from "@/components/ui/icon";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";
import { formatPriceFrom } from "@/lib/format";

/**
 * The same "from" prices shown on the service cards, so the two sections never
 * disagree about what a treatment starts at.
 */
const featuredPrices = siteConfig.services
  .filter((service) => service.priceFrom !== null)
  .slice(0, 3);

const insurers = siteConfig.insurancePartners.filter(
  (partner) => !partner.selfPay,
);

export function PricingInsuranceTeaser() {
  if (featuredPrices.length === 0 && insurers.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby="pricing-heading">
      <Container>
        <ScrollReveal>
          <SectionHeading
            id="pricing-heading"
            eyebrow="Pricing & insurance"
            title="Know the cost before you commit"
            intro="Starting prices are listed up front, and anything we recommend after your examination is confirmed in writing before treatment begins."
          />
        </ScrollReveal>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          {featuredPrices.length > 0 ? (
            <ScrollReveal className="h-full">
              <Link
                href="/insurance-pricing"
                className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transform-none motion-reduce:transition-none sm:p-7"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-light text-brand-dark transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
                  <Icon icon={Receipt} size="lg" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  Clear starting prices
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  A few examples from our published price list.
                </p>

                <ul className="mt-5 flex-1 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
                  {featuredPrices.map((service) => (
                    <li
                      key={service.slug}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <span className="text-ink/80">{service.title}</span>
                      <span className="shrink-0 font-semibold text-brand-dark">
                        {formatPriceFrom(service.priceFrom)}
                      </span>
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark">
                  See all prices
                  <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
              </Link>
            </ScrollReveal>
          ) : null}

          {insurers.length > 0 ? (
            <ScrollReveal delay={90} className="h-full">
              <Link
                href="/insurance-pricing"
                className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transform-none motion-reduce:transition-none sm:p-7"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-light text-brand-dark transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
                  <Icon icon={ShieldCheck} size="lg" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  We bill most plans directly
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {insurers.length} plans accepted, including:
                </p>

                <ul className="mt-5 flex flex-1 flex-wrap content-start gap-2">
                  {insurers.slice(0, 6).map((partner) => (
                    <li
                      key={partner.name}
                      className="rounded-full border border-ink/10 bg-surface px-3 py-1 text-xs font-medium text-ink/80"
                    >
                      {partner.name}
                    </li>
                  ))}
                  {insurers.length > 6 ? (
                    <li className="rounded-full border border-ink/10 bg-surface px-3 py-1 text-xs font-medium text-muted">
                      +{insurers.length - 6} more
                    </li>
                  ) : null}
                </ul>

                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark">
                  Check your cover
                  <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
              </Link>
            </ScrollReveal>
          ) : null}
        </div>

        <ScrollReveal delay={60}>
          <p className="mt-6 flex gap-2.5 text-xs leading-relaxed text-muted">
            <Icon
              icon={Info}
              size="sm"
              tone="muted"
              className="mt-0.5 shrink-0"
            />
            <span>{siteConfig.pricingDisclaimer}</span>
          </p>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
