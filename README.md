# Carps — compare car part prices

A PCPartPicker-style proof of concept for basic car maintenance parts: pick your vehicle, browse a
sortable/filterable table of parts, compare prices across retailers, and build a shareable parts list.

> **Prices in this POC are generated sample data**, not live retailer quotes.

## Features (POC)

- **Vehicle selector** (Year → Make → Model → Engine), remembered in the browser; parts show *Fits / Doesn't fit*.
- **Category tables** for oil filters, engine oil, air & cabin filters, brake pads, spark plugs, wiper blades and batteries —
  sort any column; filter by search, brand, max price, rating, in-stock and fitment.
- **Part page** with a price comparison across retailers (best in-stock price highlighted).
- **My List** — one part per category with a running total and a share link (`#/list?parts=…`).
- Works on phones (tables collapse into cards) and in dark mode.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173/Carps/
npm test         # unit tests for pricing/filter logic
npm run build    # production build into dist/
```

## Deploy to GitHub Pages

1. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Merge to `main` (or run the *Deploy to GitHub Pages* workflow manually from the Actions tab).
3. Site: `https://cameronjtoy.github.io/Carps/`

The app uses `HashRouter` (URLs like `/Carps/#/parts/oil-filter`) because Pages can't rewrite deep links.
If you rename the repo, update `base` in `vite.config.ts`.

## Project layout

```
src/
  api/index.ts         data access layer — the only file that changes for Supabase
  data/seed.ts         mock categories, vehicles, parts, retailers, prices, fitments
  lib/pricing.ts       best-price, filter and total logic (+ tests)
  context/             selected vehicle + parts list (localStorage)
  components/          Header, VehicleSelector, PartsTable (TanStack Table), FilterSidebar, PriceTable…
  pages/               Home, CategoryPage, PartPage, ListPage
supabase/schema.sql    tables + read-only RLS policies matching src/types.ts
```

## Hooking up Supabase (later)

1. Create the project, run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
   (add the same two as repository **Actions secrets** and pass them as `env:` to the build step).
3. `npm i @supabase/supabase-js` and rewrite the functions in `src/api/index.ts` to query the tables
   (e.g. `supabase.from('parts').select('*, prices(*, retailers(*))').eq('category_id', id)`).
   The UI doesn't need to change.
4. Load data: export `src/data/seed.ts` as a starting point, then real feeds (below).

## Roadmap — what else we need

**Data (the hard part)**
- Real prices: affiliate APIs/feeds (Amazon Product Advertising API, eBay Browse API, CJ/Rakuten/Impact
  feeds for parts retailers) pulled on a schedule by Supabase Edge Functions + cron into `prices` / `price_history`.
- Accurate fitment: ACES/PIES catalog data, or at minimum a VIN decoder (NHTSA vPIC is free) to pick the vehicle.
- OEM ↔ aftermarket cross-reference (e.g. Honda 15400-PLM-A02 = Fram PH7317).
- Product images and normalized specs.

**Product**
- Accounts (Supabase Auth): a "garage" of saved vehicles, saved/public lists.
- Price-history charts and price-drop email alerts.
- Maintenance schedules per vehicle (what's due at 30k miles) that pre-fill a list.
- Compare parts side by side, user reviews, shipping/tax/coupon-aware totals, local pickup availability.
- Multiple quantities per list (e.g. 2 wiper blades, 5 qt + 1 qt oil).
- Admin page to curate parts/retailers.

**Business / tech**
- Affiliate links for revenue (needs disclosure page + retailer program approval).
- SEO: Pages + hash routing isn't crawlable — move to Vercel/Netlify with SSR or pre-rendering once the catalog is real.
- Analytics, error tracking, and Terms/Privacy pages.
