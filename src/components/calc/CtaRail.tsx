"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarCheck, ChevronDown, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type CtaRailProps = {
  phone?: string;
  bookHref?: string;
  className?: string;
};

// Frequently asked questions for the CTA rail.  Unchanged from the
// original implementation.
const faqItems = [
  { question: "Does this change my loan math?", answer: "No—calculations match the legacy QuickGFE output within a dollar." },
  { question: "Can I save a quote?", answer: "Yes, submit on step 3 to share and keep a reference ID." },
  { question: "Mobile friendly?", answer: "The wizard keeps sticky totals on desktop and collapses cleanly on small screens." }
];

/**
 * Sidebar call‑to‑action rail.  It remains client‑rendered due to
 * interactivity (FAQ accordion).  Relocated under `components/calc`.
 */
export function CtaRail({ phone = "888-555-0199", bookHref = "/contact", className }: CtaRailProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <aside
      className={cn(
        "sticky top-24 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white/90 p-5 shadow-lg shadow-brand-blue/10 backdrop-blur",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Realistic Estimates</p>
        <h3 className="font-display text-xl font-semibold text-neutral-900">Zero Pressure Support</h3>
        <p className="text-sm text-neutral-600">
          Talk to a live loan officer or book a walkthrough. We keep the classic QuickGFE look while using the new engine.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href={`tel:${phone.replace(/\D/g, "")}`}
          className="inline-flex items-center justify-between rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Call {phone}
          </span>
          <ChevronDown className="h-4 w-4 rotate-90" aria-hidden />
        </Link>
        <Link
          href={bookHref}
          className="inline-flex items-center justify-between rounded-xl border border-brand-blue/30 bg-neutral-50 px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-blue hover:shadow-sm"
        >
          <span className="inline-flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            Book a live loan officer
          </span>
          <ChevronDown className="h-4 w-4 rotate-90" aria-hidden />
        </Link>
        <Link
          href="#faq"
          className="inline-flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-blue/50"
        >
          <span className="inline-flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            FAQ dropdown
          </span>
          <ChevronDown className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="space-y-2">
        {faqItems.map((item, idx) => {
          const open = openIndex === idx;
          return (
            <div key={item.question} className="rounded-lg border border-neutral-200 bg-neutral-50/70">
              <button
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-neutral-900"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : idx)}
              >
                {item.question}
                <ChevronDown className={cn("h-4 w-4 transition", open ? "rotate-180" : "")} />
              </button>
              {open ? <p className="px-3 pb-3 text-sm text-neutral-600">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}