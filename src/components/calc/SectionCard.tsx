import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: string;
  description?: ReactNode;
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

/**
 * A lightweight card component used to group related calculator
 * content.  Relocated to `components/calc` as part of the file
 * normalisation.  Exports the same API as the original implementation.
 */
export function SectionCard({ title, description, children, className, ...props }: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white/85 p-5 shadow-sm shadow-brand-blue/10 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4 space-y-1">
          {title ? <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      )}
      {children}
    </div>
  );
}