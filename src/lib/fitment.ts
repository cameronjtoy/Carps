import type { Fitment, FitResult, Part, Vehicle } from '../types';

const MM_PER_IN = 25.4;

export interface TireSize {
  width: number;
  aspect: number;
  rim: number;
}

export function parseTire(size: string): TireSize | null {
  const m = size.match(/(\d{3})\/(\d{2})\s*Z?R(\d{2})/i);
  return m ? { width: +m[1], aspect: +m[2], rim: +m[3] } : null;
}

/** Overall tire diameter in inches. */
export function tireDiameter(t: TireSize): number {
  return t.rim + (2 * t.width * t.aspect) / 100 / MM_PER_IN;
}

/** % change in overall diameter (≈ speedometer error). */
export function diameterChangePct(from: TireSize, to: TireSize): number {
  return ((tireDiameter(to) - tireDiameter(from)) / tireDiameter(from)) * 100;
}

export interface WheelSpec {
  diameter: number;
  width: number;
  offset: number;
}

/**
 * Where the new wheel sits relative to the old one, in mm.
 * inner > 0 → closer to the strut; outer > 0 → more poke past the fender.
 */
export function wheelPosition(from: WheelSpec, to: WheelSpec) {
  const halfOld = (from.width * MM_PER_IN) / 2;
  const halfNew = (to.width * MM_PER_IN) / 2;
  return {
    inner: Math.round(halfNew + to.offset - (halfOld + from.offset)),
    outer: Math.round(halfNew - to.offset - (halfOld - from.offset)),
  };
}

/** Rule-of-thumb tire section width range (mm) for a rim width (in). */
export function tireWidthRange(rimWidth: number): [number, number] {
  return [Math.round(rimWidth * MM_PER_IN - 5), Math.round(rimWidth * MM_PER_IN + 50)];
}

const inch = (n: number) => `${n}"`;

/** Fitment of a single part against a vehicle on its stock wheels. */
export function checkPartFit(part: Part, vehicle: Vehicle, fitments: Fitment[]): FitResult {
  const rule = part.fitRule;
  const listed = fitments.filter((f) => f.partId === part.id);

  if (listed.length && !listed.some((f) => f.vehicleId === vehicle.id)) {
    return { status: 'no', reasons: [`Not listed for the ${vehicle.year} ${vehicle.model} ${vehicle.chassis}`] };
  }

  if (!rule) return { status: 'yes', reasons: [] };

  switch (rule.kind) {
    case 'wheel': {
      if (rule.boltPattern !== vehicle.boltPattern) {
        return { status: 'no', reasons: [`Bolt pattern ${rule.boltPattern} ≠ vehicle ${vehicle.boltPattern}`] };
      }
      if (rule.centerBore < vehicle.centerBore) {
        return { status: 'no', reasons: [`Center bore ${rule.centerBore}mm is smaller than the ${vehicle.centerBore}mm hub`] };
      }
      if (rule.diameter < vehicle.minWheelDiameter) {
        return { status: 'no', reasons: [`${inch(rule.diameter)} won't clear the stock brakes (min ${inch(vehicle.minWheelDiameter)})`] };
      }
      const reasons: string[] = [];
      let status: FitResult['status'] = 'yes';
      const pos = wheelPosition(vehicle.stockWheel, rule);
      if (pos.outer > 15) {
        status = 'maybe';
        reasons.push(`${pos.outer}mm more poke than stock — may need fender roll / camber`);
      }
      if (pos.inner > 12) {
        status = 'maybe';
        reasons.push(`${pos.inner}mm closer to the strut — check inner clearance`);
      }
      if (rule.centerBore > vehicle.centerBore) {
        reasons.push(`Use ${rule.centerBore}→${vehicle.centerBore}mm hub-centric rings`);
      }
      if (rule.diameter !== vehicle.stockWheel.diameter) {
        reasons.push(`Needs ${inch(rule.diameter)} tires (stock is ${inch(vehicle.stockWheel.diameter)})`);
      }
      return { status, reasons };
    }
    case 'tire': {
      const stock = parseTire(vehicle.stockTire)!;
      if (rule.rim < vehicle.minWheelDiameter) {
        return { status: 'no', reasons: [`${inch(rule.rim)} rims won't clear the stock brakes`] };
      }
      const pct = diameterChangePct(stock, rule);
      if (Math.abs(pct) > 5) {
        return { status: 'no', reasons: [`Overall diameter ${pct > 0 ? '+' : ''}${pct.toFixed(1)}% vs stock ${vehicle.stockTire}`] };
      }
      const reasons: string[] = [];
      let status: FitResult['status'] = 'yes';
      if (rule.rim !== stock.rim) {
        status = 'maybe';
        reasons.push(`Needs ${inch(rule.rim)} wheels (stock is ${inch(stock.rim)})`);
      }
      if (Math.abs(pct) > 3) {
        status = 'maybe';
        reasons.push(`Speedo off by ${pct.toFixed(1)}% — may rub`);
      }
      const [lo, hi] = tireWidthRange(vehicle.stockWheel.width);
      if (rule.rim === stock.rim && (rule.width < lo || rule.width > hi)) {
        status = 'maybe';
        reasons.push(`${rule.width}mm is outside the ${lo}–${hi}mm range for stock ${vehicle.stockWheel.width}" wheels`);
      }
      return { status, reasons };
    }
    case 'bbk': {
      if (vehicle.stockWheel.diameter < rule.minWheelDiameter) {
        return { status: 'maybe', reasons: [`Needs ${inch(rule.minWheelDiameter)}+ wheels (stock ${inch(vehicle.stockWheel.diameter)})`] };
      }
      return { status: 'yes', reasons: [`Clears ${inch(rule.minWheelDiameter)}+ wheels`] };
    }
    case 'seat':
      return { status: 'maybe', reasons: ['Universal seat — needs vehicle-specific rails / side mounts'] };
  }
}
