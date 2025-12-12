This repository now includes new UI components and locations:

- `src/components/site/Header.tsx`: Unified site header used across pages (branding, navigation, CTA).
- `src/components/hero/HeroClassic.tsx`: Classic hero/banner used on the home page and calculator wizard start page.
- `src/components/calc/CtaRail.tsx`: CTA rail (call-to-action) used below the hero.
- `src/components/calc/CompareRates.tsx`: "Compare Rates" table with placeholder lender data. It is shown on the wizard results page only.

Notes
- The hero uses `/public/hero-placeholder.png` as a placeholder graphic.
- `CompareRates` currently uses sample JSON data; replace with real lender data or wire to an API when available.
- Styling follows Tailwind utility classes and the color tokens available in `tailwind.config.ts`.

If you modify these components, please run:

```bash
npm install
npm run build
npm run dev
```

and verify the wizard pages and home page load as expected.
