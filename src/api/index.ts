// Data access layer. Every page goes through these functions, so swapping the
// mock seed for Supabase only touches this file. See README "Supabase" section.
import { featuredBuilds } from '../data/featured';
import { categories, fitments, parts, prices, retailers, sections, vehicles } from '../data/seed';
import { joinPart } from '../lib/pricing';
import type { Category, CategoryId, FeaturedBuild, PartFilters, PartWithPrices, Retailer, Section, Vehicle } from '../types';

const vehicleById = (id?: string | null) => (id ? vehicles.find((v) => v.id === id) ?? null : null);

export async function getSections(): Promise<Section[]> {
  return sections;
}

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
  const vehicle = vehicleById(filters.vehicleId);
  return parts
    .filter((p) => !filters.category || p.category === filters.category)
    .map((p) => joinPart(p, prices, retailers, fitments, vehicle))
    .filter((p) => !filters.fitsOnly || p.fit?.status !== 'no');
}

export async function getPart(id: string, vehicleId?: string | null): Promise<PartWithPrices | undefined> {
  const part = parts.find((p) => p.id === id);
  return part && joinPart(part, prices, retailers, fitments, vehicleById(vehicleId));
}

export async function getPartsByIds(ids: string[], vehicleId?: string | null): Promise<PartWithPrices[]> {
  const vehicle = vehicleById(vehicleId);
  return parts.filter((p) => ids.includes(p.id)).map((p) => joinPart(p, prices, retailers, fitments, vehicle));
}

export async function getFeaturedBuilds(): Promise<FeaturedBuild[]> {
  return featuredBuilds;
}

export async function getFeaturedBuild(slug: string): Promise<FeaturedBuild | undefined> {
  return featuredBuilds.find((b) => b.slug === slug);
}
