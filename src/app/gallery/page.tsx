import type { Metadata } from "next";

import { ContactActions } from "@/components/cta/contact-actions";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { CheckIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { HeroChip, PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site.config";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Before & after gallery",
  description: `Before and after examples from ${siteConfig.name}. Use the accessible sliders to compare treatments, with a clear note on patient consent.`,
  path: "/gallery",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Gallery" }];

export default function GalleryPage() {
  const cases = siteConfig.gallery.cases;

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs, "/gallery")} />

      <PageHero
        eyebrow="Gallery"
        title="Before & after"
        intro={siteConfig.gallery.intro}
        breadcrumbs={crumbs}
        actions={
          <ContactActions placement="gallery-hero" layout="row" size="lg" />
        }
        highlights={
          <>
            <HeroChip icon={<CheckIcon className="size-3.5 text-brand" />}>
              {cases.length} treatment comparisons
            </HeroChip>
            <HeroChip icon={<CheckIcon className="size-3.5 text-brand" />}>
              Keyboard accessible sliders
            </HeroChip>
            <HeroChip icon={<CheckIcon className="size-3.5 text-brand" />}>
              Published with consent
            </HeroChip>
          </>
        }
      />

      <Section>
        <Container>
          <ScrollReveal>
            <GalleryGrid items={cases} />
          </ScrollReveal>

          <div className="mt-10 flex gap-3 rounded-3xl border border-ink/10 bg-surface p-5 sm:p-6">
            <CheckIcon className="mt-0.5 size-5 shrink-0 text-brand" />
            <p className="text-sm leading-relaxed text-muted">
              <span className="font-semibold text-ink">
                A note on consent.
              </span>{" "}
              {siteConfig.gallery.consentNote}
            </p>
          </div>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
