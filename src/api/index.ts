// Data access layer. Every page goes through these functions, so swapping the
// mock seed for Supabase only touches this file. See README "Supabase" section.
import { categories, fitments, parts, prices, retailers, vehicles } from '../data/seed';
import { joinPart } from '../lib/pricing';
import type { Category, CategoryId, PartFilters, PartWithPrices, Retailer, Vehicle } from '../types';

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(id: CategoryId): Promise<Category | undefined> {
  return categories.find((c) => c.id === id);
}

export async function getVehicles(): Promise<Vehicle[]> {
  return vehicles;
}

export async function getRetailers(): Promise<Retailer[]> {
  return retailers;
}

export async function getParts(filters: PartFilters = {}): Promise<PartWithPrices[]> {
  return parts
    .filter((p) => !filters.category || p.category === filters.category)
    .map((p) => joinPart(p, prices, retailers, fitments, filters.vehicleId))
    .filter((p) => !filters.fitsOnly || p.fitsSelectedVehicle !== false);
}

export async function getPart(id: string, vehicleId?: string | null): Promise<PartWithPrices | undefined> {
  const part = parts.find((p) => p.id === id);
  return part && joinPart(part, prices, retailers, fitments, vehicleId);
}

export async function getPartsByIds(ids: string[], vehicleId?: string | null): Promise<PartWithPrices[]> {
  return parts
    .filter((p) => ids.includes(p.id))
    .map((p) => joinPart(p, prices, retailers, fitments, vehicleId));
}
