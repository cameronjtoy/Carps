// Sample performance / custom parts, generated from templates per platform.
// Brands and product lines are real names used for realism; part numbers,
// power gains, weights and prices are ILLUSTRATIVE ONLY.
import type { CategoryId, Emissions, PerfData } from '../types';
import type { PartSeed } from './seedTypes';
import { vehicles } from './vehicles';

type Gain = number | { NA: number; Turbo: number };

interface Template {
  category: CategoryId;
  brand: string;
  name: string;
  code: string;
  specs: Record<string, string | number> | ((platform: string) => Record<string, string | number>);
  price: number;
  hp?: Gain;
  tq?: Gain;
  weight?: number;
  emissions: Emissions;
  difficulty: number;
  hours: number;
  tune?: boolean;
  platforms: string[];
}

const CARS = ['civic-fc', 'civic-fc-15t', 'zn8', 'nd', 'wrx-va', 'mk7', 's550'];
const MANUAL = ['civic-fc', 'zn8', 'nd', 'wrx-va', 'mk7', 's550'];
const TRUCKS = ['f150-v8', 'f150-eco', 'silverado'];

const platformInfo = (platform: string) => {
  const v = vehicles.find((x) => x.platform === platform)!;
  return v;
};

/** Gains scale with the engine: 10% on a 460hp V8 is more ponies than on a 181hp Miata. */
function scaleGain(g: Gain | undefined, platform: string, isTorque = false): number {
  if (g === undefined) return 0;
  const v = platformInfo(platform);
  const base = typeof g === 'number' ? g : g[v.aspiration === 'Turbo' ? 'Turbo' : 'NA'];
  const ref = isTorque ? v.stockTq : v.stockHp;
  return Math.round((base * ref) / 250);
}

