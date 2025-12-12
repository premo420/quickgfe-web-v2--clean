import React from "react";

type LenderRow = {
  name: string;
  apr: string;
  monthly: string;
  fees: string;
};

const SAMPLE_LENDERS: LenderRow[] = [
  { name: "Acme Bank", apr: "6.12%", monthly: "$2,140", fees: "$1,200 / 0.25 pts" },
  { name: "BlueLend", apr: "6.25%", monthly: "$2,165", fees: "$900 / 0.15 pts" },
  { name: "HomeFirst", apr: "6.45%", monthly: "$2,200", fees: "$1,500 / 0.50 pts" },
  { name: "LendRight", apr: "6.75%", monthly: "$2,260", fees: "$995 / 0 pts" }
];

export function CompareRates({ className }: { className?: string }) {
  return (
    <section className={"rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm " + (className ?? "") }>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Compare Rates</h3>
        <p className="text-sm text-muted-foreground">Sample lenders — placeholder data</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-semibold text-muted-foreground">
            <tr>
              <th className="px-3 py-2 w-1/3">Lender</th>
              <th className="px-3 py-2 w-1/6">APR</th>
              <th className="px-3 py-2 w-1/6">Monthly</th>
              <th className="px-3 py-2 w-1/6">Fees & Points</th>
              <th className="px-3 py-2 w-1/6">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_LENDERS.map((row, idx) => (
              <tr key={row.name} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                <td className="px-3 py-3 align-top">
                  <div className="font-medium">{row.name}</div>
                </td>
                <td className="px-3 py-3 align-top">{row.apr}</td>
                <td className="px-3 py-3 align-top">{row.monthly}</td>
                <td className="px-3 py-3 align-top">{row.fees}</td>
                <td className="px-3 py-3 align-top">
                  <button className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-semibold text-white transition hover:opacity-95">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CompareRates;
