// Mock seed data for the proof of concept.
// Prices are ILLUSTRATIVE ONLY and generated deterministically; they are not
// real quotes from any retailer. Replace with Supabase once it exists.
import type { Category, Fitment, Part, Price, Retailer, Vehicle } from '../types';

export const categories: Category[] = [
  {
    id: 'oil-filter',
    name: 'Oil Filters',
    description: 'Spin-on and cartridge engine oil filters',
    icon: '🛢️',
    specColumns: [
      { key: 'type', label: 'Type' },
      { key: 'media', label: 'Media' },
    ],
  },
  {
    id: 'engine-oil',
    name: 'Engine Oil',
    description: 'Synthetic and conventional motor oil',
    icon: '💧',
    specColumns: [
      { key: 'viscosity', label: 'Viscosity' },
      { key: 'volume', label: 'Volume' },
    ],
  },
  {
    id: 'air-filter',
    name: 'Engine Air Filters',
    description: 'Paper and reusable engine air filters',
    icon: '🌬️',
    specColumns: [
      { key: 'media', label: 'Media' },
      { key: 'reusable', label: 'Reusable' },
    ],
  },
  {
    id: 'cabin-filter',
    name: 'Cabin Air Filters',
    description: 'Particulate and activated-carbon cabin filters',
    icon: '🍃',
    specColumns: [
      { key: 'media', label: 'Media' },
      { key: 'carbon', label: 'Carbon' },
    ],
  },
  {
    id: 'brake-pads',
    name: 'Brake Pads',
    description: 'Ceramic and semi-metallic brake pad sets',
    icon: '🛑',
    specColumns: [
      { key: 'position', label: 'Position' },
      { key: 'compound', label: 'Compound' },
    ],
  },
  {
    id: 'spark-plugs',
    name: 'Spark Plugs',
    description: 'Iridium, platinum and copper spark plugs',
    icon: '⚡',
    specColumns: [
      { key: 'material', label: 'Material' },
      { key: 'qty', label: 'Qty' },
    ],
  },
  {
    id: 'wiper-blades',
    name: 'Wiper Blades',
    description: 'Beam, hybrid and conventional wiper blades',
    icon: '🌧️',
    specColumns: [
      { key: 'style', label: 'Style' },
      { key: 'length', label: 'Length' },
    ],
  },
  {
    id: 'battery',
    name: 'Batteries',
    description: '12V AGM and flooded lead-acid batteries',
    icon: '🔋',
    specColumns: [
      { key: 'group', label: 'Group' },
      { key: 'cca', label: 'CCA' },
    ],
  },
];

export const vehicles: Vehicle[] = [
  { id: 'v-civic-2018', year: 2018, make: 'Honda', model: 'Civic', engine: '2.0L I4' },
  { id: 'v-civic-2021', year: 2021, make: 'Honda', model: 'Civic', engine: '1.5L I4 Turbo' },
  { id: 'v-accord-2019', year: 2019, make: 'Honda', model: 'Accord', engine: '1.5L I4 Turbo' },
  { id: 'v-crv-2020', year: 2020, make: 'Honda', model: 'CR-V', engine: '1.5L I4 Turbo' },
  { id: 'v-camry-2019', year: 2019, make: 'Toyota', model: 'Camry', engine: '2.5L I4' },
  { id: 'v-corolla-2020', year: 2020, make: 'Toyota', model: 'Corolla', engine: '1.8L I4' },
  { id: 'v-rav4-2021', year: 2021, make: 'Toyota', model: 'RAV4', engine: '2.5L I4' },
  { id: 'v-f150-2018', year: 2018, make: 'Ford', model: 'F-150', engine: '5.0L V8' },
  { id: 'v-f150-2021', year: 2021, make: 'Ford', model: 'F-150', engine: '3.5L V6 EcoBoost' },
  { id: 'v-silverado-2019', year: 2019, make: 'Chevrolet', model: 'Silverado 1500', engine: '5.3L V8' },
  { id: 'v-mazda3-2020', year: 2020, make: 'Mazda', model: 'Mazda3', engine: '2.5L I4' },
  { id: 'v-wrx-2019', year: 2019, make: 'Subaru', model: 'WRX', engine: '2.0L H4 Turbo' },
];

