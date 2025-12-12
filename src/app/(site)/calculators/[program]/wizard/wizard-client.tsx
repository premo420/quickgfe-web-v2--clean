"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";

import { cn, sanitizeProgramSlug } from "@/lib/utils";
import { MoneyInput } from "@/components/money-input";
import { PercentInput } from "@/components/percent-input";
import { SectionCard } from "@/components/calc/SectionCard";
import { SelectWithSearch } from "@/components/select-with-search";
import { WizardStickyTotals } from "@/components/calc/wizard/sticky-totals";
import { WizardStepHeader } from "@/components/calc/wizard/step-header";
import { CompareRates } from "@/components/calc/CompareRates";
import { getComparableRates } from "./actions.getComparableRates";
import { PROGRAM_DEFAULTS } from "@/lib/calc/defaults";
import { QuoteInputSchema, type WizardQuoteInput } from "@/lib/calc/schemas";
import type { QuoteOutput } from "@/lib/calc/types";

// Define the sequence of steps shown in the wizard header.
const steps = [
  { value: "1", label: "Enter Scenario", description: "Price, rate, FICO, location" },
  { value: "2", label: "Refine Fees", description: "Line items, escrows, program toggles" },
  { value: "3", label: "Submit", description: "Contact + share" }
];

// Allowed loan purpose types.
const loanTypes = [
  { label: "Purchase", value: "purchase" },
  { label: "Refinance", value: "refinance" }
];

const TRANSFER_FIELD = "fees.transfer" as const;

function buildDefaults(program: "conventional" | "fha" | "va"): WizardQuoteInput {
  const defaults = PROGRAM_DEFAULTS[program];
  const purchasePrice = 350000;
  return {
    program,
    loanPurpose: "purchase",
    purchasePrice,
    downPaymentPct: defaults.defaultDownPaymentPct,
    ratePct: defaults.defaultRatePct,
    termMonths: defaults.termMonths,
    fico: 720,
    propertyTaxRatePct: defaults.propertyTaxRatePct,
    homeInsuranceRatePct: defaults.homeInsuranceRatePct,
    hoaMonthly: defaults.hoaMonthly,
    perDiemInterestDays: defaults.prepaidInterestDays,
    escrowMonths: {
      taxes: defaults.escrowMonths.taxes,
      insurance: defaults.escrowMonths.insurance,
      hoa: defaults.escrowMonths.hoa
    },
    fees: {
      lender: defaults.fees.lender,
      broker: defaults.fees.broker,
      creditReport: defaults.fees.creditReport,
      flood: defaults.fees.flood,
      appraisal: defaults.fees.appraisal,
      title: defaults.fees.title,
      escrow: defaults.fees.escrow,
      recording: defaults.fees.recording,
      transfer: Math.round((defaults.fees.transferRatePct / 100) * purchasePrice),
      transferRatePct: defaults.fees.transferRatePct
    },
    financeUpfrontFee: defaults.upfrontFee?.financed ?? false,
    vaFundingExempt: false
  };
}

