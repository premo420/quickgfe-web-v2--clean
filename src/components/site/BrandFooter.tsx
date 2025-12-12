/**
 * Site footer shared across all pages.
 *
 * This component mirrors the original `BrandFooter` while
 * relocating it to `components/site` for consistency.  The
 * disclosure text is driven by environment variables to allow
 * deployment‑specific overrides (e.g. NMLS disclosures).  See
 * `README.md` for details on configuring these variables.
 */
const FALLBACK_NMLS = "State Capital Mortgage • NMLS #2233984 • QuickGFE";

export function BrandFooter() {
  const footerText =
    process.env.NEXT_PUBLIC_PUBLIC_NMLS_FOOTER ??
    process.env.NEXT_PUBLIC_NMLS_FOOTER ??
    process.env.PUBLIC_NMLS_FOOTER ??
    FALLBACK_NMLS;
  return (
    <footer className="border-t border-slate-200 bg-slate-50/70 px-4 py-6 text-sm text-ink-700 md:px-6">
      <div className="mx-auto flex w-full max-w-[var(--page-max-width)] flex-col gap-2">
        <p className="text-ink-800">{footerText}</p>
        <p className="text-xs text-ink-600">
          Estimates are for illustration only. Confirm program details with compliance and your lending institution.
        </p>
      </div>
    </footer>
  );
}