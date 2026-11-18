// Sample community builds (illustrative). Parts are looked up by brand + name
// so the list survives reordering of the generated catalog.
import type { BuildGoal, CategoryId, FeaturedBuild } from '../types';
import { parts, vehicles } from './seed';

type Pick = [CategoryId, string, number?];

/** Every '|'-separated term must appear in the part's brand, name, part # or specs. */
export function findPart(category: CategoryId, query: string): string | undefined {
  const terms = query.toLowerCase().split('|');
  return parts.find((p) => {
    if (p.category !== category) return false;
    const hay = `${p.brand} ${p.name} ${p.partNumber} ${Object.values(p.specs).join(' ')}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  })?.id;
}

function make(slug: string, name: string, vehicleId: string, goal: BuildGoal, author: string, summary: string, picks: Pick[]): FeaturedBuild {
  const items: FeaturedBuild['items'] = {};
  for (const [cat, query, qty] of picks) {
    const id = findPart(cat, query);
    if (id) items[cat] = { partId: id, qty: qty ?? (cat === 'wheels' || cat === 'tires' ? 4 : 1) };
  }
  return { slug, name, vehicleId, goal, author, summary, items };
}

const vid = (platform: string) => vehicles.find((v) => v.platform === platform)!.id;

export const featuredBuilds: FeaturedBuild[] = [
  make('gr86-canyon', 'GR86 Canyon Carver', vid('zn8'), 'Canyon / Street', 'sample_user_86', 'Light, grippy, still emissions friendly. Wheels and rubber first, then dampers.', [
    ['wheels', 'TE37|18x9.5 +38|5x100'],
    ['tires', 'RE-71RS 245/40R18'],
    ['coilovers', 'Flex Z Coilovers — GR86'],
    ['sway-bars', 'Cusco Rear Sway Bar — GR86'],
    ['brake-pads', 'HPS 5.0'],
    ['exhaust', 'Q300 Cat-Back — GR86'],
    ['intake', 'Momentum GT Cold Air Intake — GR86'],
  ]),
  make('civic-si-stage2', 'Civic Si Stage 2', vid('civic-fc'), 'Daily', 'sample_user_fc1', 'Hondata + downpipe + FMIC. Big power for the money — not smog legal.', [
    ['tune', 'FlashPro — Civic FC1'],
    ['headers-downpipe', 'High-Flow Catted Downpipe — Civic FC1'],
    ['intercooler', 'PRL Motorsports Front Mount Intercooler — Civic FC1'],
    ['intake', 'SP Series Cold Air Intake — Civic FC1'],
    ['clutch', 'Heavy Duty Street Clutch — Civic FC1'],
    ['wheels', 'Hypergram|18x8.5 +43|5x114.3'],
    ['tires', 'ExtremeContact Sport 02 235/40R18'],
    ['spark-plugs', 'One Step Colder'],
  ]),
  make('wrx-big-brakes', 'WRX Track Build', vid('wrx-va'), 'Track', 'sample_user_va', 'Brembo GT up front needs 19s — the compatibility checker will tell you.', [
    ['big-brake-kit', 'Brembo GT 6-Piston BBK (Front) — WRX'],
    ['wheels', 'CI-R|19x9.5 +42|5x114.3'],
    ['tires', 'A052 255/35R19'],
    ['coilovers', 'Öhlins Road & Track DFV — WRX'],
    ['tune', 'Accessport V3 — WRX'],
    ['seats', 'Bride Zeta IV'],
    ['aero', 'GTC-200 Adjustable Wing — WRX'],
  ]),
  make('miata-turbo', "Boosted ND Miata", vid('nd'), 'Track', 'sample_user_nd', 'Turbo kit + clutch + brakes. The Miata is always the answer.', [
    ['forced-induction', "Flyin' Miata Turbo Kit"],
    ['clutch', 'Stage 3 Endurance Clutch — MX-5 Miata'],
    ['big-brake-kit', 'ST-40 Trophy Sport BBK (Front) — MX-5 Miata'],
    ['wheels', 'RPF1|17x9 +35|4x100'],
    ['tires', 'RE-71RS 225/45R17'],
    ['coilovers', 'BC Racing BR Series Coilovers — MX-5 Miata'],
    ['battery', 'Antigravity'],
  ]),
  make('mustang-sc', 'Mustang GT Supercharged', vid('s550'), 'Canyon / Street', 'sample_user_coyote', 'Roush Phase 2 keeps it CARB legal while making ~600+ hp at the crank.', [
    ['forced-induction', 'Roush Phase 2 Supercharger Kit'],
    ['exhaust', 'Borla S-Type Cat-Back — Mustang'],
    ['clutch', 'Stage 3 Endurance Clutch — Mustang'],
    ['big-brake-kit', 'Brembo GT 6-Piston BBK (Front) — Mustang'],
    ['wheels', 'CI-R|19x9.5 +42|5x114.3'],
    ['tires', 'Pilot Sport 4S 275/40R19'],
  ]),
  make('f150-street', 'F-150 Street Truck', vid('f150-eco'), 'Off-road', 'sample_user_raptorwannabe', 'Leveled on Fox, KO2s and a Stage 1 tune.', [
    ['coilovers', 'Fox 2.0 Performance Coilovers — F-150 P702'],
    ['wheels', 'MR305|18x9 +18|6x135'],
    ['tires', 'KO2 275/65R18'],
    ['tune', 'Accessport V3 — F-150'],
    ['intake', 'aFe Momentum GT Cold Air Intake — F-150 P702'],
    ['aero', 'Pocket Style Fender Flares — F-150 P702'],
  ]),
];
