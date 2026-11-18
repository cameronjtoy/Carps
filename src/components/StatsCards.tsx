import type { BuildStats } from '../lib/buildStats';
import { LABOR_RATE } from '../lib/buildStats';
import { formatPrice } from '../lib/pricing';
import type { Vehicle } from '../types';

export function StatsCards({ stats, vehicle }: { stats: BuildStats; vehicle: Vehicle | null }) {
  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-label">Est. power</span>
        <span className="stat-value">{vehicle ? `${stats.hp} hp` : '—'}</span>
        {stats.hpGain > 0 && <span className="stat-delta gain-pos">+{stats.hpGain} over stock</span>}
      </div>
      <div className="stat">
        <span className="stat-label">Est. torque</span>
        <span className="stat-value">{vehicle ? `${stats.torque} lb-ft` : '—'}</span>
        {stats.tqGain > 0 && <span className="stat-delta gain-pos">+{stats.tqGain} over stock</span>}
      </div>
      <div className="stat">
        <span className="stat-label">Curb weight</span>
        <span className="stat-value">{vehicle ? `${stats.weight.toLocaleString()} lb` : '—'}</span>
        {stats.weightDelta !== 0 && (
          <span className={`stat-delta ${stats.weightDelta < 0 ? 'gain-pos' : 'gain-neg'}`}>
            {stats.weightDelta > 0 ? '+' : ''}{stats.weightDelta} lb
          </span>
        )}
      </div>
      <div className="stat">
        <span className="stat-label">Power-to-weight</span>
        <span className="stat-value">{stats.lbPerHp ?? '—'}<small> lb/hp</small></span>
      </div>
      <div className="stat stat-money">
        <span className="stat-label">Parts</span>
        <span className="stat-value">{formatPrice(stats.partsCost)}</span>
        <span className="stat-delta muted">{stats.partCount} item{stats.partCount === 1 ? '' : 's'}, best prices</span>
      </div>
      <div className="stat stat-money">
        <span className="stat-label">Est. install</span>
        <span className="stat-value">{formatPrice(stats.laborCost)}</span>
        <span className="stat-delta muted">{stats.laborHours} hrs @ ${LABOR_RATE}/hr</span>
      </div>
    </div>
  );
}
