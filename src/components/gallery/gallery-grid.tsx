"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { BeforeAfterSlider } from "@/components/gallery/before-after-slider";
import {
  ArrowRightIcon,
  CloseIcon,
  CompareIcon,
} from "@/components/icons";
import { getService, type GalleryCase } from "@/config/site.config";
import { servicePath } from "@/lib/paths";

type GalleryGridProps = {
  items: GalleryCase[];
};

/**
 * Responsive before/after gallery with an accessible lightbox.
 *
 * Each card keeps its inline slider. The expand button opens a native modal
 * dialog, which provides focus trapping, Escape-to-close and focus restoration
 * for free. Arrow keys move between cases while the lightbox is open.
 */
export function GalleryGrid({ items }: GalleryGridProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const current = openIndex === null ? null : items[openIndex];
  const position = openIndex ?? 0;
  const atStart = openIndex === null || openIndex <= 0;
  const atEnd = openIndex === null || openIndex >= items.length - 1;

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [openIndex]);

  function openAt(index: number) {
    setOpenIndex(index);

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    window.requestAnimationFrame(() => closeRef.current?.focus());
  }

  function close() {
    dialogRef.current?.close();
  }

  function go(delta: number) {
    setOpenIndex((index) => {
      if (index === null) {
        return index;
      }

      return Math.min(items.length - 1, Math.max(0, index + delta));
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    // Let the slider itself handle arrow keys when it has focus.
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    event.preventDefault();
    go(event.key === "ArrowLeft" ? -1 : 1);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <ul className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const service = getService(item.serviceSlug);

          return (
            <li
              key={item.slug}
              className="flex flex-col rounded-3xl border border-ink/10 bg-white p-4 shadow-card sm:p-5"
            >
              <BeforeAfterSlider item={item} />

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                {service ? (
                  <Link
                    href={servicePath(service.slug)}
                    className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {service.title}
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={() => openAt(index)}
                  aria-haspopup="dialog"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <CompareIcon className="size-3.5 text-brand" />
                  View larger
                  <span className="sr-only">: {item.title}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="lightbox-title"
        aria-describedby="lightbox-help"
        onClose={() => setOpenIndex(null)}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] rounded-3xl border border-ink/10 bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/70"
      >
        {current ? (
          <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-eyebrow font-semibold text-brand-dark uppercase">
                  Before &amp; after
                </p>
                <h2
                  id="lightbox-title"
                  className="mt-1 font-display text-xl font-semibold text-ink"
                >
                  {current.title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close gallery viewer"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <BeforeAfterSlider item={current} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 bg-surface px-4 py-3 sm:px-6">
              <p
                id="lightbox-help"
                className="text-xs leading-relaxed text-muted"
              >
                Drag the handle to compare. Use the arrow keys to move between
                cases, or Escape to close.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={atStart}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50"
                >
                  <ArrowRightIcon className="size-3.5 rotate-180" />
                  Previous
                </button>
                <span
                  aria-live="polite"
                  className="min-w-14 text-center text-xs font-semibold text-muted"
                >
                  {position + 1} of {items.length}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  disabled={atEnd}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50"
                >
                  Next
                  <ArrowRightIcon className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
