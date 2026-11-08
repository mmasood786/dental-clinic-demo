import { siteConfig } from "@/config/site.config";
import { formatTime } from "@/lib/format";

export type OpeningStatus = {
  isOpen: boolean;
  /** Human-readable status for the hero card, e.g. "Open today until 6:00 pm". */
  label: string;
};

type ZonedClock = {
  day: string;
  time: string;
};

/**
 * Reads the clinic's local weekday and time with `Intl`, so the same helper
 * works on the server and in the browser without a timezone library.
 */
function zonedClock(now: Date): ZonedClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: siteConfig.timeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const hour = value("hour").padStart(2, "0");
  const minute = value("minute").padStart(2, "0");

  return {
    day: value("weekday"),
    time: `${hour}:${minute}`,
  };
}

/**
 * Weekday name in the clinic's time zone, e.g. "Monday". Used to highlight
 * today's row in the opening-hours list.
 */
export function getClinicWeekday(now = new Date()): string {
  return zonedClock(now).day;
}

/**
 * Today's opening status from `siteConfig.openingHours`, including the next
 * opening day when the clinic is already closed.
 */
export function getOpeningStatus(now = new Date()): OpeningStatus | null {
  const hours = siteConfig.openingHours;

  if (hours.length === 0) {
    return null;
  }

  const { day, time } = zonedClock(now);
  const todayIndex = hours.findIndex((entry) => entry.day === day);

  if (todayIndex === -1) {
    return null;
  }

  const today = hours[todayIndex];

  if (today.opens && today.closes) {
    if (time < today.opens) {
      return {
        isOpen: false,
        label: `Opens today at ${formatTime(today.opens)}`,
      };
    }

    if (time < today.closes) {
      return {
        isOpen: true,
        label: `Open today until ${formatTime(today.closes)}`,
      };
    }
  }

  for (let offset = 1; offset <= hours.length; offset += 1) {
    const next = hours[(todayIndex + offset) % hours.length];

    if (!next.opens) {
      continue;
    }

    const nextDay = offset === 1 ? "tomorrow" : next.day;

    return {
      isOpen: false,
      label: `Closed now · Opens ${nextDay} at ${formatTime(next.opens)}`,
    };
  }

  return null;
}
