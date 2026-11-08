import Link from "next/link";

import {
  TrackedBookingLink,
  TrackedCallLink,
} from "@/components/analytics/tracked-links";
import { PhoneIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { buttonStyles } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";

const helpfulLinks = [
  { href: "/services", label: "Treatments" },
  { href: "/locations", label: "Studios" },
  { href: "/contact", label: "Contact" },
  { href: "/gallery", label: "Gallery" },
];

/** Custom 404 for unknown routes and retired URLs. */
export default function NotFound() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-2xl text-center">
        <p className="font-display text-6xl font-semibold tracking-tight text-brand/30">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink/75">
          The page you are looking for has moved or no longer exists. You can
          book online, browse treatments, or call the studio.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <TrackedBookingLink href="/book" size="lg" placement="404">
            Book an appointment
          </TrackedBookingLink>
          <TrackedCallLink
            variant="secondary"
            size="lg"
            placement="404"
          >
            <PhoneIcon className="size-4 text-brand" />
            Call {siteConfig.phone}
          </TrackedCallLink>
        </div>

        <nav aria-label="Helpful pages" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            {helpfulLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-semibold text-brand-dark hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/"
                className={buttonStyles({
                  variant: "secondary",
                  className: "px-3 py-1.5",
                })}
              >
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </section>
  );
}
