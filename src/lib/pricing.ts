import type { Emissions, Fitment, Part, PartWithPrices, Price, Retailer, Vehicle } from '../types';
import { checkPartFit } from './fitment';

export function lowestInStock<T extends Price>(prices: T[]): T | null {
  const pool = prices.filter((p) => p.inStock);
  const list = pool.length ? pool : prices;
  return list.reduce<T | null>((best, p) => (best === null || p.price < best.price ? p : best), null);
}

export function joinPart(
  part: Part,
  prices: Price[],
  retailers: Retailer[],
  fitments: Fitment[],
  vehicle: Vehicle | null | undefined,
): PartWithPrices {
  const byId = new Map(retailers.map((r) => [r.id, r]));
  const joined = prices
    .filter((p) => p.partId === part.id)
    .map((p) => ({ ...p, retailer: byId.get(p.retailerId)! }))
    .sort((a, b) => a.price - b.price);
  const best = lowestInStock(joined);
  return {
    ...part,
    prices: joined,
    lowestPrice: best?.price ?? null,
    lowestRetailer: best?.retailer ?? null,
    inStockAnywhere: joined.some((p) => p.inStock),
    fit: vehicle ? checkPartFit(part, vehicle, fitments) : null,
  };
}

export interface TableFilters {
  search: string;
  brands: string[];
  maxPrice: number | null;
  inStockOnly: boolean;
  minRating: number;
  /** Facet selections per spec key */
  specs: Record<string, string[]>;
  emissions: Emissions[];
  noTuneRequired: boolean;
  maxDifficulty: number;
}

export const emptyFilters: TableFilters = {
  search: '',
  brands: [],
  maxPrice: null,
  inStockOnly: false,
  minRating: 0,
  specs: {},
  emissions: [],
  noTuneRequired: false,
  maxDifficulty: 5,
};

export function matchesFilters(p: PartWithPrices, f: TableFilters): boolean {
  if (f.search) {
    const q = f.search.toLowerCase();
    const hay = `${p.brand} ${p.name} ${p.partNumber} ${Object.values(p.specs).join(' ')}`.toLowerCase();
    if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
  }
  if (f.brands.length && !f.brands.includes(p.brand)) return false;
  if (f.maxPrice !== null && (p.lowestPrice === null || p.lowestPrice > f.maxPrice)) return false;
  if (f.inStockOnly && !p.inStockAnywhere) return false;
  if (p.rating < f.minRating) return false;
  for (const [key, values] of Object.entries(f.specs)) {
    if (values.length && !values.includes(String(p.specs[key] ?? ''))) return false;
  }
  if (p.perf) {
    if (f.emissions.length && !f.emissions.includes(p.perf.emissions)) return false;
    if (f.noTuneRequired && p.perf.requiresTune) return false;
    if (p.perf.difficulty > f.maxDifficulty) return false;
  }
  return true;
}

export const formatPrice = (n: number | null) =>
  n === null ? '—' : n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const emissionsLabel: Record<Emissions, string> = {
  carb: 'CARB legal',
  '50-state': '50-state legal',
  'off-road': 'Off-road only',
};
