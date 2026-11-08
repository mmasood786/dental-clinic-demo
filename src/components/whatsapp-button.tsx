"use client";

import { usePathname } from "next/navigation";

import { WhatsAppIcon } from "@/components/icons";
import { getService, siteConfig } from "@/config/site.config";
import { cn } from "@/lib/cn";
import { whatsappChatHref } from "@/lib/contact";
import { trackEvent } from "@/lib/track";

type WhatsAppButtonProps = {
  /** `floating` is the desktop bubble; `bar` sits inside the mobile bar. */
  variant?: "floating" | "bar";
  placement?: string;
  className?: string;
};

/**
 * Click-to-chat with a message that names the treatment page the visitor is
 * reading, so the front desk knows what the conversation is about.
 */
export function WhatsAppButton({
  variant = "floating",
  placement,
  className,
}: WhatsAppButtonProps) {
  const pathname = usePathname();
  const serviceSlug = serviceSlugFromPath(pathname);
  const service = serviceSlug ? getService(serviceSlug) : undefined;

  const message = service
    ? `I was looking at ${service.title.toLowerCase()} on your website (${pathname}).`
    : undefined;

  const eventPlacement =
    placement ?? (variant === "bar" ? "mobile-bar" : "floating");

  const handleClick = () =>
    trackEvent("click_whatsapp", {
      placement: eventPlacement,
      service: serviceSlug || undefined,
    });

  // Keep the booking funnel free of floating distractions.
  if (pathname === "/book") {
    return null;
  }

  if (variant === "bar") {
    return (
      <a
        href={whatsappChatHref(message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={cn(
          "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl bg-whatsapp px-2 text-xs font-semibold text-ink transition-[filter] hover:brightness-95 active:brightness-90",
          className,
        )}
      >
        <WhatsAppIcon className="size-5" />
        WhatsApp
      </a>
    );
  }

  return (
    <a
      href={whatsappChatHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={`Chat with ${siteConfig.shortName} on WhatsApp`}
      className={cn(
        "fixed right-5 bottom-6 z-40 hidden size-14 place-items-center rounded-full bg-whatsapp text-ink shadow-lg shadow-ink/20 transition-transform hover:scale-105 md:grid",
        className,
      )}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}

/** `/services/<slug>` and `/locations/<studio>/<slug>` both name a treatment. */
function serviceSlugFromPath(pathname: string): string | undefined {
  const match =
    pathname.match(/^\/services\/([^/]+)\/?$/) ??
    pathname.match(/^\/locations\/[^/]+\/([^/]+)\/?$/);

  return match?.[1];
}
