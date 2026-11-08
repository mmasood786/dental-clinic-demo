import Link from "next/link";

import {
  TrackedBookingLink,
  TrackedCallLink,
  TrackedDirectionsLink,
} from "@/components/analytics/tracked-links";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";
import {
  ExternalLinkIcon,
  GoogleIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ToothIcon,
} from "@/components/icons";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site.config";
import { directionsHref, mailtoHref } from "@/lib/contact";
import { formatTime } from "@/lib/format";
import { googleMapHref, googlePlaceHref } from "@/lib/reviews";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const address = siteConfig.address;

  return (
    <footer className="on-dark bg-ink text-white/75">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1.2fr] lg:gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-xl bg-brand text-white">
                <ToothIcon className="size-6" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {siteConfig.tagline}. Modern, unhurried dental care in{" "}
              {siteConfig.address.city}.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {siteConfig.social.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-accent hover:text-white"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <TrackedBookingLink
                  placement="footer"
                  className="transition-colors hover:text-white"
                >
                  Book an appointment
                </TrackedBookingLink>
              </li>
              <li>
                <Link
                  href="/manage-appointment"
                  className="transition-colors hover:text-white"
                >
                  Need to change your appointment?
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Opening hours
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              {siteConfig.openingHours.map((entry) => (
                <div key={entry.day} className="flex justify-between gap-4">
                  <dt>{entry.day}</dt>
                  <dd className="text-right text-white/90">
                    {entry.opens && entry.closes
                      ? `${formatTime(entry.opens)} – ${formatTime(entry.closes)}`
                      : "Closed"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Visit us
            </h2>
            <address className="mt-4 space-y-1 text-sm not-italic">
              <span className="flex gap-2">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                </span>
              </span>
            </address>
            <TrackedDirectionsLink
              href={directionsHref()}
              placement="footer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-accent"
            >
              Get directions
              <ExternalLinkIcon className="size-3.5" />
            </TrackedDirectionsLink>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
              <TrackedDirectionsLink
                href={googlePlaceHref}
                placement="footer-google"
                className="inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-accent"
              >
                <GoogleIcon className="size-4 text-accent" />
                Find us on Google
              </TrackedDirectionsLink>
              <TrackedDirectionsLink
                href={googleMapHref}
                placement="footer-map"
                className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-accent"
              >
                Open in Maps
                <ExternalLinkIcon className="size-3.5" />
              </TrackedDirectionsLink>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <TrackedCallLink
                placement="footer"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <PhoneIcon className="size-4 shrink-0 text-accent" />
                {siteConfig.phone}
              </TrackedCallLink>
              <a
                href={mailtoHref}
                className="flex items-center gap-2 break-all transition-colors hover:text-white"
              >
                <MailIcon className="size-4 shrink-0 text-accent" />
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p>Placeholder content for a fictional clinic.</p>
            <span aria-hidden="true">·</span>
            <CookieSettingsButton className="underline underline-offset-2 transition-colors hover:text-white" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
