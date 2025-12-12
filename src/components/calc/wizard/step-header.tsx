import Link from "next/link";
import { StepperTabs } from "@/components/calc/StepperTabs";
import { cn } from "@/lib/utils";

type Step = { value: string; label: string; description?: string };

type WizardStepHeaderProps = {
  steps: Step[];
  current: string;
  className?: string;
};

/**
 * Wizard step header.
 *
 * Displays a set of tabs to indicate the current step and a row of
 * links to switch between loan programs.  Moved under
 * `components/calc/wizard` as part of the structural normalisation.
 */
export function WizardStepHeader({ steps, current, className }: WizardStepHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <StepperTabs steps={steps} value={current} />
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {[
          { label: "Conventional", href: "/calculators/conventional/wizard" },
          { label: "FHA", href: "/calculators/fha/wizard" },
          { label: "VA", href: "/calculators/va/wizard" }
        ].map((program) => (
          <Link
            key={program.label}
            className={cn(
              "rounded-full border border-border px-3 py-1 font-medium transition hover:border-primary hover:text-primary"
            )}
            href={program.href}
          >
            {program.label}
          </Link>
        ))}
      </div>
    </div>
  );
}