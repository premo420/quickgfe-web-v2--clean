import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type HeroClassicProps = {
  className?: string;
};

/**
 * Classic hero banner.
 *
 * This component has been moved to `components/hero` to separate
 * marketing features from other UI primitives.  It preserves the
 * original look and feel while updating internal links to use the
 * simplified program slugs (e.g. `fha` instead of `fha-30-fixed`).
 */
export function HeroClassic({ className }: HeroClassicProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-brand-700/80 via-brand-800/80 to-slate-900 shadow-lg",
        className
      )}
    >
      <div className="absolute inset-0 opacity-60" />
      <div className="relative grid gap-6 px-6 py-10 md:grid-cols-[1fr_420px] md:px-10 md:py-12">
        <div className="space-y-5 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
            Classic QuickGFE skin
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            Preview Your Down Payment &amp; Closing Cost
          </h1>
          <p className="max-w-2xl text-base md:text-lg">
            Keep the classic layout while the new engine powers MI, MIP, and VA funding fee math. Refine line items and
            share a dense, borrower‑ready estimate.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              "Line-by-line fees",
              "Sticky live totals",
              "Program defaults"
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"
              >
                <CheckCircle2 className="h-4 w-4 text-white/80" />
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/calculators/fha?classic=1"
              className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-5 py-3 text-sm font-semibold text-brand-800 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Start new wizard
            </Link>
          </div>
        </div>

        <div className="relative flex shrink-0 flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="h-36 w-full overflow-hidden rounded-xl bg-slate-800">
            <img src="/hero-placeholder.png" alt="Hero placeholder" className="h-full w-full object-cover" />
          </div>

          <div className="space-y-2 rounded-xl border border-white/10 bg-white/6 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Loan scenario</p>
            <div className="text-sm text-white/90">
              <div className="flex items-center justify-between">
                <span>Purchase</span>
                <span className="font-semibold">$350,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Down</span>
                <span className="font-semibold">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rate</span>
                <span className="font-semibold">6.25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}