import { cn } from "@/lib/cn";

type MapEmbedProps = {
  src: string;
  title: string;
  className?: string;
};

export function MapEmbed({ src, title, className }: MapEmbedProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-ink/10 bg-surface",
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-72 w-full border-0 sm:h-80"
      />
    </div>
  );
}
