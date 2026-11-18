import type { Vehicle } from '../types';
import { vehicleFull } from '../context/VehicleContext';

export function VehicleSpecs({ vehicle, compact }: { vehicle: Vehicle; compact?: boolean }) {
  const w = vehicle.stockWheel;
  const rows: [string, string][] = [
    ['Engine', `${vehicle.engine}`],
    ['Power', `${vehicle.stockHp} hp / ${vehicle.stockTq} lb-ft`],
    ['Drivetrain', `${vehicle.drivetrain} · ${vehicle.transmission}`],
    ['Curb weight', `${vehicle.curbWeight.toLocaleString()} lb`],
    ['Bolt pattern', `${vehicle.boltPattern} · ${vehicle.centerBore}mm CB`],
    ['Stock wheel', `${w.diameter}x${w.width} ${w.offset >= 0 ? '+' : ''}${w.offset}`],
    ['Stock tire', vehicle.stockTire],
  ];
  return (
    <aside className={`vehicle-specs ${compact ? 'compact' : ''}`}>
      <h3>{vehicleFull(vehicle)}</h3>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
