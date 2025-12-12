import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, ShieldCheck } from "lucide-react";

import { AppBadgesRow } from "@/components/app-badges-row";
import { ClassicTabsHeader } from "@/components/calc/ClassicTabsHeader";
import { CtaRail } from "@/components/calc/CtaRail";
import { EmailCapture } from "@/components/email-capture";
import { FaqAccordion } from "@/components/faq-accordion";
import { HeroClassic } from "@/components/hero/HeroClassic";
import { Hero } from "@/components/hero/Hero";
import { SectionCard } from "@/components/calc/SectionCard";
import { StepperTabs } from "@/components/calc/StepperTabs";

export const metadata: Metadata = {
  title: "QuickGFE | Preview Your Down Payment & Closing Cost",
  description: "Classic QuickGFE skin with the new calculator engine. Three-step wizard, live totals, and compliance-ready footer."
};

const steps = [
  { value: "1", label: "Enter Scenario", description: "Price, rate, program basics." },
  { value: "2", label: "QuickGFE", description: "Line-by-line fees with live totals." },
  { value: "3", label: "Submit", description: "Share, save, and collect contact." }
];

const faqItems = [
  { question: "Is the classic math preserved?", answer: "Yes. The new shell keeps the modern engine but matches legacy outputs within a dollar." },
  { question: "What programs are included?", answer: "Conventional, FHA, and VA with defaults for escrows, UFMIP, funding fees, and LLPAs." },
  { question: "Can I embed the calculator?", answer: "Yes. Use the wizard links with the classic flag to wrap the experience in this layout." }
];

// Program cards used on the home page.  Hrefs reference simplified program
// slugs and preserve the classic flag for backwards compatibility.
const programs = [
  {
    name: "Conventional",
    desc: "Precise MI tables with adjustable LLPAs and custom escrows.",
    href: "/calculators/conventional?classic=1"
  },
  {
    name: "FHA",
    desc: "Automatic UFMIP financing with county tax/HOI defaults.",
    href: "/calculators/fha?classic=1"
  },
  {
    name: "VA",
    desc: "Funding fee finance rules with zero‑down & tiered exemptions.",
    href: "/calculators/va?classic=1"
  }
];

export default function HomePage() {
  // Flag to toggle between the modern hero and the classic hero; driven by environment.
  const showClassicHero = process.env.NEXT_PUBLIC_CLASSIC_HERO === "1";
  return (
    <div className="bg-neutral-50">
      <div className="mx-auto flex w-full max-w-[var(--page-max-width)] flex-col gap-6 px-6 py-10">
        {showClassicHero ? <HeroClassic /> : <Hero />}

        {/* CTA rail placed underneath the hero for both desktop and mobile */}
        <div className="w-full">
          <CtaRail className="mx-auto mt-4 max-w-[980px]" />
        </div>

        <ClassicTabsHeader
          steps={[
            { title: "Enter Your Amount", caption: "Purchase price, down %, and program" },
            { title: "QuickGFE", caption: "Line-by-line fees with live totals" },
            { title: "Submit", caption: "Contact capture & share" }
          ]}
          current={1}
        />
      </div>

      <div className="mx-auto grid w-full max-w-[var(--page-max-width)] gap-6 px-6 pb-12 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <SectionCard
            title="Launch the wizard"
            description="Conventional, FHA, and VA calculators with sticky totals and modern form controls."
          >
            <div className="space-y-4">
              <StepperTabs steps={steps} value="1" />
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/calculators/fha?classic=1"
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card-soft transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Start new wizard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/calculators/conventional?classic=1"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:border-brand-600 hover:text-brand-600"
                >
                  Try Conventional
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-ink-700">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-600/10 px-3 py-1 text-brand-700">
                  <ShieldCheck className="h-4 w-4" />
                  Compliance friendly
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-600/10 px-3 py-1 text-brand-700">
                  <Calculator className="h-4 w-4" />
                  Live totals stay visible
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Programs" description="Pick a program to open the wizard in the classic shell.">
            <div className="grid gap-4 md:grid-cols-3">
              {programs.map((item) => (
                <div key={item.name} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-semibold text-ink-900">{item.name}</p>
                    <span className="rounded-full bg-brand-600/10 px-3 py-1 text-xs font-semibold text-brand-700">Live</span>
                  </div>
                  <p className="text-sm text-ink-700">{item.desc}</p>
                  <Link
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white shadow-card-soft transition hover:-translate-y-0.5 hover:shadow-lg"
                    href={item.href}
                  >
                    Open calculator <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="FAQ" description="Questions borrowers ask the most." id="faq">
            <FaqAccordion items={faqItems} />
          </SectionCard>

          <EmailCapture />
          <AppBadgesRow />
        </div>

        <CtaRail />
      </div>
    </div>
  );
}