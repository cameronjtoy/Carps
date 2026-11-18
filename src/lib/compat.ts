// PCPartPicker-style compatibility engine for a car build.
import type { Build, CategoryId, PartWithPrices, Vehicle } from '../types';
import { diameterChangePct, parseTire, tireWidthRange, wheelPosition } from './fitment';
import { buildStats } from './buildStats';

export type IssueLevel = 'error' | 'warning' | 'info';

export interface Issue {
  level: IssueLevel;
  message: string;
  categories: CategoryId[];
}

const label = (p: PartWithPrices) => `${p.brand} ${p.name.split(' — ')[0]}`;
const inch = (n: number) => `${n}"`;

export function checkBuild(build: Build, vehicle: Vehicle | null, items: Partial<Record<CategoryId, PartWithPrices>>): Issue[] {
  const issues: Issue[] = [];
  const add = (level: IssueLevel, message: string, ...categories: CategoryId[]) => issues.push({ level, message, categories });
  const chosen = Object.entries(items) as [CategoryId, PartWithPrices][];

  if (!vehicle) {
    if (chosen.length) add('info', 'Pick a vehicle for this build to run fitment checks.');
    return issues;
  }

  const wheel = items.wheels?.fitRule?.kind === 'wheel' ? items.wheels.fitRule : null;
  const tire = items.tires?.fitRule?.kind === 'tire' ? items.tires.fitRule : null;
  const stockTire = parseTire(vehicle.stockTire)!;
  const effectiveRim = wheel?.diameter ?? vehicle.stockWheel.diameter;
  const effectiveWidth = wheel?.width ?? vehicle.stockWheel.width;

  // 1. Per-part fitment (wheel/tire/BBK are re-checked below against the build itself)
  for (const [cat, p] of chosen) {
    if (!p.fit) continue;
    // Tires and seats are judged in context below; a BBK only fails here if it's for another car.
    if (cat === 'tires' || cat === 'seats') continue;
    if (cat === 'big-brake-kit' && p.fit.status !== 'no') continue;
    if (p.fit.status === 'no') {
      add('error', `${label(p)} doesn't fit: ${p.fit.reasons.join('; ')}`, cat);
      continue;
    }
    const concerns = p.fit.reasons.filter((r) => !r.startsWith('Needs') && !r.includes('hub-centric') && !r.includes('poke'));
    if (p.fit.status === 'maybe' && concerns.length) add('warning', `${label(p)}: ${concerns.join('; ')}`, cat);
    p.fit.reasons.filter((r) => r.includes('hub-centric')).forEach((r) => add('info', r, cat));
  }

  // 2. Wheels ↔ tires
  if (wheel && !tire && wheel.diameter !== vehicle.stockWheel.diameter) {
    add('warning', `${inch(wheel.diameter)} wheels need ${inch(wheel.diameter)} tires — your stock ${vehicle.stockTire} won't mount.`, 'wheels', 'tires');
  }
  if (tire) {
    if (tire.rim !== effectiveRim) {
      add('error', `${inch(tire.rim)} tires don't mount on ${inch(effectiveRim)} ${wheel ? 'wheels in this build' : 'stock wheels'}.`, 'tires', 'wheels');
    } else {
      const [lo, hi] = tireWidthRange(effectiveWidth);
      if (tire.width < lo || tire.width > hi) {
        add('warning', `${tire.width}mm tires on ${effectiveWidth}" wide wheels — recommended ${lo}–${hi}mm.`, 'tires', 'wheels');
      }
    }
    const pct = diameterChangePct(stockTire, tire);
    if (Math.abs(pct) > 5) add('error', `Tire diameter ${pct > 0 ? '+' : ''}${pct.toFixed(1)}% vs stock — will rub and throw off ABS/speedo.`, 'tires');
    else if (Math.abs(pct) > 3) add('warning', `Tire diameter ${pct > 0 ? '+' : ''}${pct.toFixed(1)}% vs stock — speedometer will read off.`, 'tires');
  }
  if (wheel) {
    const pos = wheelPosition(vehicle.stockWheel, wheel);
    const lowered = !!items.coilovers || !!items.springs;
    if (pos.outer > 15) {
      add('warning', lowered
        ? `Wheels poke ${pos.outer}mm more than stock on a lowered car — plan on rolling fenders or adding camber.`
        : `Wheels poke ${pos.outer}mm more than stock — may need fender roll / camber.`, 'wheels', 'coilovers', 'springs');
    }
  }

  // 3. Big brake kit vs wheel diameter
  const bbk = items['big-brake-kit'];
  if (bbk?.fitRule?.kind === 'bbk' && bbk.fit?.status !== 'no') {
    if (effectiveRim < bbk.fitRule.minWheelDiameter) {
      add('error', `${label(bbk)} needs ${inch(bbk.fitRule.minWheelDiameter)}+ wheels; ${wheel ? 'selected wheels are' : 'stock wheels are'} ${inch(effectiveRim)}.`, 'big-brake-kit', 'wheels');
    }
  }

  // 4. Suspension conflicts
  if (items.coilovers && items.springs) {
    add('error', 'Coilovers include their own springs — remove the lowering springs.', 'coilovers', 'springs');
  }

  // 5. Tuning requirements
  const fi = items['forced-induction'];
  const tuneIncluded = fi?.specs.tune === 'Included';
  const hasTune = !!items.tune || tuneIncluded;
  for (const [cat, p] of chosen) {
    if (p.perf?.requiresTune && !hasTune) add('warning', `${label(p)} requires an ECU tune — add one under ECU Tunes.`, cat, 'tune');
  }
  if (tuneIncluded && items.tune) {
    add('info', `${label(fi!)} ships with its own calibration — make sure ${label(items.tune)} supports the kit.`, 'tune', 'forced-induction');
  }

  // 6. Drivetrain
  const stats = buildStats(build, vehicle, items);
  if (items.clutch && vehicle.transmission === 'Automatic') {
    add('error', `This ${vehicle.model} is automatic-only — a clutch kit doesn't apply.`, 'clutch');
  }
  if (vehicle.transmission !== 'Automatic') {
    const rated = items.clutch ? parseFloat(String(items.clutch.specs.torque)) : null;
    if (rated && stats.torque > rated) {
      add('warning', `Estimated ${stats.torque} lb-ft exceeds the clutch rating of ${rated} lb-ft.`, 'clutch');
    } else if (!items.clutch && stats.torque > vehicle.stockTq * 1.2) {
      add('warning', `Estimated ${stats.torque} lb-ft (+${stats.torque - vehicle.stockTq}) — the stock clutch will likely slip. Consider a clutch upgrade.`, 'clutch');
    }
  }
  if (stats.hp > vehicle.stockHp * 1.25 && !bbk && !items['brake-pads']) {
    add('info', `+${stats.hp - vehicle.stockHp} hp — consider performance pads or a big brake kit.`, 'brake-pads', 'big-brake-kit');
  }

  // 7. Emissions
  const offRoad = chosen.filter(([, p]) => p.perf?.emissions === 'off-road');
  if (offRoad.length) {
    if (build.carbState) {
      offRoad.forEach(([cat, p]) => add('error', `${label(p)} is off-road only — not street legal in CARB states.`, cat));
    } else {
      add('warning', `${offRoad.length} part${offRoad.length > 1 ? 's are' : ' is'} off-road only (${offRoad.map(([, p]) => p.brand).join(', ')}) — may fail emissions inspection.`, ...offRoad.map(([c]) => c));
    }
  }

  // 8. Seats
  if (items.seats) add('info', `${label(items.seats)} needs ${vehicle.model}-specific seat rails / side mounts.`, 'seats');

  const order: Record<IssueLevel, number> = { error: 0, warning: 1, info: 2 };
  return issues.sort((a, b) => order[a.level] - order[b.level]);
}
