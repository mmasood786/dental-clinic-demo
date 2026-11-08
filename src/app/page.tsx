import type { Metadata } from "next";
import { Suspense } from "react";

import { ReviewsSkeleton } from "@/components/reviews/reviews-skeleton";
import { ReviewsWidget } from "@/components/reviews/reviews-widget";
import { JsonLd } from "@/components/seo/json-ld";
import { BeforeAfterTeaser } from "@/components/sections/before-after-teaser";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { FirstVisitSection } from "@/components/sections/first-visit-section";
import { HomeHero } from "@/components/sections/home-hero";
import { LocationSection } from "@/components/sections/location-section";
import { PricingInsuranceTeaser } from "@/components/sections/pricing-insurance-teaser";
import { ServicesSection } from "@/components/sections/services-section";
import { TeamSection } from "@/components/sections/team-section";
import { TrustBar } from "@/components/sections/trust-bar";
import { siteConfig } from "@/config/site.config";
import { aggregateRatingFrom, getGoogleReviews } from "@/lib/reviews";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  dentistSchema,
  faqPageSchema,
  websiteSchema,
} from "@/lib/seo/schema";

const studioAreas = siteConfig.locations.map((location) => location.area);

export const metadata: Metadata = pageMetadata({
  title: `Dentist in ${siteConfig.address.city}, ${siteConfig.address.state} | ${siteConfig.name}`,
  description: `Dentist in ${siteConfig.address.city}, ${siteConfig.address.state} with studios in ${studioAreas.join(" and ")}. Implants, braces, whitening, emergency care and check-ups. Book online.`,
  path: "/",
});

const crumbs = [{ label: "Home" }];

// Re-render at most daily so live Google review data stays fresh.
export const revalidate = 86400;

export default async function HomePage() {
  const reviews = await getGoogleReviews();
  const aggregateRating = aggregateRatingFrom(reviews);

  return (
    <>
      <JsonLd
        data={[
          websiteSchema(),
          dentistSchema(undefined, aggregateRating),
          faqPageSchema(siteConfig.homeFaqs),
          breadcrumbSchema(crumbs, "/"),
        ]}
      />
      <HomeHero reviews={reviews} />
      <TrustBar />
      <ServicesSection />
      <FirstVisitSection />
      <TeamSection />
      <BeforeAfterTeaser />
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsWidget />
      </Suspense>
      <PricingInsuranceTeaser />
      <FaqSection />
      <LocationSection />
      <FinalCta />
    </>
  );
}
