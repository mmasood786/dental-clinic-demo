"use client";

import { useEffect, useState } from "react";

import { ClockIcon } from "@/components/icons";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/format";
import { getClinicWeekday } from "@/lib/hours";

/**
 * Opening hours with today's row highlighted.
 *
 * The weekday is worked out in the clinic's time zone after mount, so a
 * cached page never highlights the wrong day and the server HTML stays
 * identical to the first client render.
 */
export function LocationHours({ className }: { className?: string }) {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(getClinicWeekday());
  }, []);

  return (
    <div
      className={cn(
        "rounded-3xl border border-ink/10 bg-white p-5 shadow-card sm:p-6",
        className,
      )}
    >
      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
        <ClockIcon className="size-4 text-brand" />
        Opening hours
      </h3>
      <dl className="mt-3 space-y-1 text-sm">
        {siteConfig.openingHours.map((entry) => {
          const isToday = entry.day === today;

          return (
            <div
              key={entry.day}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl px-2.5 py-2",
                isToday
                  ? "bg-brand-light font-semibold text-brand-dark"
                  : "text-ink/75",
              )}
            >
              <dt>
                {entry.day}
                {isToday ? <span className="sr-only"> (today)</span> : null}
              </dt>
              <dd
                className={cn(
                  "text-right",
                  isToday ? "text-brand-dark" : "text-ink/90",
                )}
              >
                {entry.opens && entry.closes
                  ? `${formatTime(entry.opens)} – ${formatTime(entry.closes)}`
                  : "Closed"}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
