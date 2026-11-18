import { describe, expect, it } from 'vitest';
import { emptyFilters, joinPart, listTotal, lowestInStock, matchesFilters } from './pricing';
import type { Part, Price, Retailer } from '../types';

const retailers: Retailer[] = [
  { id: 'a', name: 'A', url: '', shippingNote: '' },
  { id: 'b', name: 'B', url: '', shippingNote: '' },
];
const part: Part = {
  id: 'p1', category: 'oil-filter', brand: 'Fram', name: 'Ultra', partNumber: 'XG1',
  specs: {}, rating: 4.5, reviewCount: 10,
};
const price = (retailerId: string, p: number, inStock = true): Price => ({
  partId: 'p1', retailerId, price: p, inStock, url: '', updatedAt: '',
});

describe('lowestInStock', () => {
  it('prefers the cheapest in-stock price', () => {
    expect(lowestInStock([price('a', 5, false), price('b', 7)])?.price).toBe(7);
  });
  it('falls back to cheapest overall when nothing is in stock', () => {
    expect(lowestInStock([price('a', 5, false), price('b', 7, false)])?.price).toBe(5);
  });
  it('returns null for no prices', () => {
    expect(lowestInStock([])).toBeNull();
  });
});

describe('joinPart', () => {
  it('sorts prices, picks the lowest retailer and checks fitment', () => {
    const j = joinPart(part, [price('a', 9), price('b', 6)], retailers, [{ partId: 'p1', vehicleId: 'v1' }], 'v1');
    expect(j.prices.map((p) => p.price)).toEqual([6, 9]);
    expect(j.lowestRetailer?.id).toBe('b');
    expect(j.fitsSelectedVehicle).toBe(true);
    expect(joinPart(part, [], retailers, [], 'v2').fitsSelectedVehicle).toBe(false);
    expect(joinPart(part, [], retailers, [], null).fitsSelectedVehicle).toBeNull();
  });
});

describe('matchesFilters', () => {
  const j = joinPart(part, [price('a', 9)], retailers, [], null);
  it('filters by search, brand, price, rating', () => {
    expect(matchesFilters(j, emptyFilters)).toBe(true);
    expect(matchesFilters(j, { ...emptyFilters, search: 'xg1' })).toBe(true);
    expect(matchesFilters(j, { ...emptyFilters, search: 'bosch' })).toBe(false);
    expect(matchesFilters(j, { ...emptyFilters, brands: ['Bosch'] })).toBe(false);
    expect(matchesFilters(j, { ...emptyFilters, maxPrice: 8 })).toBe(false);
    expect(matchesFilters(j, { ...emptyFilters, minRating: 4.8 })).toBe(false);
  });
});

describe('listTotal', () => {
  it('sums lowest prices and ignores empty slots', () => {
    const a = joinPart(part, [price('a', 9.99)], retailers, [], null);
    const b = joinPart(part, [price('a', 0.02)], retailers, [], null);
    expect(listTotal([a, undefined, b])).toBe(10.01);
  });
});
