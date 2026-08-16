# Creative Performance Dashboard

An interactive performance-marketing dashboard built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Recharts**. It analyzes ad creatives from `data.xlsx` to show where budget is spent, which creatives/audiences/concepts/influencers are effective, and where budget is being wasted.

## Data pipeline

`data.xlsx` (committed in the repo root) is the **default** dataset, already cleaned by the analyst.

1. `scripts/convertData.mjs` reads `data.xlsx` (using the `xlsx` package) and writes `src/data/data.json` at build time.
2. `npm run predev` / `npm run prebuild` run this script automatically before `next dev` / `next build`.
3. The app reads the generated `src/data/data.json` via `src/lib/data.ts` as its default dataset — no Excel parsing needed just to load the page.

To regenerate the JSON manually:

```bash
npm run convert-data
```

`src/data/data.json` is git-ignored since it's a build artifact regenerated from `data.xlsx`.

### Uploading a different spreadsheet at runtime

The header includes a **file upload control**: pick any `.xlsx`/`.xls` file with the same columns as `data.xlsx` and click **Run Analysis**. The file is parsed entirely in the browser (via `src/lib/parseWorkbook.ts`, using the `xlsx` package loaded on demand so it doesn't bloat the initial page load) and swaps the dashboard's active dataset — no redeploy or server round-trip needed. Click **Reset to default data.xlsx** to go back to the committed dataset. Because parsing now also happens client-side, `xlsx` is a regular `dependency` (not dev-only).

## Business logic

The dataset already includes a `success` column marking each creative as effective (`YES`) or ineffective (`NO`), computed by the analyst as:

- **MN** (audience): effective if `ROI > 0`
- **WMN** (audience): effective if `CPU Slay < $30`

This was verified against the raw data (0 mismatches) and is used as-is — it is **not** recomputed by the app.

ROI and CPU Slay are never averaged or ranked together — they are different metrics with different "better" directions, kept in separate views/axes throughout the dashboard.

## Project structure

```
scripts/convertData.mjs        Excel -> JSON conversion script (build-time default dataset)
src/data/data.json             generated data (git-ignored)
src/types/creative.ts          TypeScript interfaces
src/lib/format.ts              currency/percent/number formatters
src/lib/colors.ts              dopamine-blue palette + status colors
src/lib/analytics.ts           filtering, aggregation, insights
src/lib/creativeColumnMap.ts   shared column mapping (mirrors convertData.mjs)
src/lib/parseWorkbook.ts       browser-side .xlsx parser for the upload feature
src/context/FilterContext.tsx  global filter + active-dataset state
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
