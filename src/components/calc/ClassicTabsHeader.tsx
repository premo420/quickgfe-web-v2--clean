import { cn } from "@/lib/utils";

type Step = { title: string; caption?: string };

type ClassicTabsHeaderProps = {
  steps: Step[];
  current?: number;
  className?: string;
};

/**
 * Legacy three‑tab header component.
 *
 * This component has been relocated under `components/calc` to
 * clearly communicate that it belongs to the calculator UI shell.
 * Its API and markup remain unchanged; only the import path has
 * moved.  Consumers should import it via `@/components/calc/ClassicTabsHeader`.
 */
export function ClassicTabsHeader({ steps, current = 1, className }: ClassicTabsHeaderProps) {
  return (
    <div
      className={cn(
        "grid gap-3 rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm shadow-brand-blue/10 backdrop-blur-sm md:grid-cols-3",
        className
      )}
    >
      {steps.map((step, index) => {
        const active = index + 1 === current;
        return (
          <div
            key={step.title}
            className={cn(
              "flex items-start gap-3 rounded-xl border border-transparent px-3 py-2 transition",
              active ? "border-brand-blue/30 bg-brand-blue/5 shadow-sm" : "bg-white/40"
            )}
            aria-current={active ? "step" : undefined}
          >
            <span
              className={cn(
                "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                active ? "bg-brand-blue text-white shadow" : "bg-neutral-200 text-neutral-700"
              )}
            >
              {index + 1}
            </span>
            <div className="space-y-1">
              <p className="font-display text-sm font-semibold leading-tight text-neutral-900">{step.title}</p>
              {step.caption ? <p className="text-xs text-neutral-600">{step.caption}</p> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}