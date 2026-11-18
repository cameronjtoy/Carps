// Sample maintenance parts. Part numbers, specs and prices are illustrative.
import type { PartSeed } from './seedTypes';
import { byPlatform, vehicles } from './vehicles';

const HONDA = byPlatform('civic-fc', 'civic-fc-na', 'civic-fc-15t', 'accord-cv', 'crv');
const TOYOTA = byPlatform('camry', 'corolla', 'rav4');
const FORD_TRUCK = byPlatform('f150-v8', 'f150-eco');
const MUSTANG = byPlatform('s550');
const GM = byPlatform('silverado');
const MAZDA = byPlatform('mazda3', 'nd');
const BOXER = byPlatform('wrx-va', 'zn8');
const VW = byPlatform('mk7');
const TURBO = vehicles.filter((v) => v.aspiration === 'Turbo').map((v) => v.id);
const ALL = vehicles.map((v) => v.id);
const SPORTY = byPlatform('civic-fc', 'zn8', 'nd', 'wrx-va', 'mk7', 's550');

export const maintenanceParts: PartSeed[] = [
  // Oil filters
  { category: 'oil-filter', brand: 'Mobil 1', name: 'Extended Performance Oil Filter', partNumber: 'M1-110A', specs: { type: 'Spin-on', media: 'Synthetic' }, basePrice: 12.99, fits: [...HONDA, ...MAZDA, ...BOXER] },
  { category: 'oil-filter', brand: 'Fram', name: 'Ultra Synthetic Oil Filter', partNumber: 'XG7317', specs: { type: 'Spin-on', media: 'Synthetic' }, basePrice: 11.49, fits: [...HONDA, ...MAZDA, ...BOXER] },
  { category: 'oil-filter', brand: 'Fram', name: 'Extra Guard Oil Filter', partNumber: 'PH7317', specs: { type: 'Spin-on', media: 'Cellulose' }, basePrice: 5.99, fits: [...HONDA, ...MAZDA, ...BOXER] },
  { category: 'oil-filter', brand: 'Bosch', name: 'Premium Oil Filter', partNumber: '3323', specs: { type: 'Spin-on', media: 'Blend' }, basePrice: 7.49, fits: HONDA },
  { category: 'oil-filter', brand: 'Toyota', name: 'Genuine Oil Filter', partNumber: '90915-YZZD4', specs: { type: 'Spin-on', media: 'Cellulose' }, basePrice: 8.99, fits: TOYOTA },
  { category: 'oil-filter', brand: 'K&N', name: 'Performance Oil Filter', partNumber: 'HP-1010', specs: { type: 'Spin-on', media: 'Synthetic' }, basePrice: 13.99, fits: TOYOTA },
  { category: 'oil-filter', brand: 'Motorcraft', name: 'Oil Filter', partNumber: 'FL-500S', specs: { type: 'Spin-on', media: 'Blend' }, basePrice: 9.49, fits: [...FORD_TRUCK, ...MUSTANG] },
  { category: 'oil-filter', brand: 'WIX', name: 'XP Oil Filter', partNumber: '57060XP', specs: { type: 'Spin-on', media: 'Synthetic' }, basePrice: 10.99, fits: [...FORD_TRUCK, ...MUSTANG] },
  { category: 'oil-filter', brand: 'ACDelco', name: 'Professional Oil Filter', partNumber: 'PF63E', specs: { type: 'Spin-on', media: 'Blend' }, basePrice: 8.79, fits: GM },
  { category: 'oil-filter', brand: 'Mann-Filter', name: 'Cartridge Oil Filter', partNumber: 'HU 6013 z', specs: { type: 'Cartridge', media: 'Synthetic' }, basePrice: 11.99, fits: VW },

  // Engine oil
  { category: 'engine-oil', brand: 'Mobil 1', name: 'Advanced Full Synthetic 0W-20', partNumber: '124184', specs: { viscosity: '0W-20', volume: '5 qt' }, basePrice: 32.99, fits: [...HONDA, ...TOYOTA, ...MAZDA, ...BOXER] },
  { category: 'engine-oil', brand: 'Castrol', name: 'EDGE Full Synthetic 0W-20', partNumber: '03087', specs: { viscosity: '0W-20', volume: '5 qt' }, basePrice: 31.49, fits: [...HONDA, ...TOYOTA, ...MAZDA, ...BOXER] },
  { category: 'engine-oil', brand: 'Pennzoil', name: 'Ultra Platinum 5W-20', partNumber: '550040865', specs: { viscosity: '5W-20', volume: '5 qt' }, basePrice: 34.99, fits: [...MUSTANG, ...FORD_TRUCK] },
  { category: 'engine-oil', brand: 'Valvoline', name: 'Advanced Full Synthetic 5W-30', partNumber: '881163', specs: { viscosity: '5W-30', volume: '5 qt' }, basePrice: 28.99, fits: [...GM, ...BOXER, ...FORD_TRUCK] },
  { category: 'engine-oil', brand: 'Liqui Moly', name: 'Leichtlauf High Tech 5W-40 (VW 502)', partNumber: '2332', specs: { viscosity: '5W-40', volume: '5 L' }, basePrice: 49.99, fits: VW },
  { category: 'engine-oil', brand: 'Motul', name: '8100 X-cess 5W-40', partNumber: '007250', specs: { viscosity: '5W-40', volume: '5 L' }, basePrice: 54.99, fits: [...VW, ...BOXER] },
  { category: 'engine-oil', brand: 'Motul', name: '300V Power Racing 5W-30', partNumber: '104241', specs: { viscosity: '5W-30', volume: '2 L' }, basePrice: 46.99, fits: SPORTY },

  // Air filters
  { category: 'air-filter', brand: 'K&N', name: 'Drop-in Washable Air Filter', partNumber: '33-5025', specs: { media: 'Cotton gauze', reusable: 'Yes' }, basePrice: 54.99, fits: HONDA },
  { category: 'air-filter', brand: 'Fram', name: 'Extra Guard Air Filter', partNumber: 'CA11476', specs: { media: 'Paper', reusable: 'No' }, basePrice: 17.99, fits: HONDA },
  { category: 'air-filter', brand: 'Bosch', name: 'Workshop Engine Air Filter', partNumber: '5512WS', specs: { media: 'Paper', reusable: 'No' }, basePrice: 15.49, fits: TOYOTA },
  { category: 'air-filter', brand: 'Motorcraft', name: 'Air Filter', partNumber: 'FA-1883', specs: { media: 'Paper', reusable: 'No' }, basePrice: 24.99, fits: [...FORD_TRUCK, ...MUSTANG] },
  { category: 'air-filter', brand: 'ACDelco', name: 'Gold Air Filter', partNumber: 'A3218C', specs: { media: 'Paper', reusable: 'No' }, basePrice: 22.49, fits: GM },
  { category: 'air-filter', brand: 'WIX', name: 'Air Filter', partNumber: '49125', specs: { media: 'Paper', reusable: 'No' }, basePrice: 16.99, fits: [...MAZDA, ...BOXER, ...VW] },

  // Cabin filters
  { category: 'cabin-filter', brand: 'Fram', name: 'Fresh Breeze Cabin Filter', partNumber: 'CF10134', specs: { media: 'Particulate', carbon: 'Yes' }, basePrice: 19.99, fits: [...HONDA, ...TOYOTA] },
  { category: 'cabin-filter', brand: 'Bosch', name: 'HEPA Cabin Filter', partNumber: '6055C', specs: { media: 'HEPA', carbon: 'Yes' }, basePrice: 29.99, fits: [...HONDA, ...TOYOTA] },
  { category: 'cabin-filter', brand: 'Motorcraft', name: 'Cabin Air Filter', partNumber: 'FP-79', specs: { media: 'Particulate', carbon: 'No' }, basePrice: 26.49, fits: [...FORD_TRUCK, ...MUSTANG] },
  { category: 'cabin-filter', brand: 'ACDelco', name: 'Cabin Air Filter', partNumber: 'CF185', specs: { media: 'Particulate', carbon: 'No' }, basePrice: 21.99, fits: GM },
  { category: 'cabin-filter', brand: 'Purolator', name: 'BreatheEASY Cabin Filter', partNumber: 'C35519', specs: { media: 'Particulate', carbon: 'Yes' }, basePrice: 18.49, fits: [...BOXER, ...MAZDA, ...VW] },

  // Brake pads (street → track)
  { category: 'brake-pads', brand: 'Akebono', name: 'ProACT Ultra-Premium Ceramic', partNumber: 'ACT1089', specs: { position: 'Front', compound: 'Ceramic', use: 'Street' }, basePrice: 54.99, fits: [...HONDA, ...TOYOTA, ...MAZDA] },
  { category: 'brake-pads', brand: 'Wagner', name: 'ThermoQuiet Ceramic', partNumber: 'QC1089', specs: { position: 'Front', compound: 'Ceramic', use: 'Street' }, basePrice: 44.99, fits: [...HONDA, ...TOYOTA] },
  { category: 'brake-pads', brand: 'Power Stop', name: 'Z23 Evolution Sport', partNumber: '23-1414', specs: { position: 'Front', compound: 'Carbon-ceramic', use: 'Street' }, basePrice: 62.99, fits: [...FORD_TRUCK, ...GM, ...MUSTANG] },
  { category: 'brake-pads', brand: 'Hawk', name: 'HPS 5.0', partNumber: 'HB-SPORT-F', specs: { position: 'Front', compound: 'Ferro-carbon', use: 'Spirited street' }, basePrice: 109.99, fits: SPORTY },
  { category: 'brake-pads', brand: 'EBC', name: 'Yellowstuff', partNumber: 'DP4-SPORT', specs: { position: 'Front', compound: 'Aramid', use: 'Street / autocross' }, basePrice: 129.99, fits: SPORTY },
  { category: 'brake-pads', brand: 'Ferodo', name: 'DS2500', partNumber: 'FCP-SPORT-H', specs: { position: 'Front', compound: 'Race-derived', use: 'Track day' }, basePrice: 189.99, fits: SPORTY },

  // Spark plugs
  { category: 'spark-plugs', brand: 'NGK', name: 'Laser Iridium (4-pack)', partNumber: 'ILZKR7B11', specs: { material: 'Iridium', heat: 'Stock', qty: 4 }, basePrice: 47.96, fits: [...HONDA, ...MAZDA] },
  { category: 'spark-plugs', brand: 'NGK', name: 'Ruthenium HX One Step Colder (4-pack)', partNumber: 'RU-COLD-8', specs: { material: 'Ruthenium', heat: '1 step colder', qty: 4 }, basePrice: 59.96, fits: TURBO.filter((id) => !FORD_TRUCK.includes(id)) },
  { category: 'spark-plugs', brand: 'Denso', name: 'Iridium Long Life (4-pack)', partNumber: 'SC20HR11', specs: { material: 'Iridium', heat: 'Stock', qty: 4 }, basePrice: 43.96, fits: [...TOYOTA, ...BOXER] },
  { category: 'spark-plugs', brand: 'Bosch', name: 'Double Iridium (4-pack)', partNumber: '9652', specs: { material: 'Iridium', heat: 'Stock', qty: 4 }, basePrice: 39.96, fits: [...HONDA, ...TOYOTA, ...VW] },
  { category: 'spark-plugs', brand: 'Motorcraft', name: 'Iridium Plug (8-pack)', partNumber: 'SP-546', specs: { material: 'Iridium', heat: 'Stock', qty: 8 }, basePrice: 79.92, fits: [...byPlatform('f150-v8'), ...MUSTANG] },
  { category: 'spark-plugs', brand: 'Motorcraft', name: 'Platinum Plug (6-pack)', partNumber: 'SP-534', specs: { material: 'Platinum', heat: 'Stock', qty: 6 }, basePrice: 65.94, fits: byPlatform('f150-eco') },
  { category: 'spark-plugs', brand: 'ACDelco', name: 'Professional Iridium (8-pack)', partNumber: '41-110', specs: { material: 'Iridium', heat: 'Stock', qty: 8 }, basePrice: 71.92, fits: GM },

  // Wipers
  { category: 'wiper-blades', brand: 'Rain-X', name: 'Latitude Water Repellency 26"', partNumber: '5079281-2', specs: { style: 'Beam', length: '26"' }, basePrice: 24.99, fits: ALL },
  { category: 'wiper-blades', brand: 'Bosch', name: 'ICON Beam Blade 26"', partNumber: '26A', specs: { style: 'Beam', length: '26"' }, basePrice: 29.99, fits: ALL },
  { category: 'wiper-blades', brand: 'Michelin', name: 'Stealth Ultra Hybrid 26"', partNumber: '8526', specs: { style: 'Hybrid', length: '26"' }, basePrice: 22.99, fits: ALL },
  { category: 'wiper-blades', brand: 'Anco', name: 'Contour 26"', partNumber: '31-26', specs: { style: 'Conventional', length: '26"' }, basePrice: 12.99, fits: ALL },

  // Batteries
  { category: 'battery', brand: 'Optima', name: 'YellowTop Dual Purpose', partNumber: 'DH6', specs: { group: 'H6', cca: 800, weight: '54 lb' }, basePrice: 309.99, fits: [...FORD_TRUCK, ...GM, ...MUSTANG] },
  { category: 'battery', brand: 'Interstate', name: 'MTX AGM', partNumber: 'MTX-48/H6', specs: { group: 'H6', cca: 760, weight: '52 lb' }, basePrice: 229.99, fits: [...FORD_TRUCK, ...GM, ...MUSTANG] },
  { category: 'battery', brand: 'DieHard', name: 'Platinum AGM', partNumber: '51R-PLAT', specs: { group: '51R', cca: 500, weight: '33 lb' }, basePrice: 199.99, fits: [...HONDA, ...MAZDA] },
  { category: 'battery', brand: 'Duralast', name: 'Gold Battery', partNumber: '24F-DLG', specs: { group: '24F', cca: 710, weight: '45 lb' }, basePrice: 189.99, fits: [...TOYOTA, ...BOXER] },
  { category: 'battery', brand: 'Antigravity', name: 'ATX Lithium Car Battery', partNumber: 'AG-ATX-RS', specs: { group: 'Universal', cca: 600, weight: '9 lb' }, basePrice: 449.99, fits: SPORTY, perf: { hpGain: 0, tqGain: 0, weightDelta: -25, emissions: '50-state', difficulty: 2, laborHours: 0.5, requiresTune: false } },
];
