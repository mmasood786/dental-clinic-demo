import { ShieldCheck } from "lucide-react";

import { ArrowRightIcon } from "@/components/icons";
import { BeforeAfterSlider } from "@/components/gallery/before-after-slider";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site.config";

export function BeforeAfterTeaser() {
  const featured = siteConfig.gallery.cases[0];

  if (!featured) {
    return null;
  }

  return (
    <Section aria-labelledby="gallery-heading">
      <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
        <ScrollReveal>
          <p className="text-eyebrow font-semibold text-brand-dark uppercase">
            Before &amp; after
          </p>
          <h2
            id="gallery-heading"
            className="mt-2 font-display text-h2 font-semibold tracking-tight text-ink"
          >
            See the difference for yourself
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {siteConfig.gallery.intro}
          </p>

          <div className="mt-5 flex gap-3 rounded-2xl border border-ink/10 bg-surface p-4">
            <Icon
              icon={ShieldCheck}
              size="md"
              tone="brand"
              className="mt-0.5 shrink-0"
            />
            <p className="text-xs leading-relaxed text-muted">
              <span className="font-semibold text-ink">
                A note on consent.
              </span>{" "}
              {siteConfig.gallery.consentNote}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href="/gallery" variant="secondary">
              View the gallery
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <BeforeAfterSlider item={featured} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}
