import { Link } from 'react-router-dom';
import type { FeaturedBuild } from '../types';
import { vehicles } from '../data/vehicles';

export function FeaturedCard({ build }: { build: FeaturedBuild }) {
  const v = vehicles.find((x) => x.id === build.vehicleId);
  const n = Object.keys(build.items).length;
  return (
    <Link to={`/builds/${build.slug}`} className="featured-card">
      <span className="goal-tag">{build.goal}</span>
      <h3>{build.name}</h3>
      {v && <p className="muted">{v.year} {v.make} {v.model} {v.trim} · {v.chassis}</p>}
      <p>{build.summary}</p>
      <p className="muted small">{n} parts · by {build.author}</p>
    </Link>
  );
}