export const retailers: Retailer[] = [
  { id: 'r-autozone', name: 'AutoZone', url: 'https://www.autozone.com', shippingNote: 'Free in-store pickup' },
  { id: 'r-oreilly', name: "O'Reilly Auto Parts", url: 'https://www.oreillyauto.com', shippingNote: 'Free in-store pickup' },
  { id: 'r-advance', name: 'Advance Auto Parts', url: 'https://shop.advanceautoparts.com', shippingNote: 'Free shipping $35+' },
  { id: 'r-rockauto', name: 'RockAuto', url: 'https://www.rockauto.com', shippingNote: 'Shipping varies by warehouse' },
  { id: 'r-amazon', name: 'Amazon', url: 'https://www.amazon.com', shippingNote: 'Free shipping w/ Prime' },
  { id: 'r-walmart', name: 'Walmart', url: 'https://www.walmart.com', shippingNote: 'Free shipping $35+' },
];

// Fitment groups (vehicle ids)
const HONDA = ['v-civic-2018', 'v-civic-2021', 'v-accord-2019', 'v-crv-2020'];
const TOYOTA = ['v-camry-2019', 'v-corolla-2020', 'v-rav4-2021'];
const FORD = ['v-f150-2018', 'v-f150-2021'];
const GM = ['v-silverado-2019'];
const MAZDA = ['v-mazda3-2020'];
const SUBARU = ['v-wrx-2019'];
const JAPAN = [...HONDA, ...TOYOTA, ...MAZDA, ...SUBARU];
const TRUCKS = [...FORD, ...GM];
const ALL = vehicles.map((v) => v.id);

type SeedPart = Omit<Part, 'id' | 'rating' | 'reviewCount'> & { basePrice: number; fits: string[] };

