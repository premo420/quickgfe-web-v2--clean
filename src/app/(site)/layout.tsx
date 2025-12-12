import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { BrandFooter } from "@/components/site/BrandFooter";

/**
 * Site‑wide layout wrapper.
 *
 * Previous versions of this file defined the header and footer
 * directly within the layout.  Those elements have been extracted
 * into reusable components under `components/site`.  This layout now
 * simply composes the header, a main content area, and the footer.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-ink-900">
      <Header />
      <main className="flex-1">{children}</main>
      <BrandFooter />
    </div>
  );
}