import { siteConfig } from "@/config/site.config";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

/** Turns a `priceFrom` value into display copy such as "From $3,200". */
export function formatPriceFrom(amount: number | null): string {
  if (amount === null) {
    return "Quoted after consultation";
  }
  if (amount === 0) {
    return "Complimentary";
  }
  return `From ${formatCurrency(amount)}`;
}

/** Formats 24-hour "HH:mm" values into "8:00 am". */
export function formatTime(time: string): string {
  const [hoursPart, minutesPart] = time.split(":");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);
  const suffix = hours >= 12 ? "pm" : "am";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** "45 minutes" / "1 hour" / "1 hour 30 minutes". */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) {
    return `${rest} minutes`;
  }

  const hourLabel = `${hours} hour${hours === 1 ? "" : "s"}`;

  return rest === 0 ? hourLabel : `${hourLabel} ${rest} minutes`;
}