const seedParts: SeedPart[] = [
  // Oil filters
  { category: 'oil-filter', brand: 'Mobil 1', name: 'Extended Performance Oil Filter', partNumber: 'M1-110A', specs: { type: 'Spin-on', media: 'Synthetic' }, basePrice: 12.99, fits: [...HONDA, ...MAZDA, ...SUBARU] },
  { category: 'oil-filter', brand: 'Fram', name: 'Ultra Synthetic Oil Filter', partNumber: 'XG7317', specs: { type: 'Spin-on', media: 'Synthetic' }, basePrice: 11.49, fits: [...HONDA, ...MAZDA, ...SUBARU] },
  { category: 'oil-filter', brand: 'Fram', name: 'Extra Guard Oil Filter', partNumber: 'PH7317', specs: { type: 'Spin-on', media: 'Cellulose' }, basePrice: 5.99, fits: [...HONDA, ...MAZDA, ...SUBARU] },
  { category: 'oil-filter', brand: 'Bosch', name: 'Premium Oil Filter', partNumber: '3323', specs: { type: 'Spin-on', media: 'Blend' }, basePrice: 7.49, fits: HONDA },
  { category: 'oil-filter', brand: 'Toyota', name: 'Genuine Oil Filter', partNumber: '90915-YZZD4', specs: { type: 'Spin-on', media: 'Cellulose' }, basePrice: 8.99, fits: TOYOTA },
  { category: 'oil-filter', brand: 'K&N', name: 'Performance Oil Filter', partNumber: 'HP-1010', specs: { type: 'Spin-on', media: 'Synthetic' }, basePrice: 13.99, fits: TOYOTA },
  { category: 'oil-filter', brand: 'Motorcraft', name: 'Oil Filter', partNumber: 'FL-500S', specs: { type: 'Spin-on', media: 'Blend' }, basePrice: 9.49, fits: FORD },
  { category: 'oil-filter', brand: 'ACDelco', name: 'Professional Oil Filter', partNumber: 'PF63E', specs: { type: 'Spin-on', media: 'Blend' }, basePrice: 8.79, fits: GM },
  { category: 'oil-filter', brand: 'WIX', name: 'XP Oil Filter', partNumber: '57060XP', specs: { type: 'Spin-on', media: 'Synthetic' }, basePrice: 10.99, fits: FORD },

  // Engine oil
  { category: 'engine-oil', brand: 'Mobil 1', name: 'Advanced Full Synthetic 0W-20', partNumber: '124184', specs: { viscosity: '0W-20', volume: '5 qt' }, basePrice: 32.99, fits: [...JAPAN, ...FORD] },
  { category: 'engine-oil', brand: 'Castrol', name: 'EDGE Full Synthetic 0W-20', partNumber: '03087', specs: { viscosity: '0W-20', volume: '5 qt' }, basePrice: 31.49, fits: [...JAPAN, ...FORD] },
  { category: 'engine-oil', brand: 'Pennzoil', name: 'Ultra Platinum 0W-20', partNumber: '550040864', specs: { viscosity: '0W-20', volume: '5 qt' }, basePrice: 34.99, fits: [...JAPAN, ...FORD] },
  { category: 'engine-oil', brand: 'Valvoline', name: 'Advanced Full Synthetic 5W-30', partNumber: '881163', specs: { viscosity: '5W-30', volume: '5 qt' }, basePrice: 28.99, fits: [...TRUCKS, ...SUBARU] },
  { category: 'engine-oil', brand: 'Mobil 1', name: 'Advanced Full Synthetic 5W-30', partNumber: '124185', specs: { viscosity: '5W-30', volume: '5 qt' }, basePrice: 32.99, fits: [...TRUCKS, ...SUBARU] },
  { category: 'engine-oil', brand: 'Castrol', name: 'GTX Conventional 5W-30', partNumber: '03063', specs: { viscosity: '5W-30', volume: '5 qt' }, basePrice: 22.49, fits: [...TRUCKS, ...SUBARU] },

  // Air filters
  { category: 'air-filter', brand: 'K&N', name: 'Washable Engine Air Filter', partNumber: '33-5025', specs: { media: 'Cotton gauze', reusable: 'Yes' }, basePrice: 54.99, fits: HONDA },
  { category: 'air-filter', brand: 'Fram', name: 'Extra Guard Air Filter', partNumber: 'CA11476', specs: { media: 'Paper', reusable: 'No' }, basePrice: 17.99, fits: HONDA },
  { category: 'air-filter', brand: 'Bosch', name: 'Workshop Engine Air Filter', partNumber: '5512WS', specs: { media: 'Paper', reusable: 'No' }, basePrice: 15.49, fits: TOYOTA },
  { category: 'air-filter', brand: 'K&N', name: 'Washable Engine Air Filter', partNumber: '33-2370', specs: { media: 'Cotton gauze', reusable: 'Yes' }, basePrice: 59.99, fits: TOYOTA },
  { category: 'air-filter', brand: 'Motorcraft', name: 'Air Filter', partNumber: 'FA-1883', specs: { media: 'Paper', reusable: 'No' }, basePrice: 24.99, fits: FORD },
  { category: 'air-filter', brand: 'ACDelco', name: 'Gold Air Filter', partNumber: 'A3218C', specs: { media: 'Paper', reusable: 'No' }, basePrice: 22.49, fits: GM },
  { category: 'air-filter', brand: 'WIX', name: 'Air Filter', partNumber: '49125', specs: { media: 'Paper', reusable: 'No' }, basePrice: 16.99, fits: [...MAZDA, ...SUBARU] },

  // Cabin filters
  { category: 'cabin-filter', brand: 'Fram', name: 'Fresh Breeze Cabin Filter', partNumber: 'CF10134', specs: { media: 'Particulate', carbon: 'Yes' }, basePrice: 19.99, fits: [...HONDA, ...TOYOTA] },
  { category: 'cabin-filter', brand: 'Bosch', name: 'HEPA Cabin Filter', partNumber: '6055C', specs: { media: 'HEPA', carbon: 'Yes' }, basePrice: 29.99, fits: [...HONDA, ...TOYOTA] },
  { category: 'cabin-filter', brand: 'EPAuto', name: 'Premium Cabin Filter', partNumber: 'CP134', specs: { media: 'Particulate', carbon: 'Yes' }, basePrice: 11.99, fits: [...HONDA, ...TOYOTA, ...MAZDA] },
  { category: 'cabin-filter', brand: 'Motorcraft', name: 'Cabin Air Filter', partNumber: 'FP-79', specs: { media: 'Particulate', carbon: 'No' }, basePrice: 26.49, fits: FORD },
  { category: 'cabin-filter', brand: 'ACDelco', name: 'Cabin Air Filter', partNumber: 'CF185', specs: { media: 'Particulate', carbon: 'No' }, basePrice: 21.99, fits: GM },
  { category: 'cabin-filter', brand: 'Purolator', name: 'BreatheEASY Cabin Filter', partNumber: 'C35519', specs: { media: 'Particulate', carbon: 'Yes' }, basePrice: 18.49, fits: [...SUBARU, ...MAZDA] },

  // Brake pads
  { category: 'brake-pads', brand: 'Akebono', name: 'ProACT Ultra-Premium Ceramic', partNumber: 'ACT1089', specs: { position: 'Front', compound: 'Ceramic' }, basePrice: 54.99, fits: [...HONDA, ...TOYOTA] },
  { category: 'brake-pads', brand: 'Wagner', name: 'ThermoQuiet Ceramic', partNumber: 'QC1089', specs: { position: 'Front', compound: 'Ceramic' }, basePrice: 44.99, fits: [...HONDA, ...TOYOTA] },
  { category: 'brake-pads', brand: 'Bosch', name: 'QuietCast Premium', partNumber: 'BC1089', specs: { position: 'Front', compound: 'Ceramic' }, basePrice: 47.99, fits: [...HONDA, ...TOYOTA, ...MAZDA] },
  { category: 'brake-pads', brand: 'Power Stop', name: 'Z23 Evolution Sport', partNumber: '23-1414', specs: { position: 'Front', compound: 'Carbon-fiber ceramic' }, basePrice: 62.99, fits: [...TRUCKS] },
  { category: 'brake-pads', brand: 'ACDelco', name: 'Advantage Semi-Metallic', partNumber: '14D1363M', specs: { position: 'Front', compound: 'Semi-metallic' }, basePrice: 39.99, fits: [...TRUCKS] },
  { category: 'brake-pads', brand: 'Hawk', name: 'Performance Ceramic', partNumber: 'HB712Z', specs: { position: 'Front', compound: 'Ceramic' }, basePrice: 89.99, fits: SUBARU },

  // Spark plugs
  { category: 'spark-plugs', brand: 'NGK', name: 'Laser Iridium (4-pack)', partNumber: 'ILZKR7B11', specs: { material: 'Iridium', qty: 4 }, basePrice: 47.96, fits: [...HONDA, ...MAZDA] },
  { category: 'spark-plugs', brand: 'Denso', name: 'Iridium Long Life (4-pack)', partNumber: 'SC20HR11', specs: { material: 'Iridium', qty: 4 }, basePrice: 43.96, fits: TOYOTA },
  { category: 'spark-plugs', brand: 'Bosch', name: 'Double Iridium (4-pack)', partNumber: '9652', specs: { material: 'Iridium', qty: 4 }, basePrice: 39.96, fits: [...HONDA, ...TOYOTA, ...SUBARU] },
  { category: 'spark-plugs', brand: 'Motorcraft', name: 'Iridium Plug (8-pack)', partNumber: 'SP-546', specs: { material: 'Iridium', qty: 8 }, basePrice: 79.92, fits: ['v-f150-2018'] },
  { category: 'spark-plugs', brand: 'Motorcraft', name: 'Platinum Plug (6-pack)', partNumber: 'SP-534', specs: { material: 'Platinum', qty: 6 }, basePrice: 65.94, fits: ['v-f150-2021'] },
  { category: 'spark-plugs', brand: 'ACDelco', name: 'Professional Iridium (8-pack)', partNumber: '41-110', specs: { material: 'Iridium', qty: 8 }, basePrice: 71.92, fits: GM },

  // Wiper blades (universal-ish, sized by vehicle)
  { category: 'wiper-blades', brand: 'Rain-X', name: 'Latitude Water Repellency 26"', partNumber: '5079281-2', specs: { style: 'Beam', length: '26"' }, basePrice: 24.99, fits: ALL },
  { category: 'wiper-blades', brand: 'Bosch', name: 'ICON Beam Blade 26"', partNumber: '26A', specs: { style: 'Beam', length: '26"' }, basePrice: 29.99, fits: ALL },
  { category: 'wiper-blades', brand: 'Michelin', name: 'Stealth Ultra Hybrid 26"', partNumber: '8526', specs: { style: 'Hybrid', length: '26"' }, basePrice: 22.99, fits: ALL },
  { category: 'wiper-blades', brand: 'Trico', name: 'Force Beam Blade 22"', partNumber: '25-220', specs: { style: 'Beam', length: '22"' }, basePrice: 19.99, fits: ALL },
  { category: 'wiper-blades', brand: 'Anco', name: 'Contour 26"', partNumber: '31-26', specs: { style: 'Conventional', length: '26"' }, basePrice: 12.99, fits: ALL },

  // Batteries
  { category: 'battery', brand: 'Optima', name: 'YellowTop Dual Purpose', partNumber: 'DH6', specs: { group: 'H6', cca: 800 }, basePrice: 309.99, fits: [...FORD, ...GM] },
  { category: 'battery', brand: 'Interstate', name: 'MTX AGM', partNumber: 'MTX-48/H6', specs: { group: 'H6', cca: 760 }, basePrice: 229.99, fits: [...FORD, ...GM] },
  { category: 'battery', brand: 'DieHard', name: 'Platinum AGM', partNumber: '51R-PLAT', specs: { group: '51R', cca: 500 }, basePrice: 199.99, fits: HONDA },
  { category: 'battery', brand: 'EverStart', name: 'Maxx Lead Acid', partNumber: 'MAXX-51R', specs: { group: '51R', cca: 500 }, basePrice: 124.88, fits: HONDA },
  { category: 'battery', brand: 'Duralast', name: 'Gold Battery', partNumber: '24F-DLG', specs: { group: '24F', cca: 710 }, basePrice: 189.99, fits: [...TOYOTA, ...SUBARU, ...MAZDA] },
  { category: 'battery', brand: 'Optima', name: 'RedTop Starting', partNumber: '35', specs: { group: '35', cca: 720 }, basePrice: 259.99, fits: [...TOYOTA, ...SUBARU] },
];

