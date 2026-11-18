import { Link, useParams } from 'react-router-dom';
import { getCategory, getPart } from '../api';
import { Difficulty, EmissionsBadge, FitBadge, FitReasons, Gain, WeightDelta } from '../components/Badges';
import { PriceTable } from '../components/PriceTable';
import { Stars } from '../components/Stars';
import { useBuild } from '../context/BuildContext';
import { useVehicle, vehicleLabel } from '../context/VehicleContext';
import { formatPrice } from '../lib/pricing';
import { useAsync } from '../lib/useAsync';

export function PartPage() {
  const { partId } = useParams<{ partId: string }>();
  const { vehicle } = useVehicle();
  const { active, setPart } = useBuild();
  const { data, loading } = useAsync(async () => {
    const part = await getPart(partId!, vehicle?.id);
    const category = part && (await getCategory(part.category));
    return { part, category };
  }, [partId, vehicle?.id]);

  if (loading && !data) return <div className="container"><p>Loading…</p></div>;
  const part = data?.part;
  const category = data?.category;
  if (!part || !category) {
    return <div className="container"><h1>Part not found</h1><Link to="/">Back to categories</Link></div>;
  }
  const inBuild = active.items[part.category]?.partId === part.id;
  const perf = part.perf;
  const specLabel = (k: string) => category.specColumns.find((s) => s.key === k)?.label ?? k.replace(/([A-Z])/g, ' $1');

  return (
    <div className="container">
      <nav className="breadcrumb">
        <Link to="/">Browse</Link> / <Link to={`/parts/${category.id}`}>{category.name}</Link> / {part.partNumber}
      </nav>
      <div className="part-head">
        <div className="part-image" aria-hidden>{category.icon}</div>
        <div className="part-info">
          <p className="muted">{part.brand}</p>
          <h1>{part.name}</h1>
          <p className="mono muted">Part #{part.partNumber}</p>
          <Stars rating={part.rating} count={part.reviewCount} />
          {vehicle && part.fit && (
            <div className={`fit-box fit-box-${part.fit.status}`}>
              <FitBadge fit={part.fit} /> <span>for your {vehicleLabel(vehicle)} {vehicle.trim} ({vehicle.chassis})</span>
              <FitReasons fit={part.fit} />
            </div>
          )}
          <dl className="specs">
            {Object.entries(part.specs).map(([k, v]) => (
              <div key={k}>
                <dt>{specLabel(k)}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="part-buy">
          <p className="muted">Best price</p>
          <p className="big-price">{formatPrice(part.lowestPrice)}</p>
          <p className="muted">at {part.lowestRetailer?.name}{category.defaultQty > 1 && <> · each</>}</p>
          {inBuild ? (
            <Link to="/build" className="btn">✓ In “{active.name}”</Link>
          ) : (
            <button className="btn btn-primary" onClick={() => setPart(part.category, part.id)}>
              Add to “{active.name}”
            </button>
          )}
        </div>
      </div>

      {perf && (
        <section className="perf-panel">
          <div><span className="stat-label">Est. power</span><Gain value={perf.hpGain} /></div>
          <div><span className="stat-label">Est. torque</span><Gain value={perf.tqGain} unit="lb-ft" /></div>
          <div><span className="stat-label">Weight{category.defaultQty > 1 ? ' (each)' : ''}</span><WeightDelta value={perf.weightDelta} /></div>
          <div><span className="stat-label">Emissions</span><EmissionsBadge value={perf.emissions} /></div>
          <div><span className="stat-label">Install</span><span><Difficulty level={perf.difficulty} /> <span className="muted small">~{perf.laborHours} hr</span></span></div>
          <div><span className="stat-label">ECU tune</span>{perf.requiresTune ? <span className="needs-tune">Required</span> : <span className="muted">Not required</span>}</div>
        </section>
      )}

      <h2>Price comparison</h2>
      <PriceTable part={part} />
      <p className="muted small">Prices are for one unit. Gains are typical manufacturer-style estimates on an otherwise stock car.</p>
    </div>
  );
}
