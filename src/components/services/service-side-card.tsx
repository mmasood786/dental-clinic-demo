import { ClockIcon } from "@/components/icons";
import { ContactActions } from "@/components/cta/contact-actions";
import type { Service } from "@/config/site.config";
import { formatDuration, formatPriceFrom } from "@/lib/format";

/**
 * Desktop sticky booking card: the price, the appointment length and the three
 * ways to act, always in view while the treatment copy is being read.
 */
export function ServiceSideCard({ service }: { service: Service }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card">
      <div className="border-b border-ink/10 bg-surface px-6 py-5">
        <p className="text-eyebrow font-semibold text-muted uppercase">
          Indicative price
        </p>
        <p className="mt-1.5 font-display text-3xl font-semibold text-brand-dark">
          {formatPriceFrom(service.priceFrom)}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          Confirmed in writing after your examination.
        </p>

        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink/70">
          <ClockIcon className="size-3.5 text-brand" />
          {formatDuration(service.durationMinutes)} appointment
        </p>
      </div>

      <div className="px-6 py-5">
        <ContactActions
          placement="service-page"
          service={service.slug}
          bookHref={`/book?service=${service.slug}`}
          bookLabel="Book this treatment"
        />
      </div>

      <p className="border-t border-ink/10 bg-surface/60 px-6 py-4 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-ink">Need to talk first?</span> Call
        the studio and we will tell you honestly whether this treatment is right
        for you — before you book anything.
      </p>
    </div>
  );
}
