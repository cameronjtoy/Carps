// Assembles the mock catalog. Prices are ILLUSTRATIVE ONLY and generated
// deterministically; they are not real quotes. Replace with Supabase later.
import type { Fitment, Part, Price } from '../types';
import { categories, sections } from './catalog';
import { maintenanceParts } from './maintenance';
import { buildPerformanceParts } from './performance';
import { retailerSeeds, retailers } from './retailers';
import { rand } from './rng';
import { vehicles } from './vehicles';

export { categories, sections, retailers, vehicles };

const toCents = (n: number) => Math.round(n * 100) / 100;
const roundPrice = (n: number) =>
  n > 150 ? Math.floor(n / 5) * 5 + [0.99, 4.99, 0][Math.floor(rand() * 3)] : toCents(Math.floor(n) + [0.99, 0.49, 0.79, 0.29][Math.floor(rand() * 4)]);

export const parts: Part[] = [];
export const prices: Price[] = [];
export const fitments: Fitment[] = [];

const sectionOf = new Map(categories.map((c) => [c.id, c.section]));

[...maintenanceParts, ...buildPerformanceParts()].forEach((sp, i) => {
  const id = `p-${String(i + 1).padStart(4, '0')}`;
  const { basePrice, fits, ...rest } = sp;
  parts.push({
    ...rest,
    id,
    rating: toCents(3.7 + rand() * 1.3),
    reviewCount: Math.floor(5 + rand() * 1800),
  });
  fits?.forEach((vehicleId) => fitments.push({ partId: id, vehicleId }));

  // Listed by 2–5 of the retailers that stock this section, ±12% around base.
  const section = sectionOf.get(sp.category)!;
  const stockists = retailerSeeds.filter((r) => r.carries.includes(section)).sort(() => rand() - 0.5);
  const count = Math.min(stockists.length, 2 + Math.floor(rand() * 4));
  stockists.slice(0, count).forEach((r) => {
    const daysAgo = Math.floor(rand() * 5);
    prices.push({
      partId: id,
      retailerId: r.id,
      price: Math.max(1, roundPrice(basePrice * (0.88 + rand() * 0.24))),
      inStock: rand() > 0.15,
      url: r.search(`${sp.brand} ${sp.name.split(' — ')[0]}`),
      updatedAt: new Date(Date.UTC(2026, 10, 18 - daysAgo, 8)).toISOString(),
    });
  });
});
