import { Phone } from "lucide-react";

import {
  TrackedCallLink,
  TrackedWhatsAppLink,
} from "@/components/analytics/tracked-links";
import { WhatsAppIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { FaqList } from "@/components/ui/faq-list";
import { Icon } from "@/components/ui/icon";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";

const whatsappLink =
  "mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function FaqSection() {
  if (siteConfig.homeFaqs.length === 0) {
    return null;
  }

  return (
    <Section tone="surface" aria-labelledby="faq-heading">
      <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
        <ScrollReveal>
          <SectionHeading
            id="faq-heading"
            eyebrow="Your questions"
            title="Nervous about something? Ask us."
            intro="Pain, cost, time, insurance — these are the things people usually want to know before they book. Here are honest answers, and you can always ask us directly."
          />

          <div className="mt-7 rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
            <p className="font-display text-lg font-semibold text-ink">
              Prefer to talk it through?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              A real person answers the phone during opening hours, and we are
              happy to talk before you book anything.
            </p>
            <TrackedCallLink
              variant="primary"
              placement="home-faq"
              ariaLabel={`Call ${siteConfig.name} on ${siteConfig.phone}`}
              className="mt-4 w-full"
            >
              <Icon icon={Phone} size="sm" />
              Call {siteConfig.phone}
            </TrackedCallLink>
            <TrackedWhatsAppLink
              placement="home-faq"
              message="I have a question before booking."
              className={whatsappLink}
            >
              <WhatsAppIcon className="size-4 text-whatsapp" />
              Message us on WhatsApp
            </TrackedWhatsAppLink>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={90}>
          <FaqList items={siteConfig.homeFaqs} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}
