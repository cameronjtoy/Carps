import type { Build, CategoryId, PartWithPrices, Vehicle } from '../types';

export const LABOR_RATE = 130; // $/hr, typical independent performance shop

export interface BuildStats {
  hp: number;
  torque: number;
  weight: number;
  hpGain: number;
  tqGain: number;
  weightDelta: number;
  lbPerHp: number | null;
  partsCost: number;
  laborHours: number;
  laborCost: number;
  partCount: number;
}

/** Bolt-on gains don't stack perfectly; apply diminishing returns past the first 15%. */
function stack(stock: number, gain: number) {
  const free = stock * 0.15;
  return gain <= free ? gain : Math.round(free + (gain - free) * 0.9);
}

export function buildStats(build: Build, vehicle: Vehicle | null, items: Partial<Record<CategoryId, PartWithPrices>>): BuildStats {
  let hpGain = 0;
  let tqGain = 0;
  let weightDelta = 0;
  let partsCost = 0;
  let laborHours = 0;
  let partCount = 0;

  for (const [cat, p] of Object.entries(items) as [CategoryId, PartWithPrices][]) {
    const qty = build.items[cat]?.qty ?? 1;
    partCount += qty;
    partsCost += (p.lowestPrice ?? 0) * qty;
    if (p.perf) {
      hpGain += p.perf.hpGain;
      tqGain += p.perf.tqGain;
      weightDelta += p.perf.weightDelta * qty;
      laborHours += p.perf.laborHours * qty;
    }
  }

  const stockHp = vehicle?.stockHp ?? 0;
  const stockTq = vehicle?.stockTq ?? 0;
  const hp = stockHp + stack(stockHp, hpGain);
  const torque = stockTq + stack(stockTq, tqGain);
  const weight = Math.round((vehicle?.curbWeight ?? 0) + weightDelta);
  laborHours = Math.round(laborHours * 10) / 10;

  return {
    hp,
    torque,
    weight,
    hpGain: hp - stockHp,
    tqGain: torque - stockTq,
    weightDelta: Math.round(weightDelta),
    lbPerHp: vehicle && hp ? Math.round((weight / hp) * 100) / 100 : null,
    partsCost: Math.round(partsCost * 100) / 100,
    laborHours,
    laborCost: Math.round(laborHours * LABOR_RATE),
    partCount,
  };
}
