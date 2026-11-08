import {
  Bone,
  Siren,
  Smile,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Icon } from "@/components/ui/icon";
import type { Service } from "@/config/site.config";
import { formatPriceFrom } from "@/lib/format";
import { bookingPath } from "@/lib/paths";

/** Lucide icon per treatment slug, with a calm clinical fallback. */
const serviceIcons: Record<string, LucideIcon> = {
  implants: Bone,
  braces: Smile,
  "teeth-whitening": Sparkles,
  "emergency-dentist": Siren,
  "general-checkup": Stethoscope,
};

type ServiceCardProps = {
  service: Service;
  /** Link target for the card CTA. Defaults to the booking funnel. */
  href?: string;
  /** CTA copy. Defaults to "Book this treatment". */
  ctaLabel?: string;
};

export function ServiceCard({
  service,
  href,
  ctaLabel = "Book this treatment",
}: ServiceCardProps) {
  const ServiceIcon = serviceIcons[service.slug] ?? Stethoscope;
  const target = href ?? bookingPath(service.slug);

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover motion-reduce:transform-none motion-reduce:transition-none">
      <span className="grid size-12 place-items-center rounded-2xl bg-brand-light text-brand-dark transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
        <Icon icon={ServiceIcon} size="lg" />
      </span>

      <h3 className="mt-5 font-display text-xl font-semibold text-ink">
        {href ? (
          <Link
            href={href}
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            {service.title}
          </Link>
        ) : (
          service.title
        )}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {service.shortDescription}
      </p>

      <div className="mt-5">
        {service.priceFrom !== null ? (
          <p className="border-t border-ink/10 pt-4 text-sm font-semibold text-brand-dark">
            {formatPriceFrom(service.priceFrom)}
          </p>
        ) : null}

        <Link
          href={target}
          className="group/link mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-light px-4 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {ctaLabel}
          <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none" />
        </Link>
      </div>
    </article>
  );
}
