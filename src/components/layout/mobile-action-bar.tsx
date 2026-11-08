"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  TrackedBookingLink,
  TrackedCallLink,
} from "@/components/analytics/tracked-links";
import { CalendarIcon, PhoneIcon } from "@/components/icons";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function MobileActionBar() {
  const pathname = usePathname();
  const onBookingPage = pathname === "/book";

  // The booking page has no fixed bar, so the body does not need the extra
  // bottom padding that reserves space for it elsewhere.
  useEffect(() => {
    if (!onBookingPage) {
      return;
    }

    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "0px";

    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [onBookingPage]);

  if (onBookingPage) {
    return null;
  }

  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,31,34,0.08)] backdrop-blur-md md:hidden"
    >
      <div className="grid grid-cols-3 gap-2 px-3 py-2">
        <TrackedCallLink
          placement="mobile-bar"
          className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-ink/15 px-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-light/60 active:bg-brand-light"
        >
          <PhoneIcon className="size-5 text-brand" />
          Call
        </TrackedCallLink>
        <WhatsAppButton variant="bar" placement="mobile-bar" />
        <TrackedBookingLink
          placement="mobile-bar"
          className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl bg-brand px-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark active:bg-brand-dark"
        >
          <CalendarIcon className="size-5" />
          Book
        </TrackedBookingLink>
      </div>
    </nav>
  );
}
