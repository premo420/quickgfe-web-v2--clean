import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionCard } from "@/components/calc/SectionCard";

export const metadata: Metadata = {
  title: "QuickGFE Features | Classic Layout with Modern Engine",
  description:
    "Conventional, FHA, and VA calculators with classic branding. Live totals, escrow defaults, and compliance notes for every quote."
};

// Program listing for the features page.  Hrefs have been normalised to
// simplified program slugs and continue to include the classic flag.
const programs = [
  {
    name: "Conventional",
    copy: "MI tables with adjustable LLPAs, county tax defaults, and custom escrows.",
    href: "/calculators/conventional?classic=1"
  },
  {
    name: "FHA",
    copy: "Automatic UFMIP finance logic with HOI and tax defaults per county.",
    href: "/calculators/fha?classic=1"
  },
  {
    name: "VA",
    copy: "Funding fee finance rules with exemption toggles and zero‑down options.",
    href: "/calculators/va?classic=1"
  }
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Features</p>
        <h1 className="font-display text-3xl font-semibold text-neutral-900">Classic shell, modern wizard</h1>
        <p className="max-w-3xl text-sm text-neutral-600">
          The brand parity skin keeps QuickGFE familiar while the new calculator engine powers live totals, escrow math,
          and program defaults.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {programs.map((program) => (
          <SectionCard key={program.name} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-neutral-900">{program.name}</p>
              <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">Ready</span>
            </div>
            <p className="text-sm text-neutral-600">{program.copy}</p>
            <Link
              href={program.href}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition hover:translate-x-0.5"
            >
              Open calculator <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title="Compliance note"
        description="Footer mirrors your current NMLS disclosure. Set PUBLIC_NMLS_FOOTER to override the default State Capital Mortgage text."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
          <li>Equal Housing Lender icon stays pinned in the footer.</li>
          <li>Sticky totals keep payment clarity visible on desktop.</li>
          <li>Mobile layout collapses CTA rail under the wizard for readability.</li>
        </ul>
      </SectionCard>
    </div>
  );
}