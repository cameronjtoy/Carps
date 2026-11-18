// These types mirror the tables in supabase/schema.sql so the mock data layer
// can be swapped for Supabase without touching the UI.

export type CategoryId =
  // Maintenance
  | 'oil-filter'
  | 'engine-oil'
  | 'air-filter'
  | 'cabin-filter'
  | 'brake-pads'
  | 'spark-plugs'
  | 'wiper-blades'
  | 'battery'
  // Power
  | 'intake'
  | 'exhaust'
  | 'headers-downpipe'
  | 'intercooler'
  | 'forced-induction'
  | 'tune'
  | 'clutch'
  // Chassis
  | 'coilovers'
  | 'springs'
  | 'sway-bars'
  | 'big-brake-kit'
  // Wheels & tires
  | 'wheels'
  | 'tires'
  // Exterior / interior
  | 'aero'
  | 'seats';

export type SectionId = 'power' | 'chassis' | 'wheels-tires' | 'style' | 'maintenance';

export interface Section {
  id: SectionId;
  name: string;
  blurb: string;
}

export interface Category {
  id: CategoryId;
  section: SectionId;
  name: string;
  description: string;
  icon: string;
  /** Spec keys shown as columns (and filter facets) in the category table */
  specColumns: { key: string; label: string }[];
  /** How many a build normally needs (4 wheels, 4 tires) */
  defaultQty: number;
  /** Show HP / weight / emissions columns */
  performance: boolean;
}

export type Drivetrain = 'FWD' | 'RWD' | 'AWD' | '4WD';
export type Aspiration = 'NA' | 'Turbo' | 'Supercharged';

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  chassis: string;
  engine: string;
  aspiration: Aspiration;
  drivetrain: Drivetrain;
  transmission: 'Manual' | 'Automatic' | 'Manual/Auto';
  stockHp: number;
  stockTq: number;
  curbWeight: number;
  /** e.g. "5x114.3" */
  boltPattern: string;
  /** Hub bore in mm */
  centerBore: number;
  stockWheel: { diameter: number; width: number; offset: number };
  stockTire: string;
  /** Smallest wheel that clears the stock brakes */
  minWheelDiameter: number;
  /** Fitment group for platform-specific performance parts */
  platform: string;
}

export type Emissions = 'carb' | '50-state' | 'off-road';

export interface PerfData {
  hpGain: number;
  tqGain: number;
  /** Negative = weight saved (lbs) */
  weightDelta: number;
  emissions: Emissions;
  /** CARB Executive Order number when emissions === 'carb' */
  carbEo?: string;
  /** 1 (bolt-on) – 5 (shop job) */
  difficulty: number;
  laborHours: number;
  requiresTune: boolean;
}

/** Universal parts (wheels, tires, seats) are checked against the vehicle instead of a fitment list. */
export type FitRule =
  | { kind: 'wheel'; boltPattern: string; centerBore: number; diameter: number; width: number; offset: number }
  | { kind: 'tire'; width: number; aspect: number; rim: number }
  | { kind: 'seat' }
  | { kind: 'bbk'; minWheelDiameter: number };

export interface Part {
  id: string;
  category: CategoryId;
  brand: string;
  name: string;
  partNumber: string;
  specs: Record<string, string | number>;
  rating: number;
  reviewCount: number;
  perf?: PerfData;
  fitRule?: FitRule;
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

export interface FitResult {
  status: 'yes' | 'no' | 'maybe';
  reasons: string[];
}

/** A part joined with its prices, as the UI consumes it. */
export interface PartWithPrices extends Part {
  prices: (Price & { retailer: Retailer })[];
  lowestPrice: number | null;
  lowestRetailer: Retailer | null;
  inStockAnywhere: boolean;
  /** null when no vehicle is selected */
  fit: FitResult | null;
}

export interface PartFilters {
  category?: CategoryId;
  vehicleId?: string | null;
  /** Hide parts that definitely don't fit the selected vehicle */
  fitsOnly?: boolean;
}

export type BuildGoal = 'Daily' | 'Canyon / Street' | 'Track' | 'Drift' | 'Show' | 'Off-road';

export interface BuildItem {
  partId: string;
  qty: number;
}

export interface Build {
  id: string;
  name: string;
  goal: BuildGoal;
  vehicleId: string | null;
  /** Lives in California or another CARB state: off-road-only parts become errors */
  carbState: boolean;
  items: Partial<Record<CategoryId, BuildItem>>;
}

export interface FeaturedBuild extends Omit<Build, 'id' | 'carbState'> {
  slug: string;
  author: string;
  summary: string;
}
