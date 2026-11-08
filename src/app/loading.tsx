import { Container } from "@/components/layout/container";

/**
 * Route-level loading state. The skeleton mirrors the page hero and card grid so
 * the swap to real content does not shift the layout.
 */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page…</span>

      <div
        aria-hidden="true"
        className="border-b border-ink/10 bg-surface motion-reduce:animate-none"
      >
        <Container className="py-10 lg:py-14">
          <div className="h-3 w-24 animate-pulse rounded-full bg-ink/10 motion-reduce:animate-none" />
          <div className="mt-4 h-10 w-3/4 max-w-lg animate-pulse rounded-xl bg-ink/10 motion-reduce:animate-none" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-full bg-ink/10 motion-reduce:animate-none" />
          <div className="mt-2 h-4 w-2/3 max-w-md animate-pulse rounded-full bg-ink/10 motion-reduce:animate-none" />
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <div
          aria-hidden="true"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-2xl bg-ink/5 motion-reduce:animate-none"
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
