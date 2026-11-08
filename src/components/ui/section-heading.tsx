import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  /** Supporting copy below the title. `intro` is kept as an alias. */
  subtitle?: string;
  intro?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  intro,
  action,
  align = "left",
  className,
  id,
}: SectionHeadingProps) {
  const copy = subtitle ?? intro;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          align === "center" && "mx-auto text-center",
        )}
      >
        {eyebrow ? (
          <p className="text-eyebrow font-semibold text-brand-dark uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className="mt-2 font-display text-h2 font-semibold tracking-tight text-ink"
        >
          {title}
        </h2>
        {copy ? (
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lead">
            {copy}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
