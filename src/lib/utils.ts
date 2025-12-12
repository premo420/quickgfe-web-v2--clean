import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for composing class names with tailwind-merge.
 *
 * This helper is used throughout the components to conditionally
 * apply classes without duplicating conflicting Tailwind styles.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize calculator program slugs.
 *
 * The calculators previously relied on verbose slugs such as
 * `conventional-30-fixed`.  For the purposes of routing and fetching
 * defaults, only the program name (e.g. `conventional`, `fha`, `va`)
 * matters.  This helper accepts arbitrary slugs and returns the
 * canonical program name if recognised.  Unknown values default to
 * `conventional` to ensure the calculators always render.
 *
 * Examples:
 *
 * ```ts
 * sanitizeProgramSlug("conventional-30-fixed") // => "conventional"
 * sanitizeProgramSlug("fha")                 // => "fha"
 * sanitizeProgramSlug("unknown")             // => "conventional"
 * ```
 */
export function sanitizeProgramSlug(slug: string): "conventional" | "fha" | "va" {
  if (!slug) return "conventional";
  // Take the first segment before any dash.  Normalise to lower case.
  const base = slug.toLowerCase().split("-")[0];
  switch (base) {
    case "conventional":
    case "fha":
    case "va":
      return base;
    default:
      return "conventional";
  }
}