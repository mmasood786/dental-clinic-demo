import {
  ExternalLinkIcon,
  GoogleIcon,
  StarIcon,
} from "@/components/icons";
import { Container } from "@/components/layout/container";
import { ReviewsCarousel } from "@/components/reviews/reviews-carousel";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/cn";
import { getGoogleReviews, googleWriteReviewHref } from "@/lib/reviews";

type ReviewsWidgetProps = {
  /** Adds local context to the heading, e.g. "the Riverside studio". */
  studioLabel?: string;
  className?: string;
};

const secondaryLink =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/**
 * Google reviews, read through `src/lib/reviews.ts`.
 *
 * The data comes from the Places API when it is configured and cached for 24
 * hours; otherwise the sample reviews in the config are shown and the sample
 * rating is labelled as such.
 */
export async function ReviewsWidget({
  studioLabel,
  className,
}: ReviewsWidgetProps) {
  const reviews = await getGoogleReviews();

  const title = studioLabel
    ? `What patients say about ${studioLabel}`
    : "What patients say";

  const totalLabel =
    reviews.total !== null
      ? `Based on ${reviews.total.toLocaleString("en-US")} Google reviews`
      : "Google reviews";

  return (
    <Section
      tone="surface"
      aria-labelledby="reviews-heading"
      className={cn("overflow-x-clip", className)}
    >
      <Container className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-12">
        <ScrollReveal>
          <SectionHeading
            id="reviews-heading"
            eyebrow="Google reviews"
            title={title}
            intro={siteConfig.reviews.intro}
          />

          <div className="mt-7 rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-ink">
                <GoogleIcon className="size-6" />
              </span>
              <div>
                <p className="text-eyebrow font-semibold text-muted uppercase">
                  Google rating
                </p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-semibold leading-none text-ink">
                    {reviews.rating !== null
                      ? reviews.rating.toFixed(1)
                      : "5.0"}
                  </span>
                  <span className="text-sm font-medium text-muted">
                    out of 5
                  </span>
                </p>
              </div>
            </div>

            <div
              className="mt-4 flex items-center gap-1"
              aria-hidden="true"
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                  key={index}
                  className={cn(
                    "size-4",
                    index < Math.round(reviews.rating ?? 5)
                      ? "text-accent-dark"
                      : "text-ink/15",
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted">{totalLabel}</p>

            <a
              href={reviews.mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(secondaryLink, "mt-5 w-full")}
            >
              Read more on Google
              <ExternalLinkIcon className="size-4" />
            </a>

            <a
              href={googleWriteReviewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-9 items-center text-sm font-semibold text-brand-dark transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Write a review
            </a>

            {!reviews.isLive ? (
              <p className="mt-4 border-t border-ink/10 pt-4 text-xs leading-relaxed text-muted">
                {siteConfig.reviews.note}
              </p>
            ) : null}
          </div>
        </ScrollReveal>

        {reviews.reviews.length > 0 ? (
          <ScrollReveal delay={90} className="min-w-0">
            <ReviewsCarousel reviews={reviews.reviews} />
          </ScrollReveal>
        ) : null}
      </Container>
    </Section>
  );
}
