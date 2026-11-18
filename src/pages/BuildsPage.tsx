import { Link, useNavigate, useParams } from 'react-router-dom';
import { getFeaturedBuild, getFeaturedBuilds } from '../api';
import { FeaturedCard } from '../components/FeaturedCard';
import { useBuild } from '../context/BuildContext';
import { useVehicle, vehicleLabel } from '../context/VehicleContext';
import { useAsync } from '../lib/useAsync';
import { useBuildItems } from '../lib/useBuildItems';
import { ReadOnlyBuild, useCatalog } from './BuildPage';

export function BuildsPage() {
  const { vehicle } = useVehicle();
  const { data } = useAsync(getFeaturedBuilds, []);
  const mine = data?.filter((b) => b.vehicleId === vehicle?.id) ?? [];
  const rest = data?.filter((b) => b.vehicleId !== vehicle?.id) ?? [];
  return (
    <div className="container">
      <div className="page-head">
        <h1>Featured builds</h1>
        <p className="muted">Sample builds to show how parts come together. Clone one and make it yours.</p>
      </div>
      {mine.length > 0 && vehicle && (
        <>
          <h2>For your {vehicleLabel(vehicle)}</h2>
          <div className="featured-grid">{mine.map((b) => <FeaturedCard key={b.slug} build={b} />)}</div>
          <h2>Other platforms</h2>
        </>
      )}
      <div className="featured-grid">{rest.map((b) => <FeaturedCard key={b.slug} build={b} />)}</div>
    </div>
  );
}

export function FeaturedBuildPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { createBuild } = useBuild();
  const { vehicles } = useVehicle();
  const catalog = useCatalog();
  const { data: fb, loading } = useAsync(() => getFeaturedBuild(slug!), [slug]);
  const build = fb ? { id: fb.slug, name: fb.name, goal: fb.goal, vehicleId: fb.vehicleId, carbState: false, items: fb.items } : null;
  const { data: items } = useBuildItems(build);

  if (loading || !catalog || (build && !items)) return <div className="container"><p>Loading…</p></div>;
  if (!fb || !build || !items) return <div className="container"><h1>Build not found</h1><Link to="/builds">All builds</Link></div>;
  const v = vehicles.find((x) => x.id === fb.vehicleId);

  return (
    <>
      <div className="container"><nav className="breadcrumb"><Link to="/builds">Builds</Link> / {fb.name}</nav></div>
      <ReadOnlyBuild
        title={fb.name}
        subtitle={`${fb.goal} build · ${v ? `${vehicleLabel(v)} ${v.trim} (${v.chassis})` : ''} · by ${fb.author}`}
        build={build}
        items={items}
        catalog={catalog}
        action={
          <button className="btn btn-primary" onClick={() => { createBuild({ name: fb.name, goal: fb.goal, vehicleId: fb.vehicleId, items: fb.items, carbState: false }); navigate('/build'); }}>
            Clone to my builds
          </button>
        }
      >
        <p>{fb.summary}</p>
      </ReadOnlyBuild>
    </>
  );
}
