import { siteConfig, type Address } from "@/config/site.config";

/** Joins a structured address into one display line. */
export function formatAddress(address: Address): string {
  return [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.postalCode}`,
  ]
    .filter(Boolean)
    .join(", ");
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export const telHref = phoneHref(siteConfig.phone);

/** Click-to-chat URL with an optional message added to the default greeting. */
export function whatsappChatHref(message?: string): string {
  const text = message
    ? `${siteConfig.whatsappMessage} ${message}`
    : siteConfig.whatsappMessage;

  return `https://wa.me/${siteConfig.whatsappNumber.replace(
    /\D/g,
    "",
  )}?text=${encodeURIComponent(text)}`;
}

export const whatsappHref = whatsappChatHref();

export const mailtoHref = `mailto:${siteConfig.email}`;

export const fullAddress = formatAddress(siteConfig.address);

export function directionsHref(destination: string = fullAddress): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination,
  )}`;
}

export function mapsSearchHref(query: string = fullAddress): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}
