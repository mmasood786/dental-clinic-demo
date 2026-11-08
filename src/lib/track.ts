/**
 * Client-side interaction tracking.
 *
 * Every event goes to two places:
 * - GA4, when `NEXT_PUBLIC_GA_ID` is configured and the visitor accepted
 *   analytics cookies (the `gtag` global only exists then).
 * - `POST /api/track`, which stores the event in the `contact_events` table so
 *   the clinic can see contact intent without opening GA.
 *
 * Both destinations are consent-gated: `trackEvent()` does nothing until the
 * visitor accepts analytics cookies.
 *
 * Nothing here throws: marketing scripts must never break a booking.
 */

export const TRACK_EVENTS = [
  "click_call",
  "click_whatsapp",
  "click_directions",
  "start_booking",
  "complete_booking",
  "submit_contact_form",
] as const;

export type TrackEventName = (typeof TRACK_EVENTS)[number];

export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

export type TrackEventOptions = {
  /** Treatment slug, when the click is tied to a treatment. */
  service?: string;
  /** Studio slug. */
  location?: string;
  /** Where the link lives: header, footer, mobile-bar, service-page, … */
  placement?: string;
};

type TrackPayload = {
  event: TrackEventName;
  path: string;
  utm: UtmParams | null;
  service: string | null;
  location: string | null;
  placement: string | null;
  timestamp: string;
};

const UTM_STORAGE_KEY = "analytics-utm";

/** Shared with the consent banner so both read the same choice. */
export const CONSENT_STORAGE_KEY = "cookie-consent";

/**
 * True only when the visitor explicitly accepted analytics cookies.
 * Without consent nothing is sent to GA4 or to the clinic database.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === "granted";
  } catch {
    return false;
  }
}

const UTM_QUERY_KEYS = {
  source: "utm_source",
  medium: "utm_medium",
  campaign: "utm_campaign",
  term: "utm_term",
  content: "utm_content",
} as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function readStoredUtm(): UtmParams | null {
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as UtmParams;
    const hasValue = Object.values(parsed).some(Boolean);

    return hasValue ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Reads UTM parameters from the current URL and remembers the first set seen
 * in this tab, so a booking completed on `/book` still carries the campaign
 * that brought the visitor in.
 */
export function getUtmParams(): UtmParams | null {
  if (typeof window === "undefined") {
    return null;
  }

  const search = new URLSearchParams(window.location.search);
  const found: UtmParams = {};

  for (const [key, queryKey] of Object.entries(UTM_QUERY_KEYS)) {
    const value = search.get(queryKey)?.trim();

    if (value) {
      found[key as keyof UtmParams] = value.slice(0, 128);
    }
  }

  if (Object.keys(found).length > 0) {
    try {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
    } catch {
      // Private mode with storage disabled: the event is still sent without it.
    }

    return found;
  }

  return readStoredUtm();
}

function sendToApi(payload: TrackPayload) {
  const body = JSON.stringify(payload);

  // sendBeacon survives the page unloading on tel:, wa.me and maps links.
  if (typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([body], { type: "application/json" });

      if (navigator.sendBeacon("/api/track", blob)) {
        return;
      }
    } catch {
      // Fall through to fetch.
    }
  }

  void fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics failures are never surfaced to the visitor.
  });
}

/** Records one interaction in GA4 (if consented) and in the clinic database. */
export function trackEvent(
  event: TrackEventName,
  options: TrackEventOptions = {},
) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) {
    return;
  }

  const path = `${window.location.pathname}${window.location.search}`;
  const utm = getUtmParams();

  window.gtag?.("event", event, {
    page_path: window.location.pathname,
    placement: options.placement,
    service: options.service,
    location: options.location,
    ...(utm?.source ? { utm_source: utm.source } : {}),
    ...(utm?.medium ? { utm_medium: utm.medium } : {}),
    ...(utm?.campaign ? { utm_campaign: utm.campaign } : {}),
    ...(utm?.term ? { utm_term: utm.term } : {}),
    ...(utm?.content ? { utm_content: utm.content } : {}),
  });

  sendToApi({
    event,
    path: path.slice(0, 512),
    utm,
    service: options.service ?? null,
    location: options.location ?? null,
    placement: options.placement ?? null,
    timestamp: new Date().toISOString(),
  });
}
