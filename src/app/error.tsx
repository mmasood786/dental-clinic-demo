"use client";

import Link from "next/link";
import { useEffect } from "react";

import { TrackedCallLink } from "@/components/analytics/tracked-links";
import { PhoneIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { buttonStyles } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Route error boundary. The root layout (header, footer, consent, mobile bar)
 * stays in place; only the failed segment is replaced.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-2xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-dark uppercase">
          Something went wrong
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          We could not load this page
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink/75">
          Your details are safe and nothing has been booked or sent. Try again,
          or call the studio and we will help straight away.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className={buttonStyles({ size: "lg" })}
          >
            Try again
          </button>
          <TrackedCallLink
            variant="secondary"
            size="lg"
            placement="error-page"
          >
            <PhoneIcon className="size-4 text-brand" />
            Call {siteConfig.phone}
          </TrackedCallLink>
        </div>

        <p className="mt-6 text-sm">
          <Link
            href="/"
            className="font-semibold text-brand-dark hover:text-brand"
          >
            Back to the home page
          </Link>
        </p>
      </Container>
    </section>
  );
}
