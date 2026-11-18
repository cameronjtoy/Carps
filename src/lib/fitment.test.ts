import { describe, expect, it } from 'vitest';
import { checkPartFit, diameterChangePct, parseTire, tireDiameter, wheelPosition } from './fitment';
import { vehicles } from '../data/vehicles';
import type { Part } from '../types';

const gr86 = vehicles.find((v) => v.platform === 'zn8')!;
const base: Omit<Part, 'fitRule'> = { id: 'x', category: 'wheels', brand: 'B', name: 'N', partNumber: '1', specs: {}, rating: 4, reviewCount: 1 };

describe('tire math', () => {
  it('computes overall diameter', () => {
    expect(tireDiameter(parseTire('245/40R18')!)).toBeCloseTo(25.72, 1);
  });
  it('computes % change', () => {
    expect(diameterChangePct(parseTire('215/40R18')!, parseTire('215/40R18')!)).toBe(0);
    expect(diameterChangePct(parseTire('215/40R18')!, parseTire('275/65R18')!)).toBeGreaterThan(20);
  });
});

describe('wheelPosition', () => {
  it('wider wheel with lower offset pokes out', () => {
    const pos = wheelPosition({ diameter: 18, width: 7.5, offset: 48 }, { diameter: 18, width: 9.5, offset: 38 });
    expect(pos.outer).toBe(35); // 25.4mm extra half-width + 10mm less offset
    expect(pos.inner).toBe(15);
  });
});

describe('checkPartFit', () => {
  it('rejects the wrong bolt pattern', () => {
    const r = checkPartFit({ ...base, fitRule: { kind: 'wheel', boltPattern: '5x114.3', centerBore: 73, diameter: 18, width: 8.5, offset: 45 } }, gr86, []);
    expect(r.status).toBe('no');
  });
  it('accepts a matching wheel and suggests hub rings', () => {
    const r = checkPartFit({ ...base, fitRule: { kind: 'wheel', boltPattern: '5x100', centerBore: 73, diameter: 18, width: 8, offset: 45 } }, gr86, []);
    expect(r.status).toBe('yes');
    expect(r.reasons.join()).toMatch(/hub-centric/);
  });
  it('flags aggressive wheels as maybe', () => {
    const r = checkPartFit({ ...base, fitRule: { kind: 'wheel', boltPattern: '5x100', centerBore: 73, diameter: 18, width: 9.5, offset: 22 } }, gr86, []);
    expect(r.status).toBe('maybe');
  });
  it('rejects truck tires on a sports car', () => {
    const r = checkPartFit({ ...base, category: 'tires', fitRule: { kind: 'tire', width: 275, aspect: 65, rim: 18 } }, gr86, []);
    expect(r.status).toBe('no');
  });
  it('uses the fitment list for platform parts', () => {
    expect(checkPartFit(base as Part, gr86, [{ partId: 'x', vehicleId: 'other' }]).status).toBe('no');
    expect(checkPartFit(base as Part, gr86, [{ partId: 'x', vehicleId: gr86.id }]).status).toBe('yes');
  });
});
