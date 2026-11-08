"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger the fade in milliseconds. */
  delay?: number;
  /** Replay the animation every time the element enters the viewport. */
  once?: boolean;
};

/**
 * Fades content in as it enters the viewport.
 *
 * Content stays visible on the server and for users without JavaScript. The
 * effect only hides an element once it has mounted and confirmed that the
 * element is below the fold, so nothing above the fold ever flashes.
 * `prefers-reduced-motion` disables the effect entirely.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      return;
    }

    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Already visible on first paint: leave it alone.
    if (element.getBoundingClientRect().top < viewportHeight * 0.9) {
      return;
    }

    setHidden(true);
    setRevealed(false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setRevealed(true);

        if (once) {
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={elementRef}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
        hidden && !revealed
          ? "translate-y-5 opacity-0"
          : "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
