// These types mirror the tables in supabase/schema.sql so the mock data layer
// can be swapped for Supabase without touching the UI.

export type CategoryId =
  | 'oil-filter'
  | 'air-filter'
  | 'cabin-filter'
  | 'engine-oil'
  | 'brake-pads'
  | 'spark-plugs'
  | 'wiper-blades'
  | 'battery';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  /** Spec keys shown as columns in the category table */
  specColumns: { key: string; label: string }[];
}

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  engine: string;
}

export interface Part {
  id: string;
  category: CategoryId;
  brand: string;
  name: string;
  partNumber: string;
  specs: Record<string, string | number>;
  rating: number;
  reviewCount: number;
}

export interface Retailer {
  id: string;
  name: string;
  url: string;
  shippingNote: string;
}

export interface Price {
  partId: string;
  retailerId: string;
  price: number;
  inStock: boolean;
  url: string;
  updatedAt: string;
}

export interface Fitment {
  partId: string;
  vehicleId: string;
}

/** A part joined with its prices, as the UI consumes it. */
export interface PartWithPrices extends Part {
  prices: (Price & { retailer: Retailer })[];
  lowestPrice: number | null;
  lowestRetailer: Retailer | null;
  inStockAnywhere: boolean;
  fitsSelectedVehicle: boolean | null;
}

export interface PartFilters {
  category?: CategoryId;
  vehicleId?: string | null;
  /** Only show parts that fit the selected vehicle */
  fitsOnly?: boolean;
}
