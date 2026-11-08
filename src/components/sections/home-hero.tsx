import { ShieldCheck } from "lucide-react";
import Image from "next/image";

import {
  TrackedBookingLink,
  TrackedCallLink,
} from "@/components/analytics/tracked-links";
import {
  CalendarIcon,
  GoogleIcon,
  PhoneIcon,
  ToothIcon,
} from "@/components/icons";
import { OpeningStatusCard } from "@/components/sections/opening-status-card";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { RatingStars } from "@/components/ui/rating-stars";
import { siteConfig } from "@/config/site.config";
import { getOpeningStatus } from "@/lib/hours";
import type { GoogleReviews } from "@/lib/reviews";

type HomeHeroProps = {
  reviews: GoogleReviews;
};

export function HomeHero({ reviews }: HomeHeroProps) {
  const { homeHero } = siteConfig;
  const openingStatus = getOpeningStatus();
  const insuranceCount = siteConfig.insurancePartners.filter(
    (partner) => !partner.selfPay,
  ).length;

  return (
    <section className="relative overflow-hidden bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-24 size-[32rem] rounded-full bg-brand/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-accent/10 blur-3xl"
      />

      <Container className="relative grid gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/80 px-3.5 py-1.5 text-eyebrow font-semibold text-brand-dark uppercase backdrop-blur">
            <span
              className="size-1.5 rounded-full bg-brand"
              aria-hidden="true"
            />
            Dentist in {siteConfig.address.city}
          </p>

          <h1 className="mt-5 max-w-2xl font-display text-display font-semibold tracking-tight text-ink">
            {homeHero.heading}
          </h1>

          <p className="mt-5 max-w-xl text-lead leading-relaxed text-muted">
            {homeHero.supporting}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <TrackedBookingLink
              href="/book"
              variant="primary"
              size="lg"
              placement="home-hero"
            >
              <CalendarIcon className="size-4" />
              Book your visit
            </TrackedBookingLink>
            <TrackedCallLink
              variant="secondary"
              size="lg"
              placement="home-hero"
              ariaLabel={`Call ${siteConfig.name} on ${siteConfig.phone}`}
            >
              <PhoneIcon className="size-4 text-brand" />
              Call now
            </TrackedCallLink>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-ink/10 pt-5">
            {reviews.rating !== null && reviews.total !== null ? (
              <div className="inline-flex items-center gap-2">
                <GoogleIcon className="size-4 shrink-0 text-ink/55" />
                <RatingStars
                  rating={reviews.rating}
                  size="sm"
                  showValue={false}
                />
                <span className="text-sm font-semibold text-ink">
                  {reviews.rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted">
                  ({reviews.total.toLocaleString("en-US")} Google reviews)
                </span>
              </div>
            ) : null}

            {insuranceCount > 0 ? (
              <div className="inline-flex items-center gap-2 text-sm text-muted">
                <Icon icon={ShieldCheck} size="sm" tone="brand" />
                <span>{insuranceCount} insurance plans accepted</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 rounded-[2.75rem] bg-linear-to-br from-brand/20 via-accent/10 to-transparent blur-2xl sm:-inset-6"
          />

          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/80 bg-linear-to-br from-brand-light via-white to-accent-soft shadow-card sm:aspect-[5/4] lg:aspect-[4/5]">
            {homeHero.image ? (
              <Image
                src={homeHero.image.src}
                alt={homeHero.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            ) : (
              <HeroImagePlaceholder />
            )}
          </div>

          {openingStatus ? (
            <OpeningStatusCard initialStatus={openingStatus} />
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/** Soft branded block used until a real clinic or team photo is in the config. */
function HeroImagePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center overflow-hidden p-8 text-center"
    >
      <div className="absolute -top-16 -right-12 size-52 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute -bottom-16 -left-12 size-56 rounded-full bg-brand/20 blur-3xl" />

      <div className="relative">
        <span className="mx-auto grid size-20 place-items-center rounded-[1.5rem] bg-white/85 text-brand shadow-card">
          <ToothIcon className="size-10" />
        </span>
        <p className="mt-5 font-display text-2xl font-semibold text-ink">
          {siteConfig.name}
        </p>
        <p className="mt-1 text-sm text-muted">{siteConfig.tagline}</p>
      </div>
    </div>
  );
}
