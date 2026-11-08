"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  TrackedBookingLink,
  TrackedCallLink,
} from "@/components/analytics/tracked-links";
import {
  CalendarIcon,
  CloseIcon,
  MenuIcon,
  PhoneIcon,
  ToothIcon,
} from "@/components/icons";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // The booking funnel is deliberately distraction-free: no primary nav, no
  // emergency strip, just the brand, a way back and a phone number.
  if (pathname === "/book") {
    return (
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-3 lg:h-20">
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="group flex min-w-0 shrink-0 items-center gap-2.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-sm transition-colors group-hover:bg-brand-dark">
              <ToothIcon className="size-6" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-display text-base leading-tight font-semibold tracking-tight text-ink sm:text-lg">
                {siteConfig.name}
              </span>
              <span className="hidden text-[11px] leading-tight text-muted sm:block">
                Secure online booking
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="hidden min-h-11 items-center rounded-full border border-ink/15 px-4 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:inline-flex"
            >
              Back to site
            </Link>
            <TrackedCallLink
              placement="booking-header"
              ariaLabel={`Call ${siteConfig.name} on ${siteConfig.phone}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <PhoneIcon className="size-4 text-brand" />
              <span className="hidden sm:inline">Call {siteConfig.phone}</span>
              <span className="sm:hidden">Call</span>
            </TrackedCallLink>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <>
      <div className="on-dark bg-ink text-white">
        <Container className="flex min-h-9 flex-wrap items-center justify-center gap-x-2 gap-y-1 py-2 text-center text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5 text-white/75">
            <PhoneIcon className="size-3.5 text-accent" />
            Dental emergency?
          </span>
          <TrackedCallLink
            placement="emergency-strip"
            className="font-semibold text-white underline decoration-white/30 underline-offset-2 transition-colors hover:text-accent"
          >
            Call {siteConfig.phone}
          </TrackedCallLink>
        </Container>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
          scrolled
            ? "border-ink/10 shadow-md shadow-ink/5"
            : "border-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-2 lg:h-20 xl:gap-3">
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="group flex min-w-0 shrink-0 items-center gap-2.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-sm transition-colors group-hover:bg-brand-dark">
              <ToothIcon className="size-6" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-display text-base leading-tight font-semibold tracking-tight text-ink sm:text-lg">
                {siteConfig.name}
              </span>
              <span className="hidden text-[11px] leading-tight text-muted lg:block">
                {siteConfig.tagline}
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 lg:flex"
          >
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-1.5 py-2 text-[13px] font-medium transition-colors xl:px-3 xl:text-sm",
                    active
                      ? "bg-brand-light text-brand-dark"
                      : "text-ink/75 hover:bg-surface hover:text-brand",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <TrackedCallLink
              placement="header"
              ariaLabel={`Call ${siteConfig.name} on ${siteConfig.phone}`}
              className="hidden items-center gap-1.5 rounded-full border border-ink/15 px-3 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand lg:inline-flex xl:gap-2 xl:px-4 xl:text-sm"
            >
              <PhoneIcon className="size-4 text-brand" />
              {siteConfig.phone}
            </TrackedCallLink>

            <span className="hidden sm:block">
              <TrackedBookingLink
                href="/book"
                variant="primary"
                size="md"
                placement="header"
                className="inline-flex"
              >
                <CalendarIcon className="size-4" />
                Book Appointment
              </TrackedBookingLink>
            </span>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid size-12 place-items-center rounded-xl border border-ink/15 text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
            >
              <span className="sr-only">
                {menuOpen ? "Close menu" : "Open menu"}
              </span>
              {menuOpen ? (
                <CloseIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </Container>

        {menuOpen ? (
          <div
            id="mobile-menu"
            className="absolute top-full right-4 left-4 z-50 mt-2 rounded-2xl border border-ink/10 bg-white p-2 shadow-2xl shadow-ink/10 lg:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="space-y-0.5">
                {siteConfig.nav.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                          active
                            ? "bg-brand-light text-brand-dark"
                            : "text-ink/80 hover:bg-surface hover:text-brand-dark",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-2 grid gap-2 border-t border-ink/10 p-2 pt-3">
                <TrackedBookingLink
                  href="/book"
                  variant="primary"
                  size="lg"
                  placement="header-mobile-menu"
                  className="min-h-12 w-full"
                >
                  <CalendarIcon className="size-4" />
                  Book Appointment
                </TrackedBookingLink>
                <TrackedCallLink
                  variant="secondary"
                  size="lg"
                  placement="header-mobile-menu"
                  ariaLabel={`Call ${siteConfig.name} on ${siteConfig.phone}`}
                  className="min-h-12 w-full"
                >
                  <PhoneIcon className="size-4 text-brand" />
                  Call {siteConfig.phone}
                </TrackedCallLink>
              </div>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
