import type { LucideIcon, LucideProps } from "lucide-react";

import { cn } from "@/lib/cn";

export type IconSize = "sm" | "md" | "lg" | "xl";
export type IconTone = "inherit" | "brand" | "accent" | "muted" | "white";

const sizes: Record<IconSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
};

const tones: Record<IconTone, string> = {
  inherit: "",
  brand: "text-brand",
  accent: "text-accent-dark",
  muted: "text-muted",
  white: "text-white",
};

type IconProps = Omit<LucideProps, "size" | "ref"> & {
  /** A lucide-react icon component, e.g. `CalendarDays`. */
  icon: LucideIcon;
  size?: IconSize;
  tone?: IconTone;
  /** Accessible name. When omitted the icon is decorative and hidden. */
  label?: string;
};

/**
 * Single wrapper for every lucide icon. Keeps stroke weight, sizing and
 * accessibility consistent across the site.
 */
export function Icon({
  icon: IconComponent,
  size = "md",
  tone = "inherit",
  label,
  className,
  strokeWidth = 1.8,
  ...rest
}: IconProps) {
  return (
    <IconComponent
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
      strokeWidth={strokeWidth}
      className={cn(sizes[size], tones[tone], className)}
      {...rest}
    />
  );
}
