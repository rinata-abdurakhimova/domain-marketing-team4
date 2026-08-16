# Creative Performance Dashboard

An interactive performance-marketing dashboard built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Recharts**. It analyzes ad creatives from `data.xlsx` to show where budget is spent, which creatives/audiences/concepts/influencers are effective, and where budget is being wasted.

## Data pipeline

`data.xlsx` is the source of truth (already cleaned by the analyst). Reading `.xlsx` directly in Next.js server/client components is avoided (heavy dependency, breaks edge/serverless bundling), so instead:

1. `scripts/convertData.mjs` reads `data.xlsx` (using the `xlsx` package, a **devDependency only**) and writes `src/data/data.json`.
2. `npm run predev` / `npm run prebuild` run this script automatically before `next dev` / `next build`.
3. The app only ever reads the generated `src/data/data.json` via `src/lib/data.ts` — no Excel parsing at runtime.

To regenerate the JSON manually:

```bash
npm run convert-data
```

`src/data/data.json` is git-ignored since it's a build artifact regenerated from `data.xlsx`.

## Business logic

The dataset already includes a `success` column marking each creative as effective (`YES`) or ineffective (`NO`), computed by the analyst as:

- **MN** (audience): effective if `ROI > 0`
- **WMN** (audience): effective if `CPU Slay < $30`

This was verified against the raw data (0 mismatches) and is used as-is — it is **not** recomputed by the app.

ROI and CPU Slay are never averaged or ranked together — they are different metrics with different "better" directions, kept in separate views/axes throughout the dashboard.

## Project structure

```
scripts/convertData.mjs        Excel -> JSON conversion script
src/data/data.json             generated data (git-ignored)
src/types/creative.ts          TypeScript interfaces
src/lib/format.ts              currency/percent/number formatters
src/lib/colors.ts              dopamine-blue palette + status colors
src/lib/analytics.ts           filtering, aggregation, insights
src/context/FilterContext.tsx  global filter state
src/components/dashboard/      dashboard sections & charts (components/dashboard/charts, components/dashboard/ui)
src/app/page.tsx               assembles the dashboard
```

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. No special configuration is needed — Vercel runs `npm run build`, which runs `prebuild` (regenerating `src/data/data.json` from `data.xlsx`) followed by `next build`.
3. Make sure `data.xlsx` stays committed to the repo root; it's the only required data input.
