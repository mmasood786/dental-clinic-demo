import { cache } from "react";

import { siteConfig } from "@/config/site.config";

/**
 * Google reviews for the clinic, loaded from the Places API (New).
 *
 * The API is optional: without `GOOGLE_PLACES_API_KEY` — or if Google is
 * unreachable — the widget falls back to the sample reviews in
 * `siteConfig.reviews` so a page can never crash because of a third party.
 */

export type GoogleReviewItem = {
  author: string;
  rating: number;
  text: string;
  /** Google's own relative date, e.g. "2 weeks ago"; null for sample reviews. */
  relativeDate: string | null;
  /** Treatment label from the config, used on sample cards only. */
  treatment?: string;
};

export type GoogleReviews = {
  /** Average rating out of 5, or null when only sample data is available. */
  rating: number | null;
  /** Total number of Google ratings. */
  total: number | null;
  reviews: GoogleReviewItem[];
  /** Link to the Business Profile, or the reviews tab when Google provides it. */
  mapsUri: string;
  /** True only when the numbers came from Google. */
  isLive: boolean;
};

/** 24 hours, the caching window for review data. */
export const REVIEWS_REVALIDATE_SECONDS = 60 * 60 * 24;

export const googlePlaceHref = `https://www.google.com/maps/place/?q=place_id:${siteConfig.googlePlaceId}`;

export const googleMapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.name)}&query_place_id=${siteConfig.googlePlaceId}`;

export const googleWriteReviewHref = `https://search.google.com/local/writereview?placeid=${siteConfig.googlePlaceId}`;

const PLACE_FIELDS = [
  "displayName",
  "rating",
  "userRatingCount",
  "reviews",
  "googleMapsUri",
].join(",");

type PlacesApiReview = {
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string };
  authorAttribution?: { displayName?: string };
};

type PlacesApiPlace = {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesApiReview[];
};

function sampleReviews(): GoogleReviews {
  return {
    rating: siteConfig.reviews.fallbackRating,
    total: siteConfig.reviews.fallbackTotal,
    reviews: siteConfig.reviews.items.slice(0, 5).map((review) => ({
      author: review.author,
      rating: review.rating,
      text: review.quote,
      relativeDate: null,
      treatment: review.treatment,
    })),
    mapsUri: googlePlaceHref,
    isLive: false,
  };
}

async function fetchReviews(): Promise<GoogleReviews> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = siteConfig.googlePlaceId;

  if (!apiKey || !placeId) {
    return sampleReviews();
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": PLACE_FIELDS,
        },
        next: {
          revalidate: REVIEWS_REVALIDATE_SECONDS,
          tags: ["google-reviews"],
        },
      },
    );

    if (!response.ok) {
      return sampleReviews();
    }

    const place = (await response.json()) as PlacesApiPlace;
    const reviews = (place.reviews ?? [])
      .slice(0, 5)
      .filter((review) => review.authorAttribution?.displayName)
      .map((review) => ({
        author: review.authorAttribution?.displayName ?? "Google user",
        rating: Math.min(Math.max(review.rating ?? 0, 1), 5),
        text: review.text?.text ?? "",
        relativeDate: review.relativePublishTimeDescription ?? null,
      }))
      .filter((review) => review.text.length > 0);

    if (typeof place.rating !== "number" || reviews.length === 0) {
      return sampleReviews();
    }

    return {
      rating: place.rating,
      total: place.userRatingCount ?? reviews.length,
      reviews,
      mapsUri: place.googleMapsUri ?? googlePlaceHref,
      isLive: true,
    };
  } catch {
    return sampleReviews();
  }
}

/**
 * Request-level memoised reviews. The fetch itself is cached by Next for 24
 * hours, so this only avoids duplicate work when several components on the
 * same page need the data (widget plus JSON-LD).
 */
export const getGoogleReviews = cache(fetchReviews);

/**
 * Converts live review data into the shape `dentistSchema` expects. Returns
 * null for sample data so the JSON-LD never advertises a made-up rating.
 */
export function aggregateRatingFrom(
  reviews: GoogleReviews,
): { ratingValue: number; reviewCount: number } | null {
  if (
    !reviews.isLive ||
    reviews.rating === null ||
    reviews.total === null ||
    reviews.total <= 0
  ) {
    return null;
  }

  return {
    ratingValue: Number(reviews.rating.toFixed(1)),
    reviewCount: reviews.total,
  };
}
