"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site.config";

/**
 * Hides the full site footer inside the booking funnel.
 *
 * A slim legal bar keeps the copyright and the cookie settings control, while
 * removing the large navigation and marketing links that would distract from
 * finishing a booking.
 */
export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname !== "/book") {
    return <>{children}</>;
  }

  return (
    <footer className="border-t border-ink/10 bg-white">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-6 text-xs text-muted">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <nav aria-label="Legal and site links" className="flex items-center gap-4">
          <Link
            href="/"
            className="transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Back to website
          </Link>
          <CookieSettingsButton className="transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" />
        </nav>
      </Container>
    </footer>
  );
}
