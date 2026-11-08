import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ContainerSize = "default" | "narrow" | "wide";

const widths: Record<ContainerSize, string> = {
  default: "max-w-[75rem]",
  narrow: "max-w-3xl",
  wide: "max-w-[90rem]",
};

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** Content width; defaults to the page grid at roughly 1200px. */
  size?: ContainerSize;
};

export function Container({
  children,
  className,
  size = "default",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        widths[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
