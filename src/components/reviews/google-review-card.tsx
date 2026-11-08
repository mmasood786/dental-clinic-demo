import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { GoogleReviewItem } from "@/lib/reviews";

export function GoogleReviewCard({
  review,
  className,
}: {
  review: GoogleReviewItem;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-7",
        className,
      )}
    >
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            className={cn(
              "size-4",
              index < Math.round(review.rating)
                ? "text-accent-dark"
                : "text-ink/15",
            )}
          />
        ))}
      </div>
      <span className="sr-only">{review.rating} out of 5 stars</span>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/80">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-5 border-t border-ink/10 pt-4">
        <span className="block text-sm font-semibold text-ink">
          {review.author}
        </span>
        {review.relativeDate ? (
          <span className="block text-xs text-muted">
            {review.relativeDate} · Google
          </span>
        ) : (
          <span className="block text-xs text-muted">
            {review.treatment ? `${review.treatment} · Sample` : "Sample review"}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
