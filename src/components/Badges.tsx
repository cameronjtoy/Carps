import type { Emissions, FitResult } from '../types';
import { emissionsLabel } from '../lib/pricing';

export function FitBadge({ fit }: { fit: FitResult | null }) {
  if (!fit) return null;
  const text = fit.status === 'yes' ? '✓ Fits' : fit.status === 'maybe' ? '⚠ Check fit' : '✗ No fit';
  const tip = fit.reasons.join('\n');
  return (
    <span className={`fit ${fit.status}`} title={tip || undefined}>
      {text}
    </span>
  );
}

export function FitReasons({ fit }: { fit: FitResult | null }) {
  if (!fit || !fit.reasons.length) return null;
  return (
    <ul className="fit-reasons">
      {fit.reasons.map((r) => <li key={r}>{r}</li>)}
    </ul>
  );
}

export function EmissionsBadge({ value }: { value: Emissions }) {
  return <span className={`emis emis-${value}`}>{emissionsLabel[value]}</span>;
}

export function Difficulty({ level }: { level: number }) {
  const labels = ['', 'Bolt-on', 'Easy', 'Moderate', 'Advanced', 'Shop job'];
  return (
    <span className="difficulty" title={`${labels[level]} (${level}/5)`}>
      <span className="wrenches" aria-hidden>{'🔧'.repeat(level)}</span>
      <span className="sr-only">{labels[level]}</span>
    </span>
  );
}

export function Gain({ value, unit = 'hp' }: { value: number; unit?: string }) {
  if (!value) return <span className="muted">—</span>;
  return <span className={value > 0 ? 'gain-pos' : 'gain-neg'}>{value > 0 ? '+' : ''}{value} {unit}</span>;
}

export function WeightDelta({ value }: { value: number }) {
  if (!value) return <span className="muted">—</span>;
  return <span className={value < 0 ? 'gain-pos' : 'gain-neg'}>{value > 0 ? '+' : ''}{value} lb</span>;
}
