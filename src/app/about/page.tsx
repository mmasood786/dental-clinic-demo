import type { Metadata } from "next";
import {
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { ContactActions } from "@/components/cta/contact-actions";
import { Container } from "@/components/layout/container";
import { FinalCta } from "@/components/sections/final-cta";
import { TeamCard } from "@/components/sections/team-card";
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
  title: "About us",
  description: `Meet the team behind ${siteConfig.name} in ${siteConfig.address.city} — independent, dentist-owned and built around unhurried appointments.`,
  path: "/about",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "About" }];

const valueIcons: LucideIcon[] = [MessageCircle, ShieldCheck, HeartHandshake];

export default function AboutPage() {
  const { about, trustPoints, locations } = siteConfig;

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs, "/about")} />

      <PageHero
        eyebrow="About us"
        title={`About ${siteConfig.name}`}
        intro={about.intro}
        breadcrumbs={crumbs}
        actions={<ContactActions placement="about-hero" layout="row" size="lg" />}
        highlights={trustPoints.map((point) => (
          <HeroChip key={point.key}>
            <span className="font-semibold text-ink">{point.value}</span>
            <span className="font-normal text-muted">{point.label}</span>
          </HeroChip>
        ))}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-12">
          <ScrollReveal>
            <div>
              <SectionHeading
                eyebrow="Our story"
                title="Built for people who would rather ask questions"
              />
              <div className="mt-5 space-y-4 text-base leading-relaxed text-ink/75">
                {about.story.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-6 rounded-2xl border border-brand/15 bg-brand-light/60 p-5 text-sm leading-relaxed text-ink/80">
                <span className="font-semibold text-ink">
                  What that means in practice.
                </span>{" "}
                Every appointment includes time to talk, findings shown on
                screen, and a written plan with a price before anything begins.
              </p>
            </div>
          </ScrollReveal>

          <aside className="order-first lg:order-none lg:sticky lg:top-28 lg:self-start">
            <ScrollReveal>
              <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card">
                <div className="border-b border-ink/10 bg-surface px-6 py-5">
                  <h2 className="font-display text-xl font-semibold text-ink">
                    At a glance
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {locations.length > 1
                      ? `${locations.length} studios, one clinical team.`
                      : "One studio, one clinical team."}
                  </p>
                </div>

                <dl className="space-y-3 px-6 py-5 text-sm">
                  {trustPoints.map((point) => (
                    <div
                      key={point.key}
                      className="flex items-baseline justify-between gap-4 border-b border-ink/5 pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-muted">{point.label}</dt>
                      <dd className="text-right font-semibold text-ink">
                        {point.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="border-t border-ink/10 bg-surface/60 px-6 py-5">
                  <ContactActions placement="about-aside" />
                </div>
              </div>
            </ScrollReveal>
          </aside>
        </Container>
      </Section>

      <Section tone="surface" aria-labelledby="values-heading">
        <Container>
          <ScrollReveal>
            <SectionHeading
              id="values-heading"
              eyebrow="What we stand for"
              title="The rules that decide how the practice runs"
              intro="From the front desk to the chair, these are the standards we hold ourselves to."
            />
          </ScrollReveal>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {about.values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 80} className="h-full">
                <article className="h-full rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-light text-brand-dark">
                    <Icon
                      icon={valueIcons[index] ?? ShieldCheck}
                      size="lg"
                    />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {value.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="team-heading">
        <Container>
          <ScrollReveal>
            <SectionHeading
              id="team-heading"
              eyebrow="The team"
              title="The people you will actually meet"
              intro="The clinicians and front-of-house people you will see at your appointment."
            />
          </ScrollReveal>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {about.team.map((member, index) => (
              <li key={member.name} className="h-full">
                <ScrollReveal delay={Math.min(index, 3) * 80} className="h-full">
                  <TeamCard member={member} />
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
