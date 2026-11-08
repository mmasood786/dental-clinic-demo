import { Container } from "@/components/layout/container";
import { Section } from "@/components/ui/section";

/**
 * Placeholder for the async Google reviews section.
 *
 * Mirrors the real two-column layout (rating card on the left, review cards on
 * the right) so the streamed widget does not shift the page when it resolves.
 */
export function ReviewsSkeleton() {
  return (
    <Section tone="surface" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="sr-only">
        Patient reviews
      </h2>
      <span className="sr-only" role="status">
        Loading patient reviews…
      </span>

      <Container
        aria-hidden="true"
        className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-12"
      >
        <div>
          <div className="h-3 w-24 animate-pulse rounded-full bg-ink/10 motion-reduce:animate-none" />
          <div className="mt-4 h-9 w-4/5 max-w-sm animate-pulse rounded-xl bg-ink/10 motion-reduce:animate-none" />
          <div className="mt-3 h-4 w-full max-w-sm animate-pulse rounded-full bg-ink/5 motion-reduce:animate-none" />

          <div className="mt-7 rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="size-11 shrink-0 animate-pulse rounded-xl bg-ink/5 motion-reduce:animate-none" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-24 animate-pulse rounded-full bg-ink/10 motion-reduce:animate-none" />
                <div className="h-8 w-20 animate-pulse rounded-lg bg-ink/10 motion-reduce:animate-none" />
              </div>
            </div>
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="size-4 animate-pulse rounded-full bg-ink/10 motion-reduce:animate-none"
                />
              ))}
            </div>
            <div className="mt-3 h-4 w-40 animate-pulse rounded-full bg-ink/5 motion-reduce:animate-none" />
            <div className="mt-5 h-11 w-full animate-pulse rounded-full bg-ink/5 motion-reduce:animate-none" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card"
            >
              <div className="h-4 w-24 animate-pulse rounded-full bg-ink/10 motion-reduce:animate-none" />
              <div className="mt-4 space-y-2.5">
                {Array.from({ length: 4 }).map((__, line) => (
                  <div
                    key={line}
                    className="h-3.5 w-full animate-pulse rounded-full bg-ink/5 motion-reduce:animate-none"
                  />
                ))}
                <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-ink/5 motion-reduce:animate-none" />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="size-9 animate-pulse rounded-full bg-ink/5 motion-reduce:animate-none" />
                <div className="h-3 w-28 animate-pulse rounded-full bg-ink/10 motion-reduce:animate-none" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
