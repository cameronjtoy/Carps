# Carps — plan car builds, check fitment, compare prices

A PCPartPicker-style site for car people: pick your car, browse performance and maintenance parts in
sortable/filterable tables, check fitment, and plan builds with live compatibility checks and price totals.

> **Prices, part numbers, specs and power gains in this POC are generated sample data.**

## Features (POC)

**Vehicle-aware browsing**
- Year → Make → Model → Trim picker with enthusiast specs (chassis code, power, weight, bolt pattern,
  center bore, stock wheel/tire). Platforms include Civic Si (FC1), GR86 (ZN8), MX-5 (ND2), WRX (VA),
  Golf GTI (Mk7), Mustang GT (S550), F-150 and Silverado, plus everyday cars.
- 23 categories in 5 sections: **Power** (intakes, exhaust, headers/downpipes, intercoolers, turbo/supercharger,
  tunes, clutches), **Chassis & Brakes** (coilovers, springs, sway bars, big brake kits), **Wheels & Tires**,
  **Aero & Interior**, and **Maintenance**.
- Every part shows **Fits / Check fit / No fit**, with the reasons on hover. Platform parts use a fitment list;
  wheels are checked by bolt pattern, center bore, brake clearance and poke vs. stock; tires by rim size and
  overall diameter; big brake kits by minimum wheel size.
- Tables: est. hp/tq gain, weight change, emissions status (CARB / 50-state / off-road), "needs tune",
  install difficulty, rating, best price. Filters for every spec column (size, offset, bolt pattern, damping…),
  emissions, tune required, difficulty, brand, price and stock.

**Build planner**
- Multiple saved builds (rename, duplicate, delete), a goal (Daily, Track, Drift…), quantities (4 wheels, 4 tires).
- **Compatibility checker**: tire ↔ wheel diameter and width, tire diameter/speedo error, BBK ↔ wheel size,
  coilovers + springs conflict, parts that need a tune, clutch torque capacity vs. estimated torque,
  automatic-only cars, wheel poke on lowered cars, hub-centric rings, seat rails, and emissions
  (errors when "I live in a CARB state" is on).
- Stats: estimated hp/torque (with diminishing returns), curb weight change, lb/hp, parts total at best prices,
  and estimated install labor.
- Share link (`#/build?share=…`) that anyone can open and save.

**Also**
- Featured builds gallery (sample builds you can clone).
- Wheel & tire fitment calculator: poke, inner clearance, overall diameter, speedo error, sidewall,
  recommended tire width, with a cross-section diagram.
- Phone layout (tables collapse into cards) and dark mode.

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
  data/                vehicles, catalog, maintenance + performance part templates, retailers, featured builds
  lib/fitment.ts       wheel/tire math and per-part fitment rules (+ tests)
  lib/compat.ts        build compatibility engine (+ tests)
  lib/buildStats.ts    power / weight / cost / labor estimates
  lib/pricing.ts       best price, joins, table filters (+ tests)
  context/             selected vehicle + saved builds (localStorage)
  components/          PartsTable (TanStack Table), FilterSidebar, BuildTable, CompatPanel, StatsCards…
  pages/               Home, CategoryPage, PartPage, BuildPage, BuildsPage, FitmentTool
supabase/schema.sql    catalog tables (public read) + user builds (owner write) matching src/types.ts
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
- Accounts (Supabase Auth): a "garage" of saved vehicles; builds synced to the `builds` tables; public build pages.
- Build photos, dyno sheets and a progress log (installed / ordered / planned per part).
- More compatibility rules: fuel system limits (injectors/pump) for big power, intercooler piping,
  staggered setups, tire load index / lift kits for trucks, brake pad ↔ caliper pairing.
- Price-history charts and price-drop email alerts.
- Maintenance schedules per vehicle (what's due at 30k miles) that pre-fill a list.
- Compare parts side by side, user reviews, shipping/tax/coupon-aware totals, local pickup availability.
- Admin page to curate parts/retailers.

**Business / tech**
- Affiliate links for revenue (needs disclosure page + retailer program approval).
- SEO: Pages + hash routing isn't crawlable — move to Vercel/Netlify with SSR or pre-rendering once the catalog is real.
- Analytics, error tracking, and Terms/Privacy pages.