export default function WizardClient({ program, variant = "default" }: { program: string; variant?: "default" | "classic" }) {
  // Use the sanitiser to derive the canonical program.  Defaults to
  // "conventional" for any unrecognised slug.
  const resolvedProgram = sanitizeProgramSlug(program) as "conventional" | "fha" | "va";
  const defaults = PROGRAM_DEFAULTS[resolvedProgram];

  const [step, setStep] = useState<"1" | "2" | "3">("1");
  const [quote, setQuote] = useState<QuoteOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contact details captured on step 3.  Remains unchanged.
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    agree: false
  });
  const [submitResult, setSubmitResult] = useState<{ ref?: string; error?: string }>({});

  const defaultValues = useMemo(() => buildDefaults(resolvedProgram), [resolvedProgram]);
  const form = useForm<WizardQuoteInput>({
    resolver: zodResolver(QuoteInputSchema),
    mode: "onChange",
    defaultValues
  });

  // Reset form when program changes.
  useEffect(() => {
    form.reset(defaultValues);
    setQuote(null);
  }, [defaultValues, form]);

  const watchedValues = useWatch({ control: form.control });

  // Keep transfer tax in sync with purchase price when the field is untouched.
  useEffect(() => {
    const price = watchedValues?.purchasePrice ?? defaultValues.purchasePrice;
    const state = form.getFieldState(TRANSFER_FIELD);
    const transferRate = defaultValues.fees?.transferRatePct ?? defaults.fees.transferRatePct;
    if (!state.isDirty && price) {
      form.setValue(TRANSFER_FIELD, Math.round((transferRate / 100) * price), { shouldDirty: false });
    }
  }, [watchedValues?.purchasePrice, defaultValues.purchasePrice, defaultValues.fees?.transferRatePct, defaults.fees.transferRatePct, form]);

  // Fetch new quote whenever inputs change.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const timer = setTimeout(async () => {
      try {
        const payload = QuoteInputSchema.parse({ ...watchedValues, program: resolvedProgram });
        const res = await fetch("/api/quote", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
          signal: controller.signal
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.message ?? "Quote failed");
        }
        setQuote(data.quote ?? data);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message ?? "Unable to update quote");
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [resolvedProgram, watchedValues]);

  // When the user updates the per‑diem or price, ensure transfer resets.  The
  // effect above already resets transfer based on price when untouched.

  const handleContactChange = (key: keyof typeof contact, value: string | boolean) => {
    setContact((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetDefaults = () => {
    form.reset(buildDefaults(resolvedProgram));
    setQuote(null);
    setStep("1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult({});
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: quote?.program.key ?? resolvedProgram,
          contact
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setSubmitResult({ ref: data.referenceId });
      setStep("3");
    } catch (err: any) {
      setSubmitResult({ error: err?.message ?? "Submission failed" });
    }
  };

  const ltvPct = useMemo(() => {
    const dp = watchedValues?.downPaymentPct ?? defaults.defaultDownPaymentPct;
    return Math.max(0, 100 - dp);
  }, [watchedValues?.downPaymentPct, defaults.defaultDownPaymentPct]);

  const stepIndex = Number(step);
  const progress = Math.min(100, (stepIndex / 3) * 100);
  const scenarioSummary = {
    purchasePrice: watchedValues?.purchasePrice ?? defaultValues.purchasePrice,
    downPaymentPct: watchedValues?.downPaymentPct ?? defaultValues.downPaymentPct,
    fico: watchedValues?.fico ?? defaultValues.fico,
    termMonths: watchedValues?.termMonths ?? defaultValues.termMonths
  };

  // Container styling for classic vs modern variants.
  const containerClasses = cn(
    "flex w-full flex-col gap-6 px-4 py-8 md:px-6",
    variant === "default"
      ? "mx-auto max-w-[var(--page-max-width)]"
      : "rounded-2xl border border-neutral-200 bg-white/85 shadow-card-soft"
  );

  return (
    <div className={containerClasses} id="wizard">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Calculator Wizard</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {defaults.label} — 3-step calculator
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your scenario, refine fees, and submit. Live totals update automatically and stay within a dollar of
          legacy outputs.
        </p>
      </div>

      <WizardStepHeader steps={steps} current={step} />
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-700" style={{ width: `${progress}%` }} />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <SectionCard title="Step 1 — Enter Scenario" description="Purchase/refi, price, down %, FICO, location">
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="loanPurpose"
                control={form.control}
                render={({ field }) => (
                  <SelectWithSearch
                    label="Loan type"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={loanTypes}
                  />
                )}
              />
              <Controller
                name="purchasePrice"
                control={form.control}
                render={({ field }) => (
                  <MoneyInput
                    label="Purchase price"
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value || 0))}
                  />
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="downPaymentPct"
                  control={form.control}
                  render={({ field }) => (
                    <PercentInput
                      label="Down payment %"
                      value={field.value ?? defaults.defaultDownPaymentPct}
                      onChange={(e) => field.onChange(Number(e.target.value || 0))}
                      helperText="Controls LTV"
                    />
                  )}
                />
                <PercentInput label="LTV" value={ltvPct} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="ratePct"
                  control={form.control}
                  render={({ field }) => (
                    <PercentInput
                      label="Rate"
                      value={field.value ?? defaults.defaultRatePct}
                      onChange={(e) => field.onChange(Number(e.target.value || 0))}
                    />
                  )}
                />
                <Controller
                  name="termMonths"
                  control={form.control}
                  render={({ field }) => (
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">Term (months)</span>
                      <input
                        type="number"
                        className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                        value={field.value ?? defaults.termMonths}
                        onChange={(e) => field.onChange(Number(e.target.value || 0))}
                      />
                    </label>
                  )}
                />
              </div>
              <Controller
                name="fico"
                control={form.control}
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">Approximate FICO</span>
                    <input
                      type="number"
                      className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                      value={field.value ?? 720}
                      onChange={(e) => field.onChange(Number(e.target.value || 0))}
                    />
                  </label>
                )}
              />
              <Controller
                name="zip"
                control={form.control}
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">ZIP Code</span>
                    <input
                      className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="e.g. 98052"
                    />
                  </label>
                )}
              />
              <Controller
                name="county"
                control={form.control}
                render={({ field }) => (
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">County</span>
                    <input
                      className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Optional"
                    />
                  </label>
                )}
              />
              <Controller
                name="hoaMonthly"
                control={form.control}
                render={({ field }) => (
                  <MoneyInput
                    label="HOA (monthly)"
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value || 0))}
                  />
                )}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
                onClick={() => setStep("2")}
              >
                Continue to fees
              </button>
              <span className="text-xs text-muted-foreground">Auto-updates every change</span>
            </div>
          </SectionCard>

          <SectionCard
            title="Step 2 — Refine Fees"
            description="Line-by-line lender, title, recording, transfer, and escrows."
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to program defaults
                </button>
                <span className="text-xs text-muted-foreground">
                  Pulls lender/title/escrow/recording/transfer and escrow months from ProgramConfig
                </span>
              </div>
              <FeeGrid
                title="Items Payable in Connection with Loan"
                rows={[
                  { name: "fees.lender", label: "Origination / lender fees", helperText: "Legacy line 801" },
                  { name: "fees.broker", label: "Broker / processing", helperText: "Legacy line 810" },
                  { name: "fees.creditReport", label: "Credit report", helperText: "Legacy line 814" },
                  { name: "fees.flood", label: "Flood certification", helperText: "Legacy line 819" },
                  { name: "fees.appraisal", label: "Appraisal", helperText: "Legacy line 803" }
                ]}
                control={form.control}
              />
              <FeeGrid
                title="Title & Escrow Charges"
                rows={[
                  { name: "fees.title", label: "Title insurance", helperText: "Owner/lender policies" },
                  { name: "fees.escrow", label: "Escrow / settlement", helperText: "Settlement/closing fee" },
                  { name: "fees.recording", label: "Recording", helperText: "Deed + mortgage recording" },
                  { name: "fees.transfer", label: "Transfer / state tax", helperText: "Auto ties to purchase price" }
                ]}
                control={form.control}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="perDiemInterestDays"
                  control={form.control}
                  render={({ field }) => (
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">Per-diem interest (days)</span>
                      <input
                        type="number"
                        className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                        value={field.value ?? defaults.prepaidInterestDays}
                        onChange={(e) => field.onChange(Number(e.target.value || 0))}
                      />
                    </label>
                  )}
                />
                <Controller
                  name="homeInsuranceRatePct"
                  control={form.control}
                  render={({ field }) => (
                    <PercentInput
                      label="HOI rate (% of price annual)"
                      value={field.value ?? defaults.homeInsuranceRatePct}
                      onChange={(e) => field.onChange(Number(e.target.value || 0))}
                    />
                  )}
                />
                <Controller
                  name="propertyTaxRatePct"
                  control={form.control}
                  render={({ field }) => (
                    <PercentInput
                      label="Property tax rate (% of price annual)"
                      value={field.value ?? defaults.propertyTaxRatePct}
                      onChange={(e) => field.onChange(Number(e.target.value || 0))}
                    />
                  )}
                />
                <Controller
                  name="escrowMonths.insurance"
                  control={form.control}
                  render={({ field }) => (
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">HOI reserves (months)</span>
                      <input
                        type="number"
                        className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                        value={field.value ?? defaults.escrowMonths.insurance}
                        onChange={(e) => field.onChange(Number(e.target.value || 0))}
                      />
                    </label>
                  )}
                />
                <Controller
                  name="escrowMonths.taxes"
                  control={form.control}
                  render={({ field }) => (
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">Tax reserves (months)</span>
                      <input
                        type="number"
                        className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                        value={field.value ?? defaults.escrowMonths.taxes}
                        onChange={(e) => field.onChange(Number(e.target.value || 0))}
                      />
                    </label>
                  )}
                />
                <Controller
                  name="escrowMonths.hoa"
                  control={form.control}
                  render={({ field }) => (
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">HOA reserves (months)</span>
                      <input
                        type="number"
                        className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                        value={field.value ?? defaults.escrowMonths.hoa}
                        onChange={(e) => field.onChange(Number(e.target.value || 0))}
                      />
                    </label>
                  )}
                />
              </div>

              {resolvedProgram === "fha" ? (
                <label className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 p-3 text-sm">
                  <Controller
                    name="financeUpfrontFee"
                    control={form.control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span>Finance FHA UFMIP into loan amount</span>
                </label>
              ) : null}

              {resolvedProgram === "va" ? (
                <div className="grid gap-2 rounded-lg border border-border/70 bg-muted/40 p-3 text-sm md:grid-cols-2">
                  <label className="flex items-center gap-2">
                    <Controller
                      name="financeUpfrontFee"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-input"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                    <span>Finance VA funding fee</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Controller
                      name="vaFundingExempt"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-input"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                    <span>Funding fee exemption</span>
                  </label>
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
                  onClick={() => setStep("3")}
                >
                  Next: Submit
                </button>
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-xs text-primary">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Updating totals…
                  </span>
                ) : null}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Step 3 — Submit" description="Collect contact info and share the quote">
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">First name</span>
                <input
                  className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                  value={contact.firstName}
                  onChange={(e) => handleContactChange("firstName", e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Last name</span>
                <input
                  className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                  value={contact.lastName}
                  onChange={(e) => handleContactChange("lastName", e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Email</span>
                <input
                  type="email"
                  className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                  value={contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Phone</span>
                <input
                  className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                  value={contact.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Property Address</span>
                <input
                  className="rounded-xl border border-input bg-white/70 px-3 py-2.5"
                  value={contact.address}
                  onChange={(e) => handleContactChange("address", e.target.value)}
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Notes</span>
                <textarea
                  className="min-h-[80px] rounded-xl border border-input bg-white/70 px-3 py-2.5"
                  value={contact.notes}
                  onChange={(e) => handleContactChange("notes", e.target.value)}
                />
              </label>
              <label className="md:col-span-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={contact.agree}
                  onChange={(e) => handleContactChange("agree", e.target.checked)}
                  required
                />
                <span>I agree to the terms and privacy notice.</span>
              </label>
              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit
                </button>
                {submitResult.ref ? (
                  <span className="inline-flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Thank you! Reference {submitResult.ref}
                  </span>
                ) : null}
                {submitResult.error ? <span className="text-sm text-red-600">{submitResult.error}</span> : null}
              </div>
            </form>
          </SectionCard>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <WizardStickyTotals quote={quote} loading={loading} />
          {/* CompareRates appears only on the results page when a quote exists (step 3) */}
          {step === "3" && quote ? <CompareRates /> : null}
        </div>
      </div>
    </div>
  );
}

type FeeRow = {
  name: keyof WizardQuoteInput | `${keyof WizardQuoteInput & string}.${string}`;
  label: string;
  helperText?: string;
};

function FeeGrid({ title, rows, control }: { title: string; rows: FeeRow[]; control: any }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <Controller
            key={row.name}
            name={row.name as any}
            control={control}
            render={({ field }) => (
              <MoneyInput
                label={row.label}
                helperText={row.helperText}
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value || 0))}
              />
            )}
          />
        ))}
      </div>
    </div>
  );
}