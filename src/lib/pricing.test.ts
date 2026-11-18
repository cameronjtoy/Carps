import { describe, expect, it } from 'vitest';
import { emptyFilters, joinPart, lowestInStock, matchesFilters } from './pricing';
import type { Part, Price, Retailer } from '../types';

const retailers: Retailer[] = [
  { id: 'a', name: 'A', url: '', shippingNote: '' },
  { id: 'b', name: 'B', url: '', shippingNote: '' },
];
const part: Part = {
  id: 'p1', category: 'intake', brand: 'Injen', name: 'SP Intake', partNumber: 'SP1',
  specs: { type: 'Cold air' }, rating: 4.5, reviewCount: 10,
  perf: { hpGain: 8, tqGain: 8, weightDelta: -3, emissions: 'off-road', difficulty: 2, laborHours: 1, requiresTune: true },
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
});

describe('joinPart', () => {
  it('sorts prices and picks the lowest retailer', () => {
    const j = joinPart(part, [price('a', 9), price('b', 6)], retailers, [], null);
    expect(j.prices.map((p) => p.price)).toEqual([6, 9]);
    expect(j.lowestRetailer?.id).toBe('b');
    expect(j.fit).toBeNull();
  });
});

describe('matchesFilters', () => {
  const j = joinPart(part, [price('a', 9)], retailers, [], null);
  it('filters by search, brand, price, specs and perf data', () => {
    expect(matchesFilters(j, emptyFilters)).toBe(true);
    expect(matchesFilters(j, { ...emptyFilters, search: 'injen sp1' })).toBe(true);
    expect(matchesFilters(j, { ...emptyFilters, brands: ['K&N'] })).toBe(false);
    expect(matchesFilters(j, { ...emptyFilters, maxPrice: 8 })).toBe(false);
    expect(matchesFilters(j, { ...emptyFilters, specs: { type: ['Short ram'] } })).toBe(false);
    expect(matchesFilters(j, { ...emptyFilters, emissions: ['carb'] })).toBe(false);
    expect(matchesFilters(j, { ...emptyFilters, noTuneRequired: true })).toBe(false);
    expect(matchesFilters(j, { ...emptyFilters, maxDifficulty: 1 })).toBe(false);
  });
});
