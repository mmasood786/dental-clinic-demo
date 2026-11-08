"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { CompareIcon } from "@/components/icons";
import type { GalleryCase } from "@/config/site.config";

type BeforeAfterSliderProps = {
  item: GalleryCase;
};

export function BeforeAfterSlider({ item }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  // SVGs are vector placeholders and cannot be resized by the image optimizer,
  // so they are served as-is. Raster photos dropped into the config still get
  // Next.js optimisation.
  const svg = (src: string) => /\.svg(?:\?|$)/i.test(src);

  function updateFromPointer(clientX: number, element: HTMLInputElement) {
    const rect = element.getBoundingClientRect();

    if (rect.width === 0) {
      return;
    }

    const percent = Math.round(((clientX - rect.left) / rect.width) * 100);
    setPosition(Math.min(100, Math.max(0, percent)));
  }

  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10 bg-surface focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2">
        <Image
          src={item.after.src}
          alt={item.after.alt}
          fill
          sizes="(min-width: 1280px) 720px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
          loading="lazy"
          unoptimized={svg(item.after.src)}
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={item.before.src}
            alt={item.before.alt}
            fill
            sizes="(min-width: 1280px) 720px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            loading="lazy"
            unoptimized={svg(item.before.src)}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(15,31,34,0.35)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-white text-brand-dark shadow-lg">
            <CompareIcon className="size-5" />
          </span>
        </div>

        <span
          aria-hidden="true"
          className="absolute bottom-3 left-3 z-10 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-white"
        >
          Before
        </span>
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 z-10 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white"
        >
          After
        </span>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromPointer(event.clientX, event.currentTarget);
          }}
          onPointerMove={(event) => {
            if (!dragging.current) {
              return;
            }
            updateFromPointer(event.clientX, event.currentTarget);
          }}
          onPointerUp={(event) => {
            dragging.current = false;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          aria-label={`Before and after comparison: ${item.title}`}
          aria-valuetext={`${position}% before image, ${100 - position}% after image`}
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize touch-pan-y appearance-none bg-transparent opacity-0"
        />
      </div>
      <figcaption className="mt-3 text-sm">
        <span className="font-semibold text-ink">{item.title}.</span>{" "}
        <span className="text-muted">{item.caption}</span>
      </figcaption>
    </figure>
  );
}