const templates: Template[] = [
  // ── Intakes ───────────────────────────────────────────────
  { category: 'intake', brand: 'Injen', name: 'SP Series Cold Air Intake', code: 'INJ-SP', specs: { type: 'Cold air', filter: 'Dry' }, price: 329, hp: { NA: 6, Turbo: 9 }, tq: { NA: 5, Turbo: 11 }, weight: -3, emissions: 'carb', difficulty: 2, hours: 1, platforms: ['civic-fc', 'civic-fc-15t', 'zn8', 'nd', 'mk7', 'wrx-va', 's550'] },
  { category: 'intake', brand: 'aFe', name: 'Momentum GT Cold Air Intake', code: 'AFE-MGT', specs: { type: 'Cold air', filter: 'Oiled' }, price: 399, hp: { NA: 7, Turbo: 10 }, tq: { NA: 6, Turbo: 12 }, weight: -4, emissions: 'carb', difficulty: 2, hours: 1, platforms: ['zn8', 'wrx-va', 'mk7', 's550', ...TRUCKS] },
  { category: 'intake', brand: 'K&N', name: '63-Series AirCharger Intake', code: 'KN-63', specs: { type: 'Cold air', filter: 'Oiled' }, price: 349, hp: { NA: 5, Turbo: 8 }, tq: { NA: 5, Turbo: 9 }, weight: -2, emissions: 'carb', difficulty: 2, hours: 1, platforms: ['civic-fc', 'civic-fc-15t', 'zn8', 's550', ...TRUCKS] },
  { category: 'intake', brand: 'Mishimoto', name: 'Performance Intake', code: 'MMAI', specs: { type: 'Short ram', filter: 'Dry' }, price: 289, hp: { NA: 5, Turbo: 9 }, tq: { NA: 4, Turbo: 10 }, weight: -3, emissions: 'off-road', difficulty: 1, hours: 0.75, platforms: ['civic-fc', 'civic-fc-15t', 'wrx-va', 'mk7', 'nd', 'f150-eco'] },
  { category: 'intake', brand: 'Roush', name: 'Cold Air Intake Kit', code: 'ROU-CAI', specs: { type: 'Cold air', filter: 'Oiled' }, price: 449, hp: 7, tq: 6, weight: -3, emissions: 'carb', difficulty: 2, hours: 1.5, platforms: ['s550', 'f150-v8'] },

  // ── Exhaust ───────────────────────────────────────────────
  { category: 'exhaust', brand: 'Borla', name: 'S-Type Cat-Back', code: 'BOR-S', specs: { type: 'Cat-back', material: 'T-304 SS', sound: 'Aggressive' }, price: 1129, hp: 4, tq: 3, weight: -12, emissions: '50-state', difficulty: 2, hours: 2, platforms: ['s550', 'f150-v8', 'silverado', 'zn8', 'wrx-va'] },
  { category: 'exhaust', brand: 'MagnaFlow', name: 'Street Series Cat-Back', code: 'MAG-ST', specs: { type: 'Cat-back', material: 'T-409 SS', sound: 'Moderate' }, price: 799, hp: 3, tq: 3, weight: -8, emissions: '50-state', difficulty: 2, hours: 2, platforms: ['s550', 'civic-fc', 'mk7', ...TRUCKS] },
  { category: 'exhaust', brand: 'Invidia', name: 'Q300 Cat-Back', code: 'INV-Q3', specs: { type: 'Cat-back', material: 'T-304 SS', sound: 'Mild' }, price: 699, hp: 4, tq: 3, weight: -10, emissions: '50-state', difficulty: 2, hours: 2, platforms: ['civic-fc', 'civic-fc-15t', 'zn8', 'wrx-va', 'mk7', 'nd'] },
  { category: 'exhaust', brand: 'Tomei', name: 'Expreme Ti Titanium Cat-Back', code: 'TOM-TI', specs: { type: 'Cat-back', material: 'Titanium', sound: 'Loud' }, price: 1199, hp: 6, tq: 4, weight: -22, emissions: '50-state', difficulty: 2, hours: 2, platforms: ['zn8', 'wrx-va', 'nd'] },
  { category: 'exhaust', brand: 'Akrapovič', name: 'Slip-On Line (Titanium)', code: 'AKR-SO', specs: { type: 'Slip-on', material: 'Titanium', sound: 'Moderate' }, price: 2999, hp: 5, tq: 4, weight: -15, emissions: '50-state', difficulty: 2, hours: 1.5, platforms: ['mk7'] },
  { category: 'exhaust', brand: 'Corsa', name: 'Xtreme Cat-Back', code: 'COR-XT', specs: { type: 'Cat-back', material: 'T-304 SS', sound: 'Aggressive' }, price: 1499, hp: 5, tq: 4, weight: -10, emissions: '50-state', difficulty: 2, hours: 2, platforms: ['s550', ...TRUCKS] },
  { category: 'exhaust', brand: 'Remark', name: 'R1 Spec Cat-Back', code: 'REM-R1', specs: { type: 'Cat-back', material: 'T-304 SS', sound: 'Loud' }, price: 1049, hp: 5, tq: 4, weight: -14, emissions: '50-state', difficulty: 2, hours: 2, platforms: ['civic-fc', 'civic-fc-15t', 'wrx-va'] },

  // ── Headers & downpipes ───────────────────────────────────
  { category: 'headers-downpipe', brand: 'PRL Motorsports', name: 'High-Flow Catted Downpipe', code: 'PRL-DP', specs: { type: 'Downpipe', cat: 'High-flow (200 cell)' }, price: 599, hp: 15, tq: 18, weight: -4, emissions: 'off-road', difficulty: 3, hours: 3, tune: true, platforms: ['civic-fc', 'civic-fc-15t'] },
  { category: 'headers-downpipe', brand: 'Cobb', name: 'Catted Downpipe', code: 'COB-DP', specs: { type: 'Downpipe', cat: 'High-flow (200 cell)' }, price: 749, hp: 15, tq: 18, weight: -5, emissions: 'off-road', difficulty: 3, hours: 3, tune: true, platforms: ['wrx-va', 'mk7'] },
  { category: 'headers-downpipe', brand: 'Invidia', name: 'Catless Downpipe', code: 'INV-DPX', specs: { type: 'Downpipe', cat: 'Catless (test pipe)' }, price: 399, hp: 19, tq: 22, weight: -7, emissions: 'off-road', difficulty: 3, hours: 3, tune: true, platforms: ['civic-fc', 'wrx-va'] },
  { category: 'headers-downpipe', brand: 'CTS Turbo', name: 'Catless Downpipe', code: 'CTS-DPX', specs: { type: 'Downpipe', cat: 'Catless (test pipe)' }, price: 449, hp: 19, tq: 22, weight: -6, emissions: 'off-road', difficulty: 3, hours: 3, tune: true, platforms: ['mk7'] },
  { category: 'headers-downpipe', brand: 'Kooks', name: '1-7/8" Long Tube Headers', code: 'KOO-LT', specs: { type: 'Long tube', cat: 'Off-road (no cats)' }, price: 1899, hp: 7, tq: 6, weight: -10, emissions: 'off-road', difficulty: 4, hours: 8, tune: true, platforms: ['s550', 'f150-v8', 'silverado'] },
  { category: 'headers-downpipe', brand: 'JBA', name: 'Shorty Headers', code: 'JBA-SH', specs: { type: 'Shorty', cat: 'Retains stock cats' }, price: 649, hp: 3, tq: 3, weight: -6, emissions: 'carb', difficulty: 3, hours: 4, platforms: ['s550', 'f150-v8', 'silverado'] },
  { category: 'headers-downpipe', brand: 'Tomei', name: 'Expreme Unequal Length Header', code: 'TOM-UL', specs: { type: 'Unequal length', cat: 'Retains stock cats' }, price: 899, hp: 8, tq: 9, weight: -5, emissions: 'off-road', difficulty: 4, hours: 5, tune: true, platforms: ['zn8'] },
  { category: 'headers-downpipe', brand: 'Racing Beat', name: '4-2-1 Header', code: 'RB-421', specs: { type: '4-2-1', cat: 'Retains stock cats' }, price: 949, hp: 7, tq: 6, weight: -6, emissions: 'carb', difficulty: 4, hours: 5, platforms: ['nd'] },

  // ── Intercoolers (turbo only) ─────────────────────────────
  { category: 'intercooler', brand: 'Mishimoto', name: 'Performance Intercooler', code: 'MM-IC', specs: (p) => ({ type: p === 'wrx-va' ? 'Top-mount' : 'Front-mount', core: 'Bar & plate' }), price: 749, hp: 6, tq: 6, weight: 6, emissions: '50-state', difficulty: 3, hours: 3, platforms: ['civic-fc', 'civic-fc-15t', 'wrx-va', 'mk7', 'f150-eco'] },
  { category: 'intercooler', brand: 'PRL Motorsports', name: 'Front Mount Intercooler', code: 'PRL-IC', specs: { type: 'Front-mount', core: 'Bar & plate' }, price: 899, hp: 7, tq: 7, weight: 8, emissions: '50-state', difficulty: 3, hours: 4, platforms: ['civic-fc', 'civic-fc-15t'] },
  { category: 'intercooler', brand: 'Wagner Tuning', name: 'Competition Intercooler', code: 'WT-IC', specs: { type: 'Front-mount', core: 'Bar & plate' }, price: 699, hp: 7, tq: 7, weight: 9, emissions: '50-state', difficulty: 3, hours: 3, platforms: ['mk7'] },
  { category: 'intercooler', brand: 'GrimmSpeed', name: 'Top Mount Intercooler', code: 'GRM-TMIC', specs: { type: 'Top-mount', core: 'Bar & plate' }, price: 849, hp: 6, tq: 6, weight: 2, emissions: '50-state', difficulty: 2, hours: 1.5, platforms: ['wrx-va'] },

  // ── Forced induction ──────────────────────────────────────
  { category: 'forced-induction', brand: 'Roush', name: 'Phase 2 Supercharger Kit', code: 'ROU-SC2', specs: { type: 'Roots (TVS)', boost: '12 psi', tune: 'Included' }, price: 8499, hp: 160, tq: 115, weight: 45, emissions: 'carb', difficulty: 5, hours: 18, platforms: ['s550'] },
  { category: 'forced-induction', brand: 'Whipple', name: 'Gen 5 3.0L Supercharger Kit', code: 'WHP-G5', specs: { type: 'Twin-screw', boost: '12 psi', tune: 'Included' }, price: 8999, hp: 155, tq: 140, weight: 55, emissions: 'off-road', difficulty: 5, hours: 20, platforms: ['s550', 'f150-v8'] },
  { category: 'forced-induction', brand: 'Edelbrock', name: 'E-Force Supercharger', code: 'EDL-EF', specs: { type: 'Roots (TVS)', boost: '7 psi', tune: 'Included' }, price: 7499, hp: 120, tq: 100, weight: 50, emissions: 'carb', difficulty: 5, hours: 18, platforms: ['silverado'] },
  { category: 'forced-induction', brand: "Flyin' Miata", name: 'Turbo Kit', code: 'FM-TK', specs: { type: 'Turbo kit', boost: '8 psi', tune: 'Included' }, price: 6999, hp: 140, tq: 160, weight: 30, emissions: 'off-road', difficulty: 5, hours: 16, platforms: ['nd'] },
  { category: 'forced-induction', brand: 'HKS', name: 'GT2 Supercharger Kit', code: 'HKS-GT2', specs: { type: 'Centrifugal', boost: '6 psi', tune: 'Required' }, price: 6499, hp: 110, tq: 70, weight: 35, emissions: 'off-road', difficulty: 5, hours: 14, tune: true, platforms: ['zn8'] },
  { category: 'forced-induction', brand: 'PRL Motorsports', name: 'Stage 2 Turbo Upgrade', code: 'PRL-T2', specs: { type: 'Turbo upgrade', boost: '23 psi', tune: 'Required' }, price: 1999, hp: 90, tq: 70, weight: 2, emissions: 'off-road', difficulty: 4, hours: 6, tune: true, platforms: ['civic-fc', 'civic-fc-15t'] },
  { category: 'forced-induction', brand: 'Blouch', name: 'Dominator 1.5XT-R Turbo', code: 'BLO-15', specs: { type: 'Turbo upgrade', boost: '22 psi', tune: 'Required' }, price: 1999, hp: 70, tq: 50, weight: 2, emissions: 'off-road', difficulty: 4, hours: 8, tune: true, platforms: ['wrx-va'] },
  { category: 'forced-induction', brand: 'IHI', name: 'IS38 Turbo Upgrade', code: 'IS38', specs: { type: 'Turbo upgrade', boost: '22 psi', tune: 'Required' }, price: 1399, hp: 60, tq: 40, weight: 1, emissions: 'off-road', difficulty: 4, hours: 6, tune: true, platforms: ['mk7'] },
  { category: 'forced-induction', brand: 'Hellion', name: 'Sleeper Turbo Upgrade', code: 'HEL-SL', specs: { type: 'Turbo upgrade', boost: '20 psi', tune: 'Required' }, price: 2499, hp: 60, tq: 60, weight: 5, emissions: 'off-road', difficulty: 5, hours: 12, tune: true, platforms: ['f150-eco'] },

  // ── Tunes ─────────────────────────────────────────────────
  { category: 'tune', brand: 'Hondata', name: 'FlashPro', code: 'HON-FP', specs: { device: 'Laptop / app', stage: 'Stage 1 OTS' }, price: 695, hp: { NA: 8, Turbo: 30 }, tq: { NA: 8, Turbo: 45 }, emissions: 'carb', difficulty: 1, hours: 0.5, platforms: ['civic-fc', 'civic-fc-15t'] },
  { category: 'tune', brand: 'Cobb', name: 'Accessport V3', code: 'COB-AP3', specs: { device: 'Handheld', stage: 'Stage 1 OTS' }, price: 675, hp: { NA: 8, Turbo: 28 }, tq: { NA: 10, Turbo: 40 }, emissions: 'carb', difficulty: 1, hours: 0.5, platforms: ['wrx-va', 'mk7', 's550', 'f150-eco'] },
  { category: 'tune', brand: 'EcuTek', name: 'RaceROM Pro Tune', code: 'ECT-RR', specs: { device: 'Laptop (pro tune)', stage: 'Custom' }, price: 799, hp: { NA: 10, Turbo: 35 }, tq: { NA: 12, Turbo: 45 }, emissions: 'off-road', difficulty: 2, hours: 1, platforms: ['zn8', 'nd', 'wrx-va'] },
  { category: 'tune', brand: 'APR', name: 'Stage 1 ECU Upgrade', code: 'APR-S1', specs: { device: 'Dealer flash / EQT', stage: 'Stage 1' }, price: 599, hp: { NA: 8, Turbo: 32 }, tq: { NA: 8, Turbo: 48 }, emissions: 'off-road', difficulty: 1, hours: 0.5, platforms: ['mk7'] },
  { category: 'tune', brand: 'SCT', name: 'X4 Power Flash', code: 'SCT-X4', specs: { device: 'Handheld', stage: 'Stage 1 OTS' }, price: 449, hp: { NA: 5, Turbo: 20 }, tq: { NA: 6, Turbo: 25 }, emissions: 'carb', difficulty: 1, hours: 0.5, platforms: ['s550', 'f150-v8', 'f150-eco'] },
  { category: 'tune', brand: 'HP Tuners', name: 'MPVI3 + Custom Tune', code: 'HPT-M3', specs: { device: 'Laptop (pro tune)', stage: 'Custom' }, price: 799, hp: { NA: 7, Turbo: 25 }, tq: { NA: 8, Turbo: 30 }, emissions: 'off-road', difficulty: 2, hours: 1, platforms: ['s550', 'f150-v8', 'silverado'] },

  // ── Clutches (manual platforms) ───────────────────────────
  { category: 'clutch', brand: 'Exedy', name: 'Stage 1 Organic Clutch Kit', code: 'EXE-S1', specs: (p) => ({ stage: 'Stage 1', torque: `${Math.round(platformInfo(p).stockTq * 1.35)} lb-ft` }), price: 449, emissions: '50-state', difficulty: 4, hours: 8, platforms: MANUAL },
  { category: 'clutch', brand: 'ACT', name: 'Heavy Duty Street Clutch', code: 'ACT-HD', specs: (p) => ({ stage: 'Stage 2', torque: `${Math.round(platformInfo(p).stockTq * 1.6)} lb-ft` }), price: 599, emissions: '50-state', difficulty: 4, hours: 8, platforms: MANUAL },
  { category: 'clutch', brand: 'South Bend', name: 'Stage 3 Endurance Clutch', code: 'SB-S3', specs: (p) => ({ stage: 'Stage 3', torque: `${Math.round(platformInfo(p).stockTq * 2)} lb-ft` }), price: 849, weight: -6, emissions: '50-state', difficulty: 4, hours: 8, platforms: MANUAL },

  // ── Coilovers / suspension ────────────────────────────────
  { category: 'coilovers', brand: 'BC Racing', name: 'BR Series Coilovers', code: 'BC-BR', specs: { damping: '30-way', rates: '10k / 8k', drop: '0–3"' }, price: 1195, weight: -6, emissions: '50-state', difficulty: 3, hours: 5, platforms: CARS },
  { category: 'coilovers', brand: 'Fortune Auto', name: '500 Series Coilovers', code: 'FA-500', specs: { damping: '32-way', rates: '10k / 8k', drop: '0–3"' }, price: 1499, weight: -6, emissions: '50-state', difficulty: 3, hours: 5, platforms: CARS },
  { category: 'coilovers', brand: 'KW', name: 'V3 Coilovers', code: 'KW-V3', specs: { damping: '16 comp / 14 reb', rates: '8k / 6k', drop: '0.8–2"' }, price: 2699, weight: -4, emissions: '50-state', difficulty: 3, hours: 5, platforms: CARS },
  { category: 'coilovers', brand: 'Tein', name: 'Flex Z Coilovers', code: 'TEIN-FZ', specs: { damping: '16-way', rates: '7k / 5k', drop: '0.5–2.5"' }, price: 999, weight: -5, emissions: '50-state', difficulty: 3, hours: 5, platforms: CARS },
  { category: 'coilovers', brand: 'Öhlins', name: 'Road & Track DFV', code: 'OHL-RT', specs: { damping: '20-way DFV', rates: '8k / 7k', drop: '0.5–1.8"' }, price: 2999, weight: -5, emissions: '50-state', difficulty: 3, hours: 5, platforms: CARS },
  { category: 'coilovers', brand: 'Bilstein', name: '5100 Leveling Shocks', code: 'BIL-5100', specs: { damping: 'Monotube (fixed)', rates: 'OE', drop: '+0–2.5" lift' }, price: 449, emissions: '50-state', difficulty: 3, hours: 4, platforms: TRUCKS },
  { category: 'coilovers', brand: 'Fox', name: '2.0 Performance Coilovers', code: 'FOX-20', specs: { damping: 'Monotube (fixed)', rates: 'Lift', drop: '+2–3" lift' }, price: 1199, weight: 4, emissions: '50-state', difficulty: 4, hours: 6, platforms: TRUCKS },

  { category: 'springs', brand: 'Eibach', name: 'Pro-Kit Lowering Springs', code: 'EIB-PK', specs: { drop: '1.0" / 0.9"', rate: 'Progressive' }, price: 329, emissions: '50-state', difficulty: 3, hours: 4, platforms: CARS },
  { category: 'springs', brand: 'H&R', name: 'Sport Springs', code: 'HR-SP', specs: { drop: '1.4" / 1.2"', rate: 'Progressive' }, price: 359, emissions: '50-state', difficulty: 3, hours: 4, platforms: CARS },
  { category: 'springs', brand: 'Swift', name: 'Spec-R Springs', code: 'SWI-SR', specs: { drop: '1.2" / 1.0"', rate: 'Linear' }, price: 399, weight: -3, emissions: '50-state', difficulty: 3, hours: 4, platforms: CARS },
  { category: 'springs', brand: 'Tein', name: 'S.Tech Springs', code: 'TEIN-ST', specs: { drop: '1.3" / 1.1"', rate: 'Progressive' }, price: 279, emissions: '50-state', difficulty: 3, hours: 4, platforms: CARS },

  { category: 'sway-bars', brand: 'Whiteline', name: 'Adjustable Rear Sway Bar', code: 'WL-RSB', specs: { position: 'Rear', diameter: '24mm' }, price: 249, weight: 2, emissions: '50-state', difficulty: 2, hours: 1.5, platforms: CARS },
  { category: 'sway-bars', brand: 'Eibach', name: 'Anti-Roll Kit (F+R)', code: 'EIB-ARK', specs: { position: 'Front + rear', diameter: '25 / 22mm' }, price: 549, weight: 4, emissions: '50-state', difficulty: 3, hours: 3, platforms: CARS },
  { category: 'sway-bars', brand: 'Cusco', name: 'Rear Sway Bar', code: 'CUS-RSB', specs: { position: 'Rear', diameter: '22mm' }, price: 299, weight: 2, emissions: '50-state', difficulty: 2, hours: 1.5, platforms: ['zn8', 'nd', 'wrx-va', 'civic-fc'] },

  // ── Big brake kits (min wheel size is checked against the build) ──
  { category: 'big-brake-kit', brand: 'StopTech', name: 'ST-40 Trophy Sport BBK (Front)', code: 'STT-40', specs: { pistons: '4-piston', rotor: '332mm', minWheel: '17"' }, price: 2195, weight: -4, emissions: '50-state', difficulty: 3, hours: 3, platforms: ['civic-fc', 'zn8', 'wrx-va', 'mk7', 'nd'] },
  { category: 'big-brake-kit', brand: 'Wilwood', name: 'Superlite 6R BBK (Front)', code: 'WIL-6R', specs: { pistons: '6-piston', rotor: '355mm', minWheel: '18"' }, price: 2599, weight: -2, emissions: '50-state', difficulty: 3, hours: 3, platforms: ['civic-fc', 'zn8', 'nd', 's550'] },
  { category: 'big-brake-kit', brand: 'Brembo', name: 'GT 6-Piston BBK (Front)', code: 'BRE-GT6', specs: { pistons: '6-piston', rotor: '380mm', minWheel: '19"' }, price: 4999, weight: 2, emissions: '50-state', difficulty: 3, hours: 3, platforms: ['wrx-va', 'mk7', 's550', 'f150-eco'] },

  // ── Aero ──────────────────────────────────────────────────
  { category: 'aero', brand: 'APR Performance', name: 'GTC-200 Adjustable Wing', code: 'APR-GTC', specs: { type: 'Rear wing', material: 'Carbon fiber' }, price: 1199, weight: 12, emissions: '50-state', difficulty: 4, hours: 4, platforms: ['civic-fc', 'zn8', 'wrx-va', 'nd', 's550', 'mk7'] },
  { category: 'aero', brand: 'Maxton Design', name: 'Front Splitter V2', code: 'MAX-FS', specs: { type: 'Front splitter', material: 'ABS' }, price: 299, weight: 4, emissions: '50-state', difficulty: 2, hours: 1, platforms: CARS },
  { category: 'aero', brand: 'Seibon', name: 'Carbon Fiber Hood', code: 'SEI-HD', specs: { type: 'Hood', material: 'Carbon fiber' }, price: 1099, weight: -18, emissions: '50-state', difficulty: 3, hours: 2, platforms: ['civic-fc', 'wrx-va', 's550', 'zn8'] },
  { category: 'aero', brand: 'Verus Engineering', name: 'Rear Diffuser', code: 'VER-RD', specs: { type: 'Rear diffuser', material: 'Aluminum' }, price: 649, weight: 3, emissions: '50-state', difficulty: 2, hours: 1.5, platforms: ['zn8', 'nd'] },
  { category: 'aero', brand: 'Bushwacker', name: 'Pocket Style Fender Flares', code: 'BUS-PF', specs: { type: 'Fender flares', material: 'ABS' }, price: 449, weight: 8, emissions: '50-state', difficulty: 2, hours: 2, platforms: TRUCKS },
];

