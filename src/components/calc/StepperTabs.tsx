import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

type Step = { value: string; label: string; description?: string };

type StepperTabsProps = {
  steps: Step[];
  value: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

/**
 * Stepper tabs used in the home page and wizard shell.  This
 * component is pure presentation and has been moved into
 * `components/calc` for organisational consistency.
 */
export function StepperTabs({ steps, value, onValueChange, className }: StepperTabsProps) {
  return (
    <Tabs.Root value={value} onValueChange={onValueChange} className={cn("w-full", className)}>
      <Tabs.List className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <Tabs.Trigger
            key={step.value}
            value={step.value}
            className={cn(
              "flex flex-col items-start rounded-xl border border-neutral-200 bg-white/70 px-4 py-3 text-left text-sm font-semibold text-neutral-900 transition hover:border-brand-blue/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30",
              value === step.value && "border-brand-blue/70 bg-brand-blue/5 shadow-sm shadow-brand-blue/15"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-semibold text-brand-blue">
                {index + 1}
              </span>
              <span>{step.label}</span>
            </div>
            {step.description ? <p className="mt-1 text-xs font-normal text-muted-foreground">{step.description}</p> : null}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}