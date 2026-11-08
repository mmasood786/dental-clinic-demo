import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "accent"
  | "inverted"
  | "outlineLight"
  | "danger";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-60 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-dark",
  secondary:
    "border border-ink/15 bg-white text-ink hover:border-brand hover:text-brand-dark",
  ghost: "bg-transparent text-ink hover:bg-ink/5 hover:text-brand-dark",
  accent:
    "bg-cta text-cta-foreground shadow-sm shadow-cta/30 hover:bg-cta-hover hover:text-white",
  inverted: "bg-white text-brand-dark hover:bg-brand-light",
  outlineLight:
    "border border-white/40 bg-transparent text-white hover:bg-white/10",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm sm:text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className">;

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonStyles({ variant, size, className })}
      {...rest}
    >
      {children}
    </Link>
  );
}
