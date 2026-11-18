import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getCategories, getSections } from '../api';
import { BuildTable } from '../components/BuildTable';
import { CompatPanel } from '../components/CompatPanel';
import { StatsCards } from '../components/StatsCards';
import { VehicleSpecs } from '../components/VehicleSpecs';
import { decodeBuild, encodeBuild, GOALS, useBuild } from '../context/BuildContext';
import { useVehicle, vehicleLabel } from '../context/VehicleContext';
import { buildStats } from '../lib/buildStats';
import { checkBuild } from '../lib/compat';
import { useAsync } from '../lib/useAsync';
import { useBuildItems } from '../lib/useBuildItems';
import type { Build, BuildGoal } from '../types';

export function BuildPage() {
  const [params] = useSearchParams();
  const shared = params.get('share');
  if (shared) return <SharedBuild code={shared} />;
  return <MyBuild />;
}

function useCatalog() {
  return useAsync(async () => ({ sections: await getSections(), categories: await getCategories() }), []).data;
}

function MyBuild() {
  const { builds, active, setActive, createBuild, updateBuild, deleteBuild, removePart, setQty, clear } = useBuild();
  const { vehicles, vehicle: browsing, setVehicleId } = useVehicle();
  const catalog = useCatalog();
  const { data: items } = useBuildItems(active);
  const [copied, setCopied] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const vehicle = vehicles.find((v) => v.id === active.vehicleId) ?? null;

  useEffect(() => {
    setRenaming(false);
  }, [active.id]);

  if (!catalog || !items) return <div className="container"><p>Loading…</p></div>;

  const issues = checkBuild(active, vehicle, items);
  const stats = buildStats(active, vehicle, items);
  const hasParts = Object.keys(active.items).length > 0;
  const shareUrl = `${location.origin}${location.pathname}#/build?share=${encodeBuild(active)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt('Copy this link', shareUrl);
    }
  };

  return (
    <div className="container">
      <div className="build-bar">
        <label className="sr-only" htmlFor="build-select">Active build</label>
        <select id="build-select" value={active.id} onChange={(e) => setActive(e.target.value)}>
          {builds.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button className="btn btn-sm" onClick={() => createBuild()}>+ New build</button>
        <button className="btn btn-sm" onClick={() => createBuild({ ...active, name: `${active.name} (copy)` })}>Duplicate</button>
        {builds.length > 1 && (
          <button className="btn btn-sm" onClick={() => confirm(`Delete “${active.name}”?`) && deleteBuild(active.id)}>Delete</button>
        )}
      </div>

      <div className="page-head build-head">
        <div className="build-title">
          {renaming ? (
            <form onSubmit={(e) => { e.preventDefault(); setRenaming(false); }}>
              <input className="rename" autoFocus value={active.name} onChange={(e) => updateBuild({ name: e.target.value })} onBlur={() => setRenaming(false)} aria-label="Build name" />
            </form>
          ) : (
            <h1>
              {active.name} <button className="link small" onClick={() => setRenaming(true)}>Rename</button>
            </h1>
          )}
          <div className="build-meta">
            <label>
              Goal{' '}
              <select value={active.goal} onChange={(e) => updateBuild({ goal: e.target.value as BuildGoal })}>
                {GOALS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </label>
            <label className="check">
              <input type="checkbox" checked={active.carbState} onChange={(e) => updateBuild({ carbState: e.target.checked })} />
              I live in California / a CARB state
            </label>
          </div>
          {vehicle ? (
            <p className="muted">
              For a {vehicleLabel(vehicle)} {vehicle.trim} ({vehicle.chassis})
              {browsing && browsing.id !== vehicle.id && (
                <> · you're browsing a {vehicleLabel(browsing)} — <button className="link" onClick={() => setVehicleId(vehicle.id)}>switch to this car</button> or <button className="link" onClick={() => updateBuild({ vehicleId: browsing.id })}>move build to {browsing.model}</button></>
              )}
            </p>
          ) : (
            <p className="muted">Select a vehicle in the header to run fitment checks.</p>
          )}
        </div>
        <div className="list-actions">
          <button className="btn" onClick={copy} disabled={!hasParts}>{copied ? 'Link copied!' : 'Share link'}</button>
          <button className="btn" onClick={() => confirm('Remove every part from this build?') && clear()} disabled={!hasParts}>Clear</button>
        </div>
      </div>

      <CompatPanel issues={issues} hasParts={hasParts} />
      <StatsCards stats={stats} vehicle={vehicle} />

      <div className="build-layout">
        <BuildTable build={active} {...catalog} items={items} issues={issues} editable onRemove={removePart} onQty={setQty} />
        {vehicle && <VehicleSpecs vehicle={vehicle} compact />}
      </div>
      <p className="muted small">Power figures are estimates: bolt-on gains are stacked with diminishing returns and assume a healthy, otherwise stock car. Totals use each part's best in-stock price before tax and shipping.</p>
    </div>
  );
}

function SharedBuild({ code }: { code: string }) {
  const decoded = decodeBuild(code);
  const navigate = useNavigate();
  const { createBuild } = useBuild();
  const { vehicles } = useVehicle();
  const catalog = useCatalog();
  const build: Build | null = decoded ? { ...decoded, id: 'shared' } : null;
  const { data: items } = useBuildItems(build);

  if (!build) return <div className="container"><h1>That share link is broken</h1><Link to="/build">Go to my build</Link></div>;
  if (!catalog || !items) return <div className="container"><p>Loading…</p></div>;
  const vehicle = vehicles.find((v) => v.id === build.vehicleId) ?? null;

  return (
    <ReadOnlyBuild
      title={build.name}
      subtitle={vehicle ? `Shared ${build.goal.toLowerCase()} build for a ${vehicleLabel(vehicle)} ${vehicle.trim} (${vehicle.chassis})` : 'Shared build'}
      build={build}
      items={items}
      catalog={catalog}
      action={<button className="btn btn-primary" onClick={() => { createBuild(decoded!); navigate('/build'); }}>Save to my builds</button>}
    />
  );
}

export function ReadOnlyBuild({ title, subtitle, build, items, catalog, action, children }: {
  title: string;
  subtitle: string;
  build: Build;
  items: NonNullable<ReturnType<typeof useBuildItems>['data']>;
  catalog: NonNullable<ReturnType<typeof useCatalog>>;
  action: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { vehicles } = useVehicle();
  const vehicle = vehicles.find((v) => v.id === build.vehicleId) ?? null;
  const issues = checkBuild(build, vehicle, items);
  return (
    <div className="container">
      <div className="page-head build-head">
        <div>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
        <div className="list-actions">{action}</div>
      </div>
      <CompatPanel issues={issues} hasParts />
      <StatsCards stats={buildStats(build, vehicle, items)} vehicle={vehicle} />
      <div className="build-layout">
        <BuildTable build={build} {...catalog} items={items} issues={issues} editable={false} compact />
        {vehicle && <VehicleSpecs vehicle={vehicle} compact />}
      </div>
    </div>
  );
}

export { useCatalog };
