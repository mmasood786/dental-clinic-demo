import { Star } from "lucide-react";

import { cn } from "@/lib/cn";

export type RatingStarsSize = "sm" | "md" | "lg";

const starSizes: Record<RatingStarsSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

type RatingStarsProps = {
  /** Rating from 0 to 5, taken from config or live review data. */
  rating: number;
  /** Number of reviews, when available. Omit rather than inventing a count. */
  reviewCount?: number;
  size?: RatingStarsSize;
  showValue?: boolean;
  className?: string;
};

/**
 * Five-star rating display. The visual stars are hidden from assistive
 * technology and the whole group is announced once with a readable label.
 */
export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
  showValue = true,
  className,
}: RatingStarsProps) {
  const filled = Math.round(Math.min(5, Math.max(0, rating)));
  const label = `Rated ${rating} out of 5${
    reviewCount ? ` from ${reviewCount} reviews` : ""
  }`;

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      role="img"
      aria-label={label}
    >
      <span aria-hidden="true" className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              starSizes[size],
              index < filled ? "text-accent-dark" : "text-ink/20",
            )}
            fill={index < filled ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        ))}
      </span>
      {showValue ? (
        <span
          aria-hidden="true"
          className="text-sm font-semibold text-ink"
        >
          {rating.toFixed(1)}
        </span>
      ) : null}
      {reviewCount ? (
        <span aria-hidden="true" className="text-sm text-muted">
          ({reviewCount})
        </span>
      ) : null}
    </span>
  );
}
