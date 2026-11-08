"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { getOpeningStatus, type OpeningStatus } from "@/lib/hours";

type OpeningStatusCardProps = {
  /** Status computed on the server so the first paint is never empty. */
  initialStatus: OpeningStatus;
  className?: string;
};

/**
 * Floating "open today" card. It refreshes once a minute in the browser so a
 * statically cached page never shows stale opening hours.
 */
export function OpeningStatusCard({
  initialStatus,
  className,
}: OpeningStatusCardProps) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const update = () => {
      const next = getOpeningStatus();
      if (next) {
        setStatus(next);
      }
    };

    update();
    const timer = window.setInterval(update, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className={cn(
        "absolute right-4 -bottom-6 left-4 rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-card-hover backdrop-blur sm:right-auto sm:left-6 sm:max-w-xs",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            status.isOpen
              ? "bg-brand-light text-brand"
              : "bg-accent-soft text-accent-dark",
          )}
        >
          <Icon icon={Clock3} size="md" />
        </span>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
            Today
          </p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {status.label}
          </p>
        </div>
      </div>
    </div>
  );
}
