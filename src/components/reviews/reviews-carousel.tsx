"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { GoogleReviewCard } from "@/components/reviews/google-review-card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { GoogleReviewItem } from "@/lib/reviews";

const arrowClass =
  "grid size-10 place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Horizontal, snap-scrolling review carousel.
 *
 * Native scrolling keeps it usable without JavaScript, the track is focusable
 * so arrow keys work, and the buttons are progressive enhancement on top.
 */
export function ReviewsCarousel({ reviews }: { reviews: GoogleReviewItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    setScrollable(maxScroll > 8);
    setCanPrev(track.scrollLeft > 8);
    setCanNext(track.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    update();

    const track = trackRef.current;

    if (!track || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(update);
    observer.observe(track);

    return () => observer.disconnect();
  }, [update]);

  if (reviews.length === 0) {
    return null;
  }

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const card = track.querySelector<HTMLElement>("[data-review-card]");
    const gap = 20;
    const step =
      (card?.getBoundingClientRect().width ?? track.clientWidth * 0.8) + gap;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className="min-w-0">
      <div className="mb-4 flex min-h-10 items-center justify-between gap-3">
        <p className="text-eyebrow font-semibold text-muted uppercase">
          Patient stories
        </p>
        <div
          className={cn("flex gap-2", !scrollable && "invisible")}
          aria-hidden={!scrollable}
        >
          <button
            type="button"
            aria-label="Previous reviews"
            aria-controls="reviews-track"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className={arrowClass}
          >
            <Icon icon={ChevronLeft} size="sm" />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            aria-controls="reviews-track"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className={arrowClass}
          >
            <Icon icon={ChevronRight} size="sm" />
          </button>
        </div>
      </div>

      <div
        id="reviews-track"
        ref={trackRef}
        onScroll={update}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Patient reviews, ${reviews.length} in total`}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, index) => (
          <div
            key={`${review.author}-${index}`}
            data-review-card
            role="group"
            aria-roledescription="slide"
            aria-label={`Review ${index + 1} of ${reviews.length}`}
            className="w-[85%] shrink-0 snap-start sm:w-[21rem] lg:w-[23rem]"
          >
            <GoogleReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}
