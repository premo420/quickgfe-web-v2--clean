import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { BrandFooter } from "@/components/site/BrandFooter";

/**
 * Layout wrapper for all calculator pages.
 *
 * The previous implementation imported `BrandHeader` and `BrandFooter` from
 * the root `components` directory.  As part of the structural
 * normalisation, the header and footer have moved under
 * `components/site`.  This wrapper wires those components into the
 * calculators section and preserves the surrounding backdrop.
 */
export default function CalculatorsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
      <BrandFooter />
    </div>
  );
}