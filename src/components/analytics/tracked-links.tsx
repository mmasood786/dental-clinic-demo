"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { phoneHref, whatsappChatHref } from "@/lib/contact";
import { trackEvent } from "@/lib/track";

type StyleProps = {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type TrackedLinkProps = StyleProps & {
  children: ReactNode;
  /** Where the link lives, recorded with the event (header, footer, …). */
  placement?: string;
  service?: string;
  location?: string;
  ariaLabel?: string;
};

function linkClass({ variant, size, className }: StyleProps) {
  return variant || size
    ? buttonStyles({ variant, size, className })
    : className;
}

/**
 * Internal CTA into the booking funnel, e.g. "Book now".
 *
 * `start_booking` is recorded once a treatment is picked on `/book`, not on
 * this click, so the event always carries the treatment that was chosen.
 */
export function TrackedBookingLink({
  href = "/book",
  children,
  ariaLabel,
  ...style
}: TrackedLinkProps & { href?: string }) {
  return (
    <Link href={href} aria-label={ariaLabel} className={linkClass(style)}>
      {children}
    </Link>
  );
}

/** tel: link, tracked as `click_call`. */
export function TrackedCallLink({
  phone = siteConfig.phone,
  children,
  placement,
  location,
  ariaLabel,
  ...style
}: TrackedLinkProps & { phone?: string }) {
  return (
    <a
      href={phoneHref(phone)}
      aria-label={ariaLabel}
      className={linkClass(style)}
      onClick={() => trackEvent("click_call", { placement, location })}
    >
      {children}
    </a>
  );
}

/** WhatsApp click-to-chat, tracked as `click_whatsapp`. */
export function TrackedWhatsAppLink({
  message,
  children,
  placement,
  service,
  location,
  ariaLabel,
  ...style
}: TrackedLinkProps & { message?: string }) {
  return (
    <a
      href={whatsappChatHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={linkClass(style)}
      onClick={() =>
        trackEvent("click_whatsapp", { placement, service, location })
      }
    >
      {children}
    </a>
  );
}

/** Maps/directions link, tracked as `click_directions`. */
export function TrackedDirectionsLink({
  href,
  children,
  placement,
  location,
  ariaLabel,
  ...style
}: TrackedLinkProps & { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={linkClass(style)}
      onClick={() => trackEvent("click_directions", { placement, location })}
    >
      {children}
    </a>
  );
}
