import { describe, expect, it } from 'vitest';
import { checkBuild } from './compat';
import { buildStats } from './buildStats';
import { fitments, parts, prices, retailers, vehicles } from '../data/seed';
import { findPart } from '../data/featured';
import { joinPart } from './pricing';
import type { Build, CategoryId, PartWithPrices } from '../types';

const wrx = vehicles.find((v) => v.platform === 'wrx-va')!;

function setup(picks: [CategoryId, string][], carbState = false) {
  const build: Build = { id: 'b', name: 't', goal: 'Track', vehicleId: wrx.id, carbState, items: {} };
  const items: Partial<Record<CategoryId, PartWithPrices>> = {};
  for (const [cat, q] of picks) {
    const id = findPart(cat, q);
    if (!id) throw new Error(`no part for ${q}`);
    build.items[cat] = { partId: id, qty: cat === 'wheels' || cat === 'tires' ? 4 : 1 };
    items[cat] = joinPart(parts.find((p) => p.id === id)!, prices, retailers, fitments, wrx);
  }
  return { issues: checkBuild(build, wrx, items), stats: buildStats(build, wrx, items) };
}

const msgs = (i: { message: string }[]) => i.map((x) => x.message).join('\n');

describe('checkBuild', () => {
  it('a clean bolt-on build has no errors', () => {
    const { issues } = setup([['intake', 'Injen|WRX'], ['coilovers', 'BC Racing|WRX']]);
    expect(issues.filter((i) => i.level === 'error')).toEqual([]);
  });
  it('Brembo GT needs 19" wheels', () => {
    expect(msgs(setup([['big-brake-kit', 'Brembo|WRX']]).issues)).toMatch(/needs 19"\+ wheels/);
    const ok = setup([['big-brake-kit', 'Brembo|WRX'], ['wheels', 'CI-R|19x9.5 +42|5x114.3'], ['tires', 'A052 255/35R19']]);
    expect(ok.issues.filter((i) => i.level === 'error')).toEqual([]);
  });
  it('tires must match the wheel diameter', () => {
    const { issues } = setup([['wheels', 'CI-R|19x9.5 +42|5x114.3'], ['tires', 'A052 245/40R18']]);
    expect(msgs(issues)).toMatch(/don't mount/);
  });
  it('downpipe without a tune warns; with CARB on it errors', () => {
    expect(msgs(setup([['headers-downpipe', 'Cobb|WRX']]).issues)).toMatch(/requires an ECU tune/);
    const carb = setup([['headers-downpipe', 'Cobb|WRX'], ['tune', 'Accessport|WRX']], true);
    expect(carb.issues.some((i) => i.level === 'error' && /CARB/.test(i.message))).toBe(true);
  });
  it('coilovers and springs conflict', () => {
    expect(msgs(setup([['coilovers', 'KW|WRX'], ['springs', 'Eibach|WRX']]).issues)).toMatch(/remove the lowering springs/);
  });
  it('big power on a stock clutch warns', () => {
    expect(msgs(setup([['forced-induction', 'Blouch'], ['tune', 'Accessport|WRX']]).issues)).toMatch(/stock clutch will likely slip/);
  });
});

describe('buildStats', () => {
  it('adds power, multiplies wheel weight by qty and sums cost', () => {
    const { stats } = setup([['tune', 'Accessport|WRX'], ['wheels', 'RPF1|18x9.5 +38|5x114.3']]);
    expect(stats.hp).toBeGreaterThan(wrx.stockHp);
    expect(stats.weightDelta).toBeLessThan(0);
    expect(stats.partCount).toBe(5);
    expect(stats.partsCost).toBeGreaterThan(0);
  });
});
