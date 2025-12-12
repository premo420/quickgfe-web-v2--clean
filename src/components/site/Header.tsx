import Link from "next/link";
import { Calculator, PhoneCall } from "lucide-react";

/**
 * Site header shared across all pages.
 *
 * This component is a direct refactor of the previous `BrandHeader`
 * component.  It lives under `components/site` to clearly separate
 * layout primitives from feature logic.  The navigation links and
 * call‑to‑action now reference simplified program slugs (e.g.
 * `conventional`, `fha`, `va`) instead of the verbose `*-30-fixed`
 * variants.  Removing the legacy slugs prevents broken routes and
 * aligns with the program sanitisation implemented in `utils.ts`.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-[var(--page-max-width)] items-center justify-between px-4 py-3 md:px-6">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600/10 text-sm font-bold uppercase text-brand-700 shadow-sm">
            QG
          </span>
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold text-ink-900">QuickGFE</span>
            <span className="text-xs text-ink-700">Preview down payment & closing costs</span>
          </div>
        </Link>

        {/* Primary navigation */}
        <nav className="hidden items-center gap-4 text-sm font-semibold text-ink-700 md:flex">
          <Link href="/calculators/fha?classic=1" className="rounded-lg px-3 py-2 transition hover:bg-slate-100">
            Calculators
          </Link>
          <Link href="/features" className="rounded-lg px-3 py-2 transition hover:bg-slate-100">
            Features
          </Link>
          <Link href="/contact" className="rounded-lg px-3 py-2 transition hover:bg-slate-100">
            Contact
          </Link>
        </nav>

        {/* Call to action */}
        <Link
          href="/calculators/fha?classic=1"
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-card-soft transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Calculator className="h-4 w-4" />
          Start now
        </Link>
      </div>

      {/* Secondary bar mirroring the legacy look */}
      <div className="border-t border-slate-200/80 bg-slate-50/80 px-4 py-2 text-xs text-ink-700 md:px-6">
        <div className="mx-auto flex max-w-[var(--page-max-width)] flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand-700 shadow-sm">
            Classic UI parity
          </span>
          <span className="inline-flex items-center gap-2 text-[12px] text-ink-600">
            <PhoneCall className="h-3.5 w-3.5" />
            Ready to share with borrowers
          </span>
        </div>
      </div>
    </header>
  );
}