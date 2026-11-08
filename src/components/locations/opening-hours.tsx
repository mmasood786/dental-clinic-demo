import { ClockIcon } from "@/components/icons";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/format";

type OpeningHoursProps = {
  title?: string;
  className?: string;
};

export function OpeningHours({
  title = "Opening hours",
  className,
}: OpeningHoursProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink/10 bg-white p-6",
        className,
      )}
    >
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
        <ClockIcon className="size-5 text-brand" />
        {title}
      </h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        {siteConfig.openingHours.map((entry) => (
          <div
            key={entry.day}
            className="flex justify-between gap-4 border-b border-ink/5 pb-2.5 last:border-none last:pb-0"
          >
            <dt className="text-ink/80">{entry.day}</dt>
            <dd className="text-right font-medium text-ink">
              {entry.opens && entry.closes
                ? `${formatTime(entry.opens)} – ${formatTime(entry.closes)}`
                : "Closed"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