// Small deterministic PRNG so the mock prices are stable between reloads.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Links go to the retailer's own search for the part number (no affiliate tags yet).
const searchTemplates: Record<string, string> = {
  'r-autozone': 'https://www.autozone.com/searchresult?searchText=',
  'r-oreilly': 'https://www.oreillyauto.com/search?q=',
  'r-advance': 'https://shop.advanceautoparts.com/web/SearchResults?searchTerm=',
  'r-rockauto': 'https://www.rockauto.com/en/partsearch/?partnum=',
  'r-amazon': 'https://www.amazon.com/s?k=',
  'r-walmart': 'https://www.walmart.com/search?q=',
};
const searchUrl = (retailerId: string, q: string) => `${searchTemplates[retailerId]}${encodeURIComponent(q)}`;

const rand = mulberry32(20261118);
const toCents = (n: number) => Math.round(n * 100) / 100;
// End prices in .99/.49 etc. for realism
const roundPrice = (n: number) => toCents(Math.floor(n) + [0.99, 0.49, 0.79, 0.29][Math.floor(rand() * 4)]);

export const parts: Part[] = [];
export const prices: Price[] = [];
export const fitments: Fitment[] = [];

seedParts.forEach((sp, i) => {
  const id = `p-${String(i + 1).padStart(3, '0')}`;
  const { basePrice, fits, ...rest } = sp;
  parts.push({
    ...rest,
    id,
    rating: toCents(3.6 + rand() * 1.4),
    reviewCount: Math.floor(20 + rand() * 2400),
  });
  fits.forEach((vehicleId) => fitments.push({ partId: id, vehicleId }));

  // Each part is listed by 3–6 retailers with a ±15% spread around base price.
  const shuffled = [...retailers].sort(() => rand() - 0.5);
  const count = 3 + Math.floor(rand() * 4);
  shuffled.slice(0, count).forEach((r) => {
    const daysAgo = Math.floor(rand() * 5);
    prices.push({
      partId: id,
      retailerId: r.id,
      price: Math.max(1, roundPrice(basePrice * (0.85 + rand() * 0.3))),
      inStock: rand() > 0.15,
      url: searchUrl(r.id, `${sp.brand} ${sp.partNumber}`),
      updatedAt: new Date(Date.UTC(2026, 10, 18 - daysAgo, 8)).toISOString(),
    });
  });
});
