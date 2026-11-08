import {
  TrackedCallLink,
  TrackedDirectionsLink,
  TrackedWhatsAppLink,
} from "@/components/analytics/tracked-links";
import {
  ExternalLinkIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { siteConfig } from "@/config/site.config";
import { directionsHref, mailtoHref } from "@/lib/contact";

export function ContactDetails() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <h2 className="font-display text-xl font-semibold text-ink">
        Contact details
      </h2>
      <ul className="mt-4 space-y-3 text-sm">
        <li>
          <TrackedCallLink
            placement="contact-page"
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-light text-brand-dark">
              <PhoneIcon className="size-5" />
            </span>
            <span>
              <span className="block text-xs text-muted">Call us</span>
              <span className="block font-semibold text-ink">
                {siteConfig.phone}
              </span>
            </span>
          </TrackedCallLink>
        </li>
        <li>
          <TrackedWhatsAppLink
            placement="contact-page"
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-light text-[#128C4A]">
              <WhatsAppIcon className="size-5" />
            </span>
            <span>
              <span className="block text-xs text-muted">WhatsApp</span>
              <span className="block font-semibold text-ink">Message us</span>
            </span>
          </TrackedWhatsAppLink>
        </li>
        <li>
          <a
            href={mailtoHref}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-light text-brand-dark">
              <MailIcon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-muted">Email</span>
              <span className="block font-semibold break-all text-ink">
                {siteConfig.email}
              </span>
            </span>
          </a>
        </li>
        <li className="flex gap-3 p-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-light text-brand-dark">
            <MapPinIcon className="size-5" />
          </span>
          <span>
            <span className="block text-xs text-muted">Main studio</span>
            <address className="font-semibold text-ink not-italic">
              {siteConfig.address.line1}
              {siteConfig.address.line2
                ? `, ${siteConfig.address.line2}`
                : ""}
              <br />
              {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.postalCode}
            </address>
            <TrackedDirectionsLink
              href={directionsHref()}
              placement="contact-page"
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-dark hover:text-brand"
            >
              Get directions
              <ExternalLinkIcon className="size-3" />
            </TrackedDirectionsLink>
          </span>
        </li>
      </ul>
    </div>
  );
}
