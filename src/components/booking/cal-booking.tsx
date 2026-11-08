"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  TrackedCallLink,
  TrackedWhatsAppLink,
} from "@/components/analytics/tracked-links";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  PhoneIcon,
  ToothIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import type { Service } from "@/config/site.config";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/cn";
import { formatDuration, formatPriceFrom } from "@/lib/format";
import { bookingPath } from "@/lib/paths";
import { trackEvent } from "@/lib/track";

const { booking, brand } = siteConfig;

const CAL_UI = {
  theme: "light" as const,
  layout: "month_view" as const,
  // The treatment, duration and price are shown in our own brand bar above,
  // so hiding Cal's duplicate header keeps the embed cleaner.
  hideEventTypeDetails: true,
  cssVarsPerTheme: {
    light: {
      "cal-brand": brand.colors.primary,
      "cal-brand-emphasis": brand.colors.primaryDark,
      "cal-brand-text": "#FFFFFF",
      "cal-text": brand.colors.ink,
      "cal-text-emphasis": brand.colors.ink,
      "cal-text-subtle": brand.colors.muted,
      "cal-bg": "#FFFFFF",
      "cal-bg-subtle": brand.colors.surface,
      "cal-border": brand.colors.primaryLight,
      "cal-border-booker": brand.colors.primaryLight,
      "cal-border-booker-width": "1px",
      radius: "0.75rem",
    },
    dark: {
      "cal-brand": brand.colors.primaryLight,
      "cal-brand-emphasis": "#FFFFFF",
      "cal-brand-text": brand.colors.ink,
      "cal-text": brand.colors.ink,
      "cal-text-emphasis": brand.colors.ink,
      "cal-bg": "#FFFFFF",
      "cal-bg-subtle": brand.colors.surface,
      "cal-border": brand.colors.primaryLight,
      "cal-border-booker": brand.colors.primaryLight,
      radius: "0.75rem",
    },
  },
};

/** How long to wait for the Cal.com iframe before showing the phone fallback. */
const LOAD_TIMEOUT_MS = 8000;

/** Treatment highlighted as the most common first visit. */
const POPULAR_SLUG = "general-checkup";

type EmbedStatus = "loading" | "ready" | "failed";

type CalBookingProps = {
  services: Service[];
  initialServiceSlug?: string;
  /** Optional third column: what happens next, emergency number, policies. */
  reassurance?: ReactNode;
};

/**
 * Accepts either the short Cal.com path ("username/event-slug") or the full
 * public URL ("https://cal.com/username/event-slug") in the config.
 *
 * Note: an editor URL such as "https://app.cal.com/events/<id>" is not a public
 * booking link and cannot be embedded.
 */
function normalizeCalLink(link: string): string {
  const trimmed = link.trim();
  const publicUrl = trimmed.match(/^https?:\/\/(?:www\.)?cal\.com\/(.+)$/i);

  return (publicUrl ? publicUrl[1] : trimmed).replace(/^\/+|\/+$/g, "");
}