// Wheels: universal, checked by bolt pattern / center bore / brake clearance.
const wheelLines = [
  { brand: 'Enkei', name: 'RPF1', code: 'RPF1', construction: 'MAT flow-formed', price: 279, base: 14.8, cb: 73, bolts: ['5x100', '5x114.3', '4x100'], sizes: [[17, 8, 45], [17, 9, 35], [18, 8.5, 45], [18, 9.5, 38]] },
  { brand: 'Konig', name: 'Hypergram', code: 'KHG', construction: 'Flow-formed', price: 229, base: 16.9, cb: 73.1, bolts: ['5x100', '5x114.3', '5x112'], sizes: [[17, 8, 40], [18, 8.5, 43], [18, 9.5, 35], [19, 8.5, 35]] },
  { brand: 'Rays', name: 'Volk TE37 Saga S-Plus', code: 'TE37', construction: 'Forged', price: 875, base: 14.2, cb: 73, bolts: ['5x100', '5x114.3', '4x100'], sizes: [[17, 9, 42], [18, 8.5, 45], [18, 9.5, 38], [19, 9.5, 35]] },
  { brand: 'Work', name: 'Emotion CR Kiwami', code: 'WCR', construction: 'Cast', price: 399, base: 17.5, cb: 73, bolts: ['5x100', '5x114.3', '4x100'], sizes: [[17, 7.5, 47], [18, 8.5, 45], [18, 9.5, 38]] },
  { brand: 'Gram Lights', name: '57DR', code: '57DR', construction: 'Cast', price: 379, base: 17.8, cb: 73, bolts: ['5x100', '5x114.3'], sizes: [[17, 9, 38], [18, 9.5, 38], [18, 9.5, 22]] },
  { brand: 'BBS', name: 'CI-R', code: 'CIR', construction: 'Flow-formed', price: 645, base: 18.6, cb: 82, bolts: ['5x112', '5x114.3'], sizes: [[18, 8, 44], [19, 8.5, 32], [19, 9.5, 42]] },
  { brand: 'Method', name: 'MR305 NV', code: 'MR305', construction: 'Cast', price: 299, base: 27, cb: 106.25, bolts: ['6x135', '6x139.7'], sizes: [[17, 8.5, 0], [18, 9, 18], [20, 9, 18]] },
  { brand: 'Fuel', name: 'Rebel D679', code: 'D679', construction: 'Cast', price: 329, base: 29, cb: 106.1, bolts: ['6x135', '6x139.7'], sizes: [[17, 9, 1], [20, 9, 1], [20, 10, -18]] },
];

