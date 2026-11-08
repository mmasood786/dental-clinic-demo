import { CalendarIcon, CheckIcon } from "@/components/icons";
import { TrackedBookingLink } from "@/components/analytics/tracked-links";
import { Container } from "@/components/layout/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";

export function FirstVisitSection() {
  const { firstVisit } = siteConfig;

  if (firstVisit.steps.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby="first-visit-heading">
      <Container>
        <ScrollReveal>
          <SectionHeading
            id="first-visit-heading"
            align="center"
            eyebrow="Your first visit"
            title="What happens, step by step"
            intro={firstVisit.intro}
          />
        </ScrollReveal>

        <ol className="mt-12 grid gap-9 md:grid-cols-3 md:gap-6 lg:gap-8">
          {firstVisit.steps.map((step, index) => (
            <li key={step.title} className="h-full">
              <ScrollReveal delay={index * 90} className="h-full">
                <div className="flex h-full flex-col">
                  <span className="grid size-14 place-items-center rounded-2xl border border-brand/15 bg-brand-light font-display text-xl font-semibold text-brand-dark">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ol>

        <ScrollReveal delay={120}>
          <div className="mt-12 flex flex-col gap-5 rounded-3xl border border-ink/10 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:px-8">
            <p className="flex gap-3 text-sm leading-relaxed text-ink/75">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-brand" />
              <span>{firstVisit.note}</span>
            </p>
            <TrackedBookingLink
              href="/book"
              size="lg"
              placement="first-visit"
              className="w-full shrink-0 sm:w-auto"
            >
              <CalendarIcon className="size-4" />
              Book your first visit
            </TrackedBookingLink>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
