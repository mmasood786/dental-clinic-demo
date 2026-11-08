import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type SectionTone = "default" | "surface" | "soft" | "accent";
export type SectionSpacing = "sm" | "md" | "lg";

const spacing: Record<SectionSpacing, string> = {
  sm: "py-10 lg:py-12",
  md: "py-14 lg:py-16",
  lg: "py-20 lg:py-24",
};

const tones: Record<SectionTone, string> = {
  default: "",
  surface: "bg-surface",
  soft: "bg-surface-soft/60",
  accent: "bg-accent-soft/50",
};

type SectionProps = {
  children: ReactNode;
  className?: string;
  /** Vertical padding rhythm, defaults to the standard page section. */
  spacing?: SectionSpacing;
  /** Optional tinted background. */
  tone?: SectionTone;
  id?: string;
  "aria-labelledby"?: string;
};

export function Section({
  children,
  className,
  spacing: sectionSpacing = "md",
  tone = "default",
  id,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn("relative", spacing[sectionSpacing], tones[tone], className)}
    >
      {children}
    </section>
  );
}
