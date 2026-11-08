import {
  TrackedBookingLink,
  TrackedCallLink,
  TrackedWhatsAppLink,
} from "@/components/analytics/tracked-links";
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/cn";

const whatsappButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-sm font-semibold text-ink shadow-sm transition-[filter,transform] duration-200 hover:brightness-95 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none motion-reduce:transform-none sm:text-base";

export function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="on-dark relative overflow-hidden bg-linear-to-br from-brand-dark via-brand to-brand-dark"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-20 size-[28rem] rounded-full bg-accent/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 size-[26rem] rounded-full bg-white/10 blur-3xl"
      />

      <Container className="relative py-16 text-center lg:py-24">
        <ScrollReveal>
          <p className="text-eyebrow font-semibold text-white/90 uppercase">
            Ready when you are
          </p>
          <h2
            id="final-cta-heading"
            className="mx-auto mt-3 max-w-3xl font-display text-h2 font-semibold tracking-tight text-white"
          >
            A calmer dental visit starts here
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90">
            Book online in under a minute, or call and we will find a time that
            suits you — including same-day emergency slots where we can.
          </p>

          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <TrackedBookingLink
              href="/book"
              variant="inverted"
              size="lg"
              placement="final-cta"
              className="whitespace-nowrap"
            >
              Book your visit
              <ArrowRightIcon className="size-4" />
            </TrackedBookingLink>
            <TrackedCallLink
              variant="outlineLight"
              size="lg"
              placement="final-cta"
              ariaLabel={`Call ${siteConfig.name} on ${siteConfig.phone}`}
              className="whitespace-nowrap"
            >
              <PhoneIcon className="size-4" />
              Call {siteConfig.phone}
            </TrackedCallLink>
            <TrackedWhatsAppLink
              placement="final-cta"
              ariaLabel={`Chat with ${siteConfig.shortName} on WhatsApp`}
              className={cn(whatsappButton, "whitespace-nowrap")}
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </TrackedWhatsAppLink>
          </div>

          <p className="mt-6 text-xs text-white/90">
            New patients of all ages are welcome at both studios.
          </p>
        </ScrollReveal>
      </Container>
    </section>
  );
}
