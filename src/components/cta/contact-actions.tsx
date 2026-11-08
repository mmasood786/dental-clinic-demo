import {
  TrackedBookingLink,
  TrackedCallLink,
  TrackedWhatsAppLink,
} from "@/components/analytics/tracked-links";
import { CalendarIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/cn";

type ContactActionsProps = {
  /** Where these links live, recorded with the analytics event. */
  placement: string;
  service?: string;
  location?: string;
  /** Defaults to the main clinic number. */
  phone?: string;
  bookHref?: string;
  bookLabel?: string;
  /** `stack` fills the column, `row` sits inline on wider screens. */
  layout?: "stack" | "row";
  size?: "md" | "lg";
  className?: string;
};

/**
 * The three ways to act, in priority order: book, call, WhatsApp.
 *
 * Used by the sticky service card, the booking page and location pages so the
 * order and styling never drift between them.
 */
export function ContactActions({
  placement,
  service,
  location,
  phone = siteConfig.phone,
  bookHref = "/book",
  bookLabel = "Book your visit",
  layout = "stack",
  size = "md",
  className,
}: ContactActionsProps) {
  const widthClass = layout === "stack" ? "w-full" : "w-full sm:w-auto";

  return (
    <div
      className={cn(
        "flex gap-2.5",
        layout === "stack" ? "flex-col" : "flex-col sm:flex-row sm:flex-wrap",
        className,
      )}
    >
      <TrackedBookingLink
        href={bookHref}
        variant="primary"
        size={size}
        placement={placement}
        className={widthClass}
      >
        <CalendarIcon className="size-4" />
        {bookLabel}
      </TrackedBookingLink>

      <TrackedCallLink
        phone={phone}
        placement={placement}
        location={location}
        variant="secondary"
        size={size}
        ariaLabel={`Call ${siteConfig.name} on ${phone}`}
        className={widthClass}
      >
        <PhoneIcon className="size-4 text-brand" />
        Call {phone}
      </TrackedCallLink>

      <TrackedWhatsAppLink
        placement={placement}
        service={service}
        location={location}
        ariaLabel={`Chat with ${siteConfig.shortName} on WhatsApp`}
        className={buttonStyles({
          variant: "ghost",
          size,
          className: cn(widthClass, "text-brand-dark hover:bg-brand-light"),
        })}
      >
        <WhatsAppIcon className="size-4 text-brand" />
        Ask on WhatsApp
      </TrackedWhatsAppLink>
    </div>
  );
}
