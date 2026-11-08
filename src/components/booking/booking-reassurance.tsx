import { ShieldCheck } from "lucide-react";

import { TrackedCallLink } from "@/components/analytics/tracked-links";
import { CalendarIcon, PhoneIcon } from "@/components/icons";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/config/site.config";

/**
 * The reassurance column beside the booking widget.
 *
 * Everything here comes from the config: the first-visit sequence, the clinic
 * phone number, the cancellation policy and the enquiry privacy note.
 */
export function BookingReassurance() {
  const { firstVisit, cancellationPolicy, contactForm } = siteConfig;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
      <section
        aria-labelledby="booking-next-heading"
        className="rounded-3xl border border-ink/10 bg-white p-5 shadow-card"
      >
        <h2
          id="booking-next-heading"
          className="font-display text-base font-semibold text-ink"
        >
          What happens next
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          {firstVisit.intro}
        </p>

        <ol className="mt-4 space-y-3">
          {firstVisit.steps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-light text-[11px] font-bold text-brand-dark"
              >
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{step.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-4 border-t border-ink/10 pt-3 text-xs leading-relaxed text-muted">
          {firstVisit.note}
        </p>
      </section>

      <section
        aria-labelledby="booking-emergency-heading"
        className="rounded-3xl border border-accent/40 bg-accent-soft/50 p-5"
      >
        <h2
          id="booking-emergency-heading"
          className="flex items-center gap-2 font-display text-base font-semibold text-ink"
        >
          <PhoneIcon className="size-4 text-accent-dark" />
          In pain today?
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-ink/75">
          Do not wait for an online slot. Call the studio and we will triage you
          by phone and find the soonest same-day appointment we can.
        </p>
        <TrackedCallLink
          phone={siteConfig.phone}
          placement="booking-reassurance"
          variant="secondary"
          className="mt-3 w-full"
          ariaLabel={`Call ${siteConfig.name} on ${siteConfig.phone}`}
        >
          <PhoneIcon className="size-4 text-brand" />
          Call {siteConfig.phone}
        </TrackedCallLink>
      </section>

      <section
        aria-labelledby="booking-cancellation-heading"
        className="rounded-3xl border border-ink/10 bg-white p-5 shadow-card"
      >
        <h2
          id="booking-cancellation-heading"
          className="flex items-center gap-2 font-display text-base font-semibold text-ink"
        >
          <CalendarIcon className="size-4 text-brand" />
          Cancellation policy
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          Give us at least 24 hours&rsquo; notice to cancel or reschedule.
          Later cancellations or missed appointments may be charged 50% of the
          reserved treatment value.
        </p>
        <details className="group mt-3 border-t border-ink/10 pt-3">
          <summary className="cursor-pointer text-xs font-semibold text-brand-dark transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            Read the full policy
          </summary>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {cancellationPolicy}
          </p>
        </details>
      </section>

      <section
        aria-labelledby="booking-privacy-heading"
        className="rounded-3xl border border-ink/10 bg-surface p-5"
      >
        <h2
          id="booking-privacy-heading"
          className="flex items-center gap-2 font-display text-base font-semibold text-ink"
        >
          <Icon icon={ShieldCheck} size="sm" tone="brand" />
          Your privacy
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          {contactForm.privacyNote}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Please keep booking notes general — we take your medical history
          privately at the studio.
        </p>
      </section>
    </div>
  );
}
