import type { Fitment, Part, PartWithPrices, Price, Retailer } from '../types';

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
  vehicleId: string | null | undefined,
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
    fitsSelectedVehicle: vehicleId
      ? fitments.some((f) => f.partId === part.id && f.vehicleId === vehicleId)
      : null,
  };
}

export interface TableFilters {
  search: string;
  brands: string[];
  maxPrice: number | null;
  inStockOnly: boolean;
  minRating: number;
}

export const emptyFilters: TableFilters = {
  search: '',
  brands: [],
  maxPrice: null,
  inStockOnly: false,
  minRating: 0,
};

export function matchesFilters(p: PartWithPrices, f: TableFilters): boolean {
  if (f.search) {
    const q = f.search.toLowerCase();
    const hay = `${p.brand} ${p.name} ${p.partNumber}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.brands.length && !f.brands.includes(p.brand)) return false;
  if (f.maxPrice !== null && (p.lowestPrice === null || p.lowestPrice > f.maxPrice)) return false;
  if (f.inStockOnly && !p.inStockAnywhere) return false;
  if (p.rating < f.minRating) return false;
  return true;
}

export function listTotal(items: (PartWithPrices | undefined)[]): number {
  return Math.round(items.reduce((sum, p) => sum + (p?.lowestPrice ?? 0), 0) * 100) / 100;
}

export const formatPrice = (n: number | null) =>
  n === null ? '—' : n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
