import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  breadcrumbs?: Crumb[];
  /** Primary and secondary actions, e.g. book / call. */
  actions?: ReactNode;
  /** Small factual chips under the intro (price, duration, rating…). */
  highlights?: ReactNode;
  className?: string;
  children?: ReactNode;
};

/**
 * The page-level hero band: breadcrumb, H1, short intro and a CTA row on a soft
 * brand wash. Every inner page starts here so the rhythm is identical.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  actions,
  highlights,
  className,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-ink/10 bg-surface",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-24 size-[32rem] rounded-full bg-brand/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-accent/10 blur-3xl"
      />

      <Container className="relative py-10 lg:py-16">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}

        <div className="max-w-3xl">
          <p className="text-eyebrow font-semibold text-brand-dark uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-h1 font-semibold tracking-tight text-ink">
            {title}
          </h1>
          {intro ? (
            <p className="mt-4 max-w-2xl text-lead leading-relaxed text-ink/70">
              {intro}
            </p>
          ) : null}

          {highlights ? (
            <div className="mt-6 flex flex-wrap gap-2">{highlights}</div>
          ) : null}

          {actions ? (
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {actions}
            </div>
          ) : null}
        </div>

        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}

/** A small factual chip used in `highlights`. */
export function HeroChip({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink/75">
      {icon}
      {children}
    </span>
  );
}
