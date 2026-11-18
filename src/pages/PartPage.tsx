import { Link, useParams } from 'react-router-dom';
import { getCategory, getPart } from '../api';
import { PriceTable } from '../components/PriceTable';
import { Stars } from '../components/Stars';
import { useList } from '../context/ListContext';
import { useVehicle, vehicleLabel } from '../context/VehicleContext';
import { formatPrice } from '../lib/pricing';
import { useAsync } from '../lib/useAsync';

export function PartPage() {
  const { partId } = useParams<{ partId: string }>();
  const { vehicle } = useVehicle();
  const { list, setPart } = useList();
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
  const inList = list[part.category] === part.id;

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
          {vehicle && (
            <p className={`fit ${part.fitsSelectedVehicle ? 'yes' : 'no'}`}>
              {part.fitsSelectedVehicle ? '✓ Fits' : '✗ Does not fit'} your {vehicleLabel(vehicle)} {vehicle.engine}
            </p>
          )}
          <dl className="specs">
            {Object.entries(part.specs).map(([k, v]) => (
              <div key={k}>
                <dt>{category.specColumns.find((s) => s.key === k)?.label ?? k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="part-buy">
          <p className="muted">Best price</p>
          <p className="big-price">{formatPrice(part.lowestPrice)}</p>
          <p className="muted">at {part.lowestRetailer?.name}</p>
          {inList ? (
            <Link to="/list" className="btn">✓ In your list</Link>
          ) : (
            <button className="btn btn-primary" onClick={() => setPart(part.category, part.id)}>Add to list</button>
          )}
        </div>
      </div>
      <h2>Price comparison</h2>
      <PriceTable part={part} />
    </div>
  );
}
