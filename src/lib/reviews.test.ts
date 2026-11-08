import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/config/site.config";
import {
  aggregateRatingFrom,
  getGoogleReviews,
  googleWriteReviewHref,
} from "@/lib/reviews";

const originalFetch = global.fetch;

function mockFetch(implementation: () => Promise<unknown>) {
  global.fetch = vi.fn(implementation) as unknown as typeof fetch;
}

async function runWithKey<T>(key: string | undefined, run: () => Promise<T>) {
  const previous = process.env.GOOGLE_PLACES_API_KEY;

  if (key === undefined) {
    delete process.env.GOOGLE_PLACES_API_KEY;
  } else {
    process.env.GOOGLE_PLACES_API_KEY = key;
  }

  try {
    return await run();
  } finally {
    if (previous === undefined) {
      delete process.env.GOOGLE_PLACES_API_KEY;
    } else {
      process.env.GOOGLE_PLACES_API_KEY = previous;
    }
  }
}

beforeEach(() => {
  mockFetch(async () => {
    throw new Error("no network in tests");
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("getGoogleReviews", () => {
  it("maps a Places API response into reviews and a live aggregate rating", async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => ({
        rating: 4.7,
        userRatingCount: 132,
        googleMapsUri: "https://maps.google.com/?cid=test",
        reviews: [
          {
            rating: 5,
            relativePublishTimeDescription: "2 weeks ago",
            text: { text: "Gentle and clear about the cost." },
            authorAttribution: { displayName: "Sam T." },
          },
          {
            rating: 4,
            text: { text: "Easy to book and seen on time." },
            authorAttribution: { displayName: "Ali R." },
          },
          {
            rating: 5,
            text: { text: "" },
            authorAttribution: { displayName: "No text, dropped" },
          },
        ],
      }),
    }));

    const reviews = await runWithKey("test-key", getGoogleReviews);

    expect(reviews.isLive).toBe(true);
    expect(reviews.rating).toBe(4.7);
    expect(reviews.total).toBe(132);
    expect(reviews.mapsUri).toBe("https://maps.google.com/?cid=test");
    expect(reviews.reviews).toHaveLength(2);
    expect(reviews.reviews[0]).toEqual({
      author: "Sam T.",
      rating: 5,
      text: "Gentle and clear about the cost.",
      relativeDate: "2 weeks ago",
    });
    expect(reviews.reviews[1].relativeDate).toBeNull();
    expect(aggregateRatingFrom(reviews)).toEqual({
      ratingValue: 4.7,
      reviewCount: 132,
    });
  });

  it("falls back to the sample reviews when Google fails", async () => {
    const reviews = await runWithKey("test-key", getGoogleReviews);

    expect(reviews.isLive).toBe(false);
    expect(reviews.rating).toBe(siteConfig.reviews.fallbackRating);
    expect(reviews.total).toBe(siteConfig.reviews.fallbackTotal);
    expect(reviews.reviews).toHaveLength(siteConfig.reviews.items.length);
    expect(aggregateRatingFrom(reviews)).toBeNull();
  });

  it("never calls Google and never advertises a rating without a key", async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const reviews = await runWithKey(undefined, getGoogleReviews);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(reviews.isLive).toBe(false);
    expect(aggregateRatingFrom(reviews)).toBeNull();
  });

  it("builds the write-review URL from the configured place id", () => {
    expect(googleWriteReviewHref).toBe(
      `https://search.google.com/local/writereview?placeid=${siteConfig.googlePlaceId}`,
    );
  });
});
