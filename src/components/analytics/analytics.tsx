"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { CONSENT_STORAGE_KEY } from "@/lib/track";

const STORAGE_KEY = CONSENT_STORAGE_KEY;
const RESET_EVENT = "cookie-consent:reset";

type Consent = "granted" | "denied";

/**
 * GA4 loader plus consent banner.
 *
 * The Google tag is only injected after the visitor accepts, so no analytics
 * request leaves the browser beforehand. The choice lives in localStorage;
 * `CookieSettingsButton` in the footer re-opens the banner.
 */
export function Analytics() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored === "granted" || stored === "denied") {
        setConsent(stored);
      }
    } catch {
      // Storage blocked: behave as if no choice was made yet.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const reset = () => {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore: the banner still reopens for this page view.
      }

      setConsent(null);
    };

    window.addEventListener(RESET_EVENT, reset);

    return () => window.removeEventListener(RESET_EVENT, reset);
  }, []);

  useEffect(() => {
    if (!gaId) {
      return;
    }

    // GA4's official opt-out flag, so withdrawing consent stops collection
    // even though the gtag script has already been injected.
    (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] =
      consent !== "granted";
  }, [consent, gaId]);

  const choose = useCallback((value: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // The choice still applies to this page view.
    }

    setConsent(value);
  }, []);

  const gaEnabled = consent === "granted" && Boolean(gaId);

  return (
    <>
      {gaEnabled && gaId ? (
        <>
          <GoogleAnalytics gaId={gaId} />
          <GoogleAnalyticsPageViews />
        </>
      ) : null}
      {ready && consent === null ? <ConsentBanner onChoose={choose} /> : null}
    </>
  );
}

/**
 * GA4 does not see client-side App Router navigations on its own, so send a
 * `page_view` whenever the path changes. The first render is skipped because
 * `gtag('config')` already sends the initial page view.
 */
function GoogleAnalyticsPageViews() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === pathname) {
      return;
    }

    if (lastPath.current !== null) {
      window.gtag?.("event", "page_view", { page_path: pathname });
    }

    lastPath.current = pathname;
  }, [pathname]);

  return null;
}

function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(
          gaId,
        )},{send_page_view:true});`}
      </Script>
    </>
  );
}

function ConsentBanner({
  onChoose,
}: {
  onChoose: (value: Consent) => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[60] px-3 md:bottom-4 md:px-4">
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-xl shadow-ink/10 sm:flex-row sm:items-center sm:justify-between sm:gap-5"
      >
        <p className="text-xs leading-relaxed text-muted sm:text-sm">
          <span className="font-semibold text-ink">Cookies for analytics.</span>{" "}
          We use Google Analytics to understand which pages help patients most.
          Accept, decline, or change your mind later from the footer. The site
          works either way.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onChoose("denied")}
            className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => onChoose("granted")}
            className={buttonStyles({ className: "px-4 py-2" })}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
