"use client";

const STORAGE_KEY = "cookie-consent";
const RESET_EVENT = "cookie-consent:reset";

/**
 * Re-opens the consent banner. Used in the footer so a visitor can change their
 * mind without clearing site data.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Storage blocked: the banner still reopens for this page view.
        }

        window.dispatchEvent(new Event(RESET_EVENT));
      }}
    >
      Cookie settings
    </button>
  );
}
