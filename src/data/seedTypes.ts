import type { Part } from '../types';

export type PartSeed = Omit<Part, 'id' | 'rating' | 'reviewCount'> & {
  basePrice: number;
  /** Explicit vehicle ids. Omit for universal parts that use fitRule. */
  fits?: string[];
};
