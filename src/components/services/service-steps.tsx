import type { ServiceStep } from "@/config/site.config";

/**
 * The treatment in order: numbered steps on a soft rail, with the last step
 * visually closed off so it reads as a sequence rather than a list.
 */
export function ServiceSteps({ steps }: { steps: ServiceStep[] }) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <ol className="relative mt-6 space-y-6">
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-[1.375rem] w-px bg-ink/10"
      />
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-5">
          <span
            aria-hidden="true"
            className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-brand/20 bg-white font-display text-sm font-semibold text-brand-dark shadow-sm"
          >
            {index + 1}
          </span>
          <div className="pt-1.5">
            <h3 className="font-display text-lg font-semibold text-ink">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