function eventLinkFor(slug: string): string {
  return normalizeCalLink(booking.eventTypes[slug] ?? booking.defaultEvent);
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function CalBooking({
  services,
  initialServiceSlug,
  reassurance,
}: CalBookingProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialServiceSlug ?? null,
  );
  const [status, setStatus] = useState<EmbedStatus>("loading");
  const [attempt, setAttempt] = useState(0);
  const [booked, setBooked] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const initialTracked = useRef(false);

  const selectedService = services.find(
    (service) => service.slug === selectedSlug,
  );

  // A deep link such as /book?service=implants is a selection too.
  useEffect(() => {
    if (!initialServiceSlug || initialTracked.current) {
      return;
    }

    initialTracked.current = true;
    trackEvent("start_booking", {
      service: initialServiceSlug,
      placement: "booking-deeplink",
    });
  }, [initialServiceSlug]);

  useEffect(() => {
    if (!selectedSlug) {
      return;
    }

    const namespace = `booking-${selectedSlug}`;
    let cancelled = false;
    let timer: number | undefined;
    let api: Awaited<ReturnType<typeof getCalApi>> | null = null;

    const clearLoadTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };

    const handleReady = () => {
      if (cancelled) {
        return;
      }
      clearLoadTimer();
      setStatus("ready");
    };

    const handleFailed = () => {
      if (cancelled) {
        return;
      }
      clearLoadTimer();
      setStatus("failed");
    };

    const handleBooked = () => {
      if (cancelled) {
        return;
      }
      setBooked(true);
      trackEvent("complete_booking", {
        service: selectedSlug,
        placement: "cal-embed",
      });
    };

    setStatus("loading");
    timer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      // `linkReady` can fire before this effect attaches its listener. Cal.com
      // keeps the iframe hidden until that event, so a visible iframe means the
      // embed really is ready; a hidden or missing one is a failed load.
      const iframe = embedRef.current?.querySelector("iframe");
      const isVisible = iframe
        ? window.getComputedStyle(iframe).visibility !== "hidden"
        : false;

      setStatus(isVisible ? "ready" : "failed");
    }, LOAD_TIMEOUT_MS);

    void (async () => {
      try {
        const cal = await getCalApi({ namespace });
        if (cancelled) {
          return;
        }

        api = cal;
        cal("ui", CAL_UI);
        cal("on", { action: "linkReady", callback: handleReady });
        cal("on", { action: "linkFailed", callback: handleFailed });
        cal("on", {
          action: "bookingSuccessfulV2",
          callback: handleBooked,
        });
      } catch {
        if (!cancelled) {
          clearLoadTimer();
          setStatus("failed");
        }
      }
    })();

    return () => {
      cancelled = true;
      clearLoadTimer();

      if (api) {
        api("off", { action: "linkReady", callback: handleReady });
        api("off", { action: "linkFailed", callback: handleFailed });
        api("off", {
          action: "bookingSuccessfulV2",
          callback: handleBooked,
        });
      }
    };
  }, [selectedSlug, attempt]);

  function chooseService(slug: string) {
    const isRetry = slug === selectedSlug;

    setSelectedSlug(slug);
    setStatus("loading");
    setBooked(false);
    setAttempt((value) => value + 1);

    if (!isRetry) {
      trackEvent("start_booking", {
        service: slug,
        placement: "booking-page",
      });
      window.history.replaceState(
        window.history.state,
        "",
        bookingPath(slug),
      );
    }

    window.requestAnimationFrame(() => {
      embedRef.current?.scrollIntoView({
        behavior: scrollBehavior(),
        block: "start",
      });
    });
  }

  function scrollToPicker() {
    pickerRef.current?.scrollIntoView({
      behavior: scrollBehavior(),
      block: "start",
    });
  }

  function retry() {
    setStatus("loading");
    setBooked(false);
    setAttempt((value) => value + 1);
  }

  const calLink = selectedSlug ? eventLinkFor(selectedSlug) : null;
  const namespace = selectedSlug ? `booking-${selectedSlug}` : "booking";

  return (
    <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start xl:grid-cols-[19rem_minmax(0,1fr)_18rem]">
      <div
        ref={pickerRef}
        className="min-w-0 scroll-mt-24 lg:sticky lg:top-24"
      >
        <ProgressSteps selected={Boolean(selectedSlug)} booked={booked} />

        <div className="mt-5 rounded-3xl border border-ink/10 bg-white p-4 shadow-card sm:p-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-dark uppercase">
            Step 1
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink">
            Choose your treatment
          </h2>
          <p className="mt-1 text-xs text-muted">
            {services.length} treatments · no payment online
          </p>

          <ul className="mt-4 space-y-2">
            {services.map((service) => {
              const selected = service.slug === selectedSlug;
              const popular = service.slug === POPULAR_SLUG;

              return (
                <li key={service.slug}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseService(service.slug)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-[border-color,background-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      selected
                        ? "border-brand bg-brand-light/70 shadow-sm ring-2 ring-brand"
                        : "border-ink/10 bg-white hover:border-brand/40 hover:bg-surface",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
                        selected
                          ? "bg-brand text-white"
                          : "bg-brand-light text-brand group-hover:bg-brand group-hover:text-white",
                      )}
                    >
                      <ToothIcon className="size-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="font-display text-sm font-semibold text-ink">
                          {service.title}
                        </span>
                        {popular ? (
                          <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-ink uppercase">
                            Popular
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="size-3" />
                          {formatDuration(service.durationMinutes)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{formatPriceFrom(service.priceFrom)}</span>
                      </span>
                    </span>

                    {selected ? (
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                        <CheckIcon className="size-3.5" />
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div ref={embedRef} className="min-w-0 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-dark uppercase">
              Step 2
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Pick a time
            </h2>
          </div>
          {selectedService ? (
            <button
              type="button"
              onClick={scrollToPicker}
              className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand-dark"
            >
              <ToothIcon className="size-3.5 text-brand" />
              {selectedService.title}
              <span className="font-medium text-muted">· Change</span>
            </button>
          ) : null}
        </div>

        <div className="mt-4 overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card">
          {selectedSlug && calLink ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 bg-brand px-4 py-3 text-white sm:px-5">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarIcon className="size-4" />
                  {selectedService?.title}
                </p>
                {selectedService ? (
                  <p className="flex items-center gap-2 text-xs text-white/90">
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="size-3.5" />
                      {formatDuration(selectedService.durationMinutes)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{formatPriceFrom(selectedService.priceFrom)}</span>
                  </p>
                ) : null}
              </div>

              {status === "failed" ? (
                <div role="alert" className="p-6 sm:p-8">
                  <div className="mx-auto max-w-xl text-center">
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-light text-brand">
                      <CalendarIcon className="size-7" />
                    </span>
                    <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                      We couldn&apos;t load the online calendar
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">
                      {booking.fallbackMessage}
                    </p>
                    <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                      <TrackedCallLink
                        variant="primary"
                        placement="booking-fallback"
                        className="w-full"
                      >
                        <PhoneIcon className="size-4" />
                        Call
                      </TrackedCallLink>
                      <TrackedWhatsAppLink
                        placement="booking-fallback"
                        variant="secondary"
                        className="w-full"
                      >
                        <WhatsAppIcon className="size-4 text-[#128C4A]" />
                        WhatsApp
                      </TrackedWhatsAppLink>
                      <ButtonLink
                        href="/contact"
                        variant="secondary"
                        className="w-full"
                      >
                        Send a message
                      </ButtonLink>
                    </div>
                    <button
                      type="button"
                      onClick={retry}
                      className="mt-5 text-sm font-semibold text-brand-dark underline underline-offset-2 hover:text-brand"
                    >
                      Try loading the calendar again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Cal
                    key={`${calLink}-${attempt}`}
                    namespace={namespace}
                    calLink={calLink}
                    config={{ layout: "month_view", theme: "light" }}
                    className="min-h-[640px] w-full"
                  />
                  {status === "loading" ? <EmbedSkeleton /> : null}
                </div>
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {reassurance ? (
        <div className="min-w-0 lg:col-span-2 xl:col-span-1">
          {reassurance}
        </div>
      ) : null}
    </div>
  );
}

type StepStatus = "done" | "active" | "upcoming";

function ProgressSteps({
  selected,
  booked,
}: {
  selected: boolean;
  booked: boolean;
}) {
  const steps: Array<{ label: string; status: StepStatus }> = [
    {
      label: "Treatment",
      status: selected || booked ? "done" : "active",
    },
    {
      label: "Time",
      status: booked ? "done" : selected ? "active" : "upcoming",
    },
    {
      label: "Confirmed",
      status: booked ? "done" : "upcoming",
    },
  ];

  return (
    <ol className="flex items-center gap-2">
      {steps.map((step, index) => (
        <li key={step.label} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
              step.status === "done"
                ? "bg-brand text-white"
                : step.status === "active"
                  ? "bg-ink text-white"
                  : "border border-ink/15 bg-white text-muted",
            )}
          >
            {step.status === "done" ? (
              <CheckIcon className="size-4" />
            ) : (
              index + 1
            )}
          </span>
          <span
            className={cn(
              "text-[11px] font-semibold",
              step.status === "upcoming" ? "text-muted" : "text-ink",
            )}
          >
            {step.label}
          </span>
          {index < steps.length - 1 ? (
            <span aria-hidden="true" className="h-px flex-1 bg-ink/10" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function EmbedSkeleton() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 bg-white/95 p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="size-5 animate-spin rounded-full border-2 border-brand/25 border-t-brand motion-reduce:animate-none" />
        <p className="text-sm font-semibold text-ink">
          Loading available times…
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_1.5fr]">
        <div className="space-y-2.5">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-9 animate-pulse rounded-lg bg-ink/5 motion-reduce:animate-none"
            />
          ))}
        </div>
        <div>
          <div className="h-4 w-32 animate-pulse rounded-full bg-ink/5 motion-reduce:animate-none" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-9 animate-pulse rounded-lg bg-ink/5 motion-reduce:animate-none"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden px-6 py-12 text-center sm:px-10 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <span className="size-48 rounded-full border border-brand/10" />
        <span className="absolute size-72 rounded-full border border-brand/5" />
      </div>
      <span className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/25">
        <ToothIcon className="size-8" />
      </span>
      <p className="relative mt-5 font-display text-xl font-semibold text-ink">
        Your calendar will appear here
      </p>
      <p className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Pick a treatment to see live availability. It takes about a minute, and
        you get an instant confirmation by email.
      </p>
    </div>
  );
}