// Tires: universal, checked by rim size and overall diameter vs stock.
const carSizes = ['205/45R17', '215/45R17', '225/45R17', '245/40R17', '215/40R18', '225/40R18', '235/40R18', '245/40R18', '255/35R18', '265/35R18', '235/40R19', '255/40R19', '275/40R19', '255/35R19'];
const truckSizes = ['265/60R18', '265/65R18', '275/65R18', '285/70R17', '275/60R20'];
const tireLines = [
  { brand: 'Michelin', name: 'Pilot Sport 4S', code: 'PS4S', type: 'Max perf summer', tw: '300', price: 255, sizes: carSizes },
  { brand: 'Continental', name: 'ExtremeContact Sport 02', code: 'ECS02', type: 'Max perf summer', tw: '340', price: 205, sizes: carSizes },
  { brand: 'Bridgestone', name: 'Potenza RE-71RS', code: 'RE71RS', type: '200tw extreme', tw: '200', price: 235, sizes: carSizes },
  { brand: 'Yokohama', name: 'Advan A052', code: 'A052', type: '200tw extreme', tw: '200', price: 245, sizes: carSizes },
  { brand: 'Falken', name: 'Azenis RT660', code: 'RT660', type: '200tw extreme', tw: '200', price: 175, sizes: carSizes },
  { brand: 'Toyo', name: 'Proxes R888R', code: 'R888R', type: 'DOT R-comp', tw: '100', price: 265, sizes: carSizes },
  { brand: 'Michelin', name: 'Pilot Sport All Season 4', code: 'PSAS4', type: 'UHP all-season', tw: '500', price: 225, sizes: carSizes },
  { brand: 'BFGoodrich', name: 'All-Terrain T/A KO2', code: 'KO2', type: 'All-terrain', tw: 'n/a', price: 255, sizes: truckSizes },
  { brand: 'Nitto', name: 'Ridge Grappler', code: 'RG', type: 'Hybrid terrain', tw: 'n/a', price: 285, sizes: truckSizes },
  { brand: 'Michelin', name: 'Defender LTX M/S2', code: 'LTX', type: 'Highway all-season', tw: '800', price: 245, sizes: truckSizes },
];

