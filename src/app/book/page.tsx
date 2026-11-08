import type { Metadata } from "next";
import Link from "next/link";

import { TrackedCallLink } from "@/components/analytics/tracked-links";
import { BookingReassurance } from "@/components/booking/booking-reassurance";
import { CalBooking } from "@/components/booking/cal-booking";
import { CalendarIcon, CheckIcon, ClockIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { HeroChip } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { siteConfig, getService } from "@/config/site.config";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Book an appointment",
  description: `Book a dental appointment online at ${siteConfig.name} in ${siteConfig.address.city}. Pick a treatment and a time, and get an instant confirmation by email.`,
  path: "/book",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Book an appointment" }];

type BookPageProps = {
  searchParams: Promise<{ service?: string | string[] }>;
};

const trustChips = [
  { icon: CheckIcon, label: "Instant email confirmation" },
  { icon: CalendarIcon, label: "Reschedule in one click" },
  { icon: ClockIcon, label: "Same-day emergency slots" },
];

export default async function BookPage({ searchParams }: BookPageProps) {
  const { service: serviceParam } = await searchParams;
  const requestedSlug = Array.isArray(serviceParam)
    ? serviceParam[0]
    : serviceParam;
  const requestedService = requestedSlug ? getService(requestedSlug) : undefined;

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs, "/book")} />

      <section className="relative overflow-hidden border-b border-ink/10 bg-surface">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-24 size-[32rem] rounded-full bg-brand/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-accent/10 blur-3xl"
        />

        <Container className="relative py-8 lg:py-12">
          <p className="text-eyebrow font-semibold text-brand-dark uppercase">
            Online booking
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-h1 font-semibold tracking-tight text-ink">
            Book your visit
          </h1>
          <p className="mt-3 max-w-2xl text-lead leading-relaxed text-ink/70">
            Choose a treatment, pick a time that suits you, and get an instant
            confirmation by email. No account and no payment needed.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {trustChips.map(({ icon: Icon, label }) => (
              <HeroChip key={label} icon={<Icon className="size-3.5 text-brand" />}>
                {label}
              </HeroChip>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted">
            Prefer to talk? Call{" "}
            <TrackedCallLink
              placement="book-page"
              className="font-semibold text-brand-dark underline underline-offset-2 transition-colors hover:text-brand"
            >
              {siteConfig.phone}
            </TrackedCallLink>
            .
          </p>
        </Container>
      </section>

      <Section spacing="sm">
        <Container>
          <CalBooking
            services={siteConfig.services}
            initialServiceSlug={requestedService?.slug}
            reassurance={<BookingReassurance />}
          />

          <p className="mt-8 text-center text-sm text-muted">
            Already booked?{" "}
            <Link
              href="/manage-appointment"
              className="font-semibold text-brand-dark underline underline-offset-2 transition-colors hover:text-brand"
            >
              Need to change your appointment?
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
