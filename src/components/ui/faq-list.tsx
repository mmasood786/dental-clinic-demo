import { ChevronDownIcon } from "@/components/icons";
import type { ServiceFaq } from "@/config/site.config";
import { cn } from "@/lib/cn";

type FaqListProps = {
  items: ServiceFaq[];
  className?: string;
  /** Opens the first answer so the section never looks like a wall of questions. */
  defaultOpenFirst?: boolean;
};

/**
 * Native `<details>` accordion: keyboard operable and screen-reader friendly
 * without any JavaScript, with a visible focus ring and 44px+ tap targets.
 */
export function FaqList({
  items,
  className,
  defaultOpenFirst = true,
}: FaqListProps) {
  return (
    <div
      className={cn(
        "divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card",
        className,
      )}
    >
      {items.map((item, index) => (
        <details
          key={item.question}
          className="group px-5 sm:px-6"
          open={defaultOpenFirst && index === 0}
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-ink transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-surface text-brand-dark transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
            >
              <ChevronDownIcon className="size-4" />
            </span>
          </summary>
          <p className="pr-10 pb-5 text-sm leading-relaxed text-muted">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
