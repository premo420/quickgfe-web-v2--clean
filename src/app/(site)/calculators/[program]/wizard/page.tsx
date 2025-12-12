import type { Metadata } from "next";
import { ClassicTabsHeader } from "@/components/calc/ClassicTabsHeader";
import { CtaRail } from "@/components/calc/CtaRail";
import { HeroClassic } from "@/components/hero/HeroClassic";
import WizardClient from "./wizard-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "QuickGFE Calculator | Classic Wizard",
  description: "Classic QuickGFE shell with the new calculator wizard and sticky live totals."
};

export default function WizardPage({
  params,
  searchParams
}: {
  params: { program: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const classic = searchParams?.classic === "1" || searchParams?.classic === "true";
  // If the classic flag is not set, render the wizard without the classic shell.
  if (!classic) {
    return <WizardClient program={params.program} />;
  }
  return (
    <div className="bg-neutral-50">
      <div className="mx-auto flex w-full max-w-[var(--page-max-width)] flex-col gap-6 px-6 py-8">
        {/* Hero banner for the classic wizard start page */}
        <HeroClassic />

        {/* CTA rail placed underneath the hero */}
        <div className="w-full">
          <CtaRail className="mx-auto mt-4 max-w-[980px]" />
        </div>

        <ClassicTabsHeader
          steps={[
            { title: "Enter Your Amount", caption: "Purchase details & program" },
            { title: "QuickGFE", caption: "Line-by-line fees with live totals" },
            { title: "Submit", caption: "Share & capture contact" }
          ]}
          current={1}
        />
      </div>
      <div className="mx-auto grid w-full max-w-[var(--page-max-width)] gap-6 px-6 pb-10 xl:grid-cols-[minmax(0,1fr)_320px]">
        <WizardClient program={params.program} variant="classic" />
        <CtaRail />
      </div>
    </div>
  );
}