const seatLines = [
  { brand: 'Bride', name: 'Zeta IV', type: 'Fixed bucket', material: 'FRP', fia: 'FIA 8855-1999', price: 1499, weight: -22 },
  { brand: 'Recaro', name: 'Pole Position N.G.', type: 'Fixed bucket', material: 'FRP', fia: 'FIA 8855-1999', price: 1549, weight: -20 },
  { brand: 'Sparco', name: 'Evo QRT', type: 'Fixed bucket', material: 'Composite', fia: 'FIA 8855-1999', price: 899, weight: -18 },
  { brand: 'Recaro', name: 'Sportster CS', type: 'Reclining sport', material: 'Steel', fia: 'No', price: 1899, weight: 2 },
  { brand: 'Corbeau', name: 'A4', type: 'Fixed bucket', material: 'Steel', fia: 'No', price: 499, weight: -10 },
];

const perfOf = (p: Partial<PerfData> & Pick<PerfData, 'emissions' | 'difficulty' | 'laborHours'>): PerfData => ({
  hpGain: 0,
  tqGain: 0,
  weightDelta: 0,
  requiresTune: false,
  ...p,
});

export function buildPerformanceParts(): PartSeed[] {
  const out: PartSeed[] = [];

  for (const t of templates) {
    for (const platform of t.platforms) {
      const v = platformInfo(platform);
      const fits = vehicles.filter((x) => x.platform === platform).map((x) => x.id);
      const specs = typeof t.specs === 'function' ? t.specs(platform) : t.specs;
      out.push({
        category: t.category,
        brand: t.brand,
        name: `${t.name} — ${v.model} ${v.chassis}`,
        partNumber: `${t.code}-${v.chassis.toUpperCase()}${platform === 'civic-fc-15t' ? '-15T' : ''}`,
        specs,
        basePrice: t.price * (TRUCKS.includes(platform) && t.category !== 'tune' ? 1.1 : 1),
        fits,
        perf: perfOf({
          hpGain: scaleGain(t.hp, platform),
          tqGain: scaleGain(t.tq, platform, true),
          weightDelta: t.weight ?? 0,
          emissions: t.emissions,
          difficulty: t.difficulty,
          laborHours: t.hours,
          requiresTune: !!t.tune,
        }),
        ...(t.category === 'big-brake-kit' ? { fitRule: { kind: 'bbk' as const, minWheelDiameter: parseInt(String(specs.minWheel)) } } : {}),
      });
    }
  }

  for (const w of wheelLines) {
    for (const [d, width, offset] of w.sizes) {
      for (const bolt of w.bolts) {
        const weight = Math.round((w.base + (d - 17) * 1.9 + (width - 8) * 0.7) * 10) / 10;
        const stockEquivalent = 20 + (d - 17) * 2.5; // typical OEM cast wheel
        out.push({
          category: 'wheels',
          brand: w.brand,
          name: `${w.name} ${d}x${width} ${offset >= 0 ? '+' : ''}${offset}`,
          partNumber: `${w.code}-${d}${String(width * 10).padStart(3, '0')}${offset >= 0 ? '+' : ''}${offset}-${bolt.replace('.', '')}`,
          specs: { size: `${d}x${width}`, offset: `${offset >= 0 ? '+' : ''}${offset}`, boltPattern: bolt, weight: `${weight} lb`, construction: w.construction, centerBore: `${w.cb}mm` },
          basePrice: w.price + (d - 17) * 35 + (width - 8) * 15,
          fitRule: { kind: 'wheel', boltPattern: bolt, centerBore: w.cb, diameter: d, width, offset },
          perf: perfOf({ weightDelta: Math.round((weight - stockEquivalent) * 10) / 10, emissions: '50-state', difficulty: 1, laborHours: 0.25 }),
        });
      }
    }
  }

  for (const t of tireLines) {
    for (const size of t.sizes) {
      const [, w, a, r] = size.match(/(\d+)\/(\d+)R(\d+)/)!.map(Number);
      out.push({
        category: 'tires',
        brand: t.brand,
        name: `${t.name} ${size}`,
        partNumber: `${t.code}-${w}${a}${r}`,
        specs: { size, type: t.type, treadwear: t.tw },
        basePrice: t.price + (r - 18) * 30 + (w - 235) * 0.8,
        fitRule: { kind: 'tire', width: w, aspect: a, rim: r },
        perf: perfOf({ emissions: '50-state', difficulty: 1, laborHours: 0.25 }),
      });
    }
  }

  for (const s of seatLines) {
    out.push({
      category: 'seats',
      brand: s.brand,
      name: s.name,
      partNumber: `${s.brand.slice(0, 3).toUpperCase()}-${s.name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8)}`,
      specs: { type: s.type, material: s.material, fia: s.fia },
      basePrice: s.price,
      fitRule: { kind: 'seat' },
      perf: perfOf({ weightDelta: s.weight, emissions: '50-state', difficulty: 3, laborHours: 1.5 }),
    });
  }

  return out;
}
