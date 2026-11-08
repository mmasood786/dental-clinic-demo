import type { Metadata } from "next";
import {
  CreditCard,
  FileText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { ContactActions } from "@/components/cta/contact-actions";
import { InsuranceList } from "@/components/insurance/insurance-list";
import { Container } from "@/components/layout/container";
import { PricingTable } from "@/components/pricing/pricing-table";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { HeroChip, PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Insurance & pricing",
  description: `Dental treatment prices and accepted insurance at ${siteConfig.name}. Starting prices, direct billing and a written quote after your examination.`,
  path: "/insurance-pricing",
});

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Insurance & pricing" },
];

const paymentPoints: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    icon: FileText,
    title: "A written quote first",
    body: "You see the plan and the price on paper, and nothing starts until you agree to it.",
  },
  {
    icon: ShieldCheck,
    title: "Direct billing",
    body: "We bill most major insurers directly — bring your card and we check your benefits before treatment.",
  },
  {
    icon: CreditCard,
    title: "Spread the cost",
    body: "Larger plans such as implants and braces can be split into monthly interest-free instalments.",
  },
];

export default function InsurancePricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs, "/insurance-pricing")} />

      <PageHero
        eyebrow="Insurance & pricing"
        title="Clear costs, no surprises"
        intro="We publish our starting prices and bill most major insurers directly. Whatever the treatment, the final cost is confirmed in writing after your examination."
        breadcrumbs={crumbs}
        actions={
          <ContactActions
            placement="pricing-hero"
            layout="row"
            size="lg"
          />
        }
        highlights={
          <>
            <HeroChip>Written quote before treatment</HeroChip>
            <HeroChip>Direct billing with major insurers</HeroChip>
            <HeroChip>Interest-free instalments</HeroChip>
          </>
        }
      />

      <Section aria-labelledby="insurance-heading">
        <Container>
          <ScrollReveal>
            <SectionHeading
              id="insurance-heading"
              eyebrow="Insurance"
              title="Plans we bill directly"
              intro="Bring your card to your first visit and we will check your benefits before treatment. If your plan is not listed, call us and we will check out-of-network options for you."
            />
          </ScrollReveal>
          <div className="mt-8">
            <InsuranceList partners={siteConfig.insurancePartners} />
          </div>
        </Container>
      </Section>

      <Section tone="surface" aria-labelledby="prices-heading">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <ScrollReveal>
              <SectionHeading
                id="prices-heading"
                eyebrow="Self-pay"
                title="Treatment prices"
                intro="Published starting prices for the most common visits. Larger plans can be spread over monthly interest-free instalments."
              />
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="mt-8">
                <PricingTable
                  items={siteConfig.pricing}
                  caption="Starting prices for dental treatments"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <div className="mt-5 rounded-3xl border border-accent/40 bg-white p-5 shadow-card sm:p-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <FileText className="size-4 text-accent-dark" />
                  Final prices depend on an examination
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {siteConfig.pricingDisclaimer}
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {paymentPoints.map((point, index) => (
                <ScrollReveal
                  key={point.title}
                  delay={Math.min(index, 3) * 70}
                  className="h-full"
                >
                  <div className="h-full rounded-2xl border border-ink/10 bg-white p-5">
                    <span className="grid size-10 place-items-center rounded-xl bg-brand-light text-brand-dark">
                      <Icon icon={point.icon} size="md" />
                    </span>
                    <h3 className="mt-3 font-display text-base font-semibold text-ink">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {point.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <aside className="order-first lg:order-none lg:sticky lg:top-28 lg:self-start">
            <ScrollReveal>
              <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card">
                <div className="border-b border-ink/10 bg-white px-6 py-5">
                  <p className="text-eyebrow font-semibold text-brand-dark uppercase">
                    Before you book
                  </p>
                  <h2 className="mt-1.5 font-display text-xl font-semibold text-ink">
                    Know the cost before you commit
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    The prices above are starting points. Your examination and
                    any X-rays confirm the exact figure.
                  </p>
                </div>

                <div className="px-6 py-5">
                  <ContactActions placement="pricing-aside" />
                </div>

                <p className="border-t border-ink/10 bg-surface/60 px-6 py-4 text-xs leading-relaxed text-muted">
                  <span className="font-semibold text-ink">
                    Not sure what you need?
                  </span>{" "}
                  Book a check-up and we will tell you what is needed, what can
                  wait and what it costs.
                </p>
              </div>
            </ScrollReveal>
          </aside>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
