import type { ReactNode } from "react";
import { QuoteOutput } from "@/lib/calc/types";
import { cn } from "@/lib/utils";

type WizardStickyTotalsProps = {
  quote?: QuoteOutput | null;
  loading?: boolean;
  className?: string;
};

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return "—";
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

/**
 * Sticky totals panel shown alongside the wizard.
 *
 * This component has been moved into the `calc/wizard` folder to
 * group all wizard‑specific UI under a common namespace.  The
 * behaviour and markup remain unchanged from the original
 * implementation.
 */
export function WizardStickyTotals({ quote, loading, className }: WizardStickyTotalsProps) {
  return (
    <div
      className={cn(
        "sticky top-24 space-y-4 rounded-2xl border border-border/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">Live Totals</p>
        {loading ? <span className="text-xs text-primary">Updating…</span> : null}
      </div>

      <Section title="Loan basics">
        <Row label="Base Loan" value={formatCurrency(quote?.loan.baseLoan)} />
        <Row
          label="Financed UFMIP / VA fee"
          value={formatCurrency(quote?.loan.financedUpfrontFee)}
          muted={quote?.loan.financedUpfrontFee === 0}
        />
        <Row label="New Loan Amount" value={formatCurrency(quote?.loan.totalLoan)} highlight />
      </Section>

      <Section title="Items Payable in Connection with Loan">
        {quote?.closing.itemsPayable.map((item) => (
          <Row key={item.code} label={item.label} value={formatCurrency(item.amount)} />
        )) ?? <Placeholder loading={loading} />}
      </Section>

      <Section title="Title & Escrow Charges">
        {quote?.closing.titleAndEscrow.map((item) => (
          <Row key={item.code} label={item.label} value={formatCurrency(item.amount)} />
        )) ?? <Placeholder loading={loading} />}
      </Section>

      <Section title="Estimated Prepaids">
        {quote?.closing.prepaids.map((item) => (
          <Row key={item.code} label={item.label} value={formatCurrency(item.amount)} />
        )) ?? <Placeholder loading={loading} />}
      </Section>

      <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
        <Row
          label="Total Estimated Closing Costs"
          value={formatCurrency(quote?.closing.totalEstimatedClosingCosts)}
        />
        <Row
          label="Total Estimated Prepaids"
          value={formatCurrency(
            quote?.closing.totalEstimatedPrepaids ?? quote?.closing.prepaids.reduce((s, p) => s + p.amount, 0)
          )}
        />
        <Row label="Cash to Close" value={formatCurrency(quote?.cashToClose)} highlight />
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Monthly Payment</p>
        {quote ? (
          <div className="space-y-2 text-sm">
            <Row label="Principal & Interest" value={formatCurrency(quote.monthly.principalAndInterest)} />
            <Row label="Hazard Insurance" value={formatCurrency(quote.monthly.homeownersInsurance)} />
            <Row label="Real Estate Taxes" value={formatCurrency(quote.monthly.propertyTax)} />
            <Row label="MI / MIP" value={formatCurrency(quote.monthly.mortgageInsurance)} />
            <Row label="HOA" value={formatCurrency(quote.monthly.hoa)} />
            <Row label="Total Monthly Payment" value={formatCurrency(quote.monthly.totalMonthlyPayment)} highlight />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Enter your scenario to view live totals.</p>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-white/70 p-3">
      <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value, highlight, muted }: { label: string; value: string; highlight?: boolean; muted?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        highlight ? "font-semibold text-foreground" : "",
        muted ? "text-muted-foreground" : ""
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Placeholder({ loading }: { loading?: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }, (_, i) => i).map((i) => (
          <div key={i} className="h-3 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    );
  }
  return <p className="text-xs text-muted-foreground">Awaiting scenario details.</p>;
}