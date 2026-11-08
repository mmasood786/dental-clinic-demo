import Link from "next/link";

import { ExternalLinkIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/button";
import type { Location } from "@/config/site.config";
import { directionsHref, formatAddress, phoneHref } from "@/lib/contact";

export function LocationCard({ location }: { location: Location }) {
  const address = formatAddress(location.address);

  return (
    <article className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-brand-dark uppercase">
        {location.area}
      </p>
      <h3 className="mt-1.5 font-display text-xl font-semibold text-ink">
        <Link
          href={`/locations/${location.slug}`}
          className="hover:text-brand"
        >
          {location.city} — {location.area}
        </Link>
      </h3>
      <p className="mt-2 flex gap-2 text-sm leading-relaxed text-muted">
        <MapPinIcon className="mt-0.5 size-4 shrink-0 text-brand" />
        {address}
      </p>
      <a
        href={phoneHref(location.phone)}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand"
      >
        <PhoneIcon className="size-4 text-brand" />
        {location.phone}
      </a>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={directionsHref(address)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({ variant: "secondary" })}
        >
          Get directions
          <ExternalLinkIcon className="size-3.5" />
        </a>
        <Link
          href={`/locations/${location.slug}`}
          className="text-sm font-semibold text-brand-dark hover:text-brand"
        >
          Studio details
        </Link>
      </div>
    </article>
  );
}
