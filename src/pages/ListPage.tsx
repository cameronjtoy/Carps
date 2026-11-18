import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getCategories, getPartsByIds } from '../api';
import { useList, type PartList } from '../context/ListContext';
import { useVehicle, vehicleLabel } from '../context/VehicleContext';
import { formatPrice, listTotal } from '../lib/pricing';
import { useAsync } from '../lib/useAsync';

export function ListPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { list: myList, removePart, replaceList, clear } = useList();
  const { vehicle } = useVehicle();
  const [copied, setCopied] = useState(false);

  // A shared list arrives as ?parts=p-001,p-020 and is shown read-only until saved.
  const sharedIds = params.get('parts')?.split(',').filter(Boolean);
  const isShared = !!sharedIds;

  const { data } = useAsync(async () => {
    const ids = sharedIds ?? (Object.values(myList).filter(Boolean) as string[]);
    const [categories, parts] = await Promise.all([getCategories(), getPartsByIds(ids, vehicle?.id)]);
    return { categories, parts };
  }, [params.get('parts'), JSON.stringify(myList), vehicle?.id]);

  if (!data) return <div className="container"><p>Loading…</p></div>;

  const rows = data.categories.map((c) => ({
    category: c,
    part: data.parts.find((p) => p.category === c.id),
  }));
  const chosen = rows.map((r) => r.part);
  const total = listTotal(chosen);
  const shareUrl = `${location.origin}${location.pathname}#/list?parts=${data.parts.map((p) => p.id).join(',')}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt('Copy this link', shareUrl);
    }
  };

  const saveShared = () => {
    const next: PartList = {};
    data.parts.forEach((p) => (next[p.category] = p.id));
    replaceList(next);
    navigate('/list');
  };

  return (
    <div className="container">
      <div className="page-head list-head">
        <div>
          <h1>{isShared ? 'Shared parts list' : 'My parts list'}</h1>
          <p className="muted">
            {vehicle ? <>For your {vehicleLabel(vehicle)} {vehicle.engine}</> : 'Select a vehicle to check fitment'}
          </p>
        </div>
        <div className="list-actions">
          {isShared ? (
            <button className="btn btn-primary" onClick={saveShared}>Save as my list</button>
          ) : (
            <>
              <button className="btn" onClick={copy} disabled={!data.parts.length}>{copied ? 'Link copied!' : 'Share link'}</button>
              <button className="btn" onClick={clear} disabled={!data.parts.length}>Clear</button>
            </>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table className="parts-table list-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Selection</th>
              <th>Best price</th>
              <th>Where</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ category, part }) => (
              <tr key={category.id}>
                <td data-label="Component"><Link to={`/parts/${category.id}`}>{category.icon} {category.name}</Link></td>
                {part ? (
                  <>
                    <td data-label="Selection">
                      <div className="name-cell">
                        <Link to={`/part/${part.id}`}><strong>{part.brand}</strong> {part.name}</Link>
                        <span className="muted mono">#{part.partNumber}</span>
                        {part.fitsSelectedVehicle === false && <span className="fit no">Doesn't fit</span>}
                      </div>
                    </td>
                    <td data-label="Best price"><strong>{formatPrice(part.lowestPrice)}</strong></td>
                    <td data-label="Where">
                      {part.lowestRetailer && (
                        <a href={part.prices.find((p) => p.retailerId === part.lowestRetailer!.id)?.url} target="_blank" rel="noopener noreferrer">
                          {part.lowestRetailer.name} ↗
                        </a>
                      )}
                    </td>
                    <td>{!isShared && <button className="link" onClick={() => removePart(category.id)} aria-label={`Remove ${category.name}`}>✕</button>}</td>
                  </>
                ) : (
                  <td colSpan={4} data-label="Selection">
                    {!isShared && <Link to={`/parts/${category.id}`} className="btn btn-sm">+ Choose {category.name.toLowerCase()}</Link>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}><strong>Total</strong> <span className="muted">(best price per part, before tax &amp; shipping)</span></td>
              <td colSpan={3}><strong className="big-price">{formatPrice(total)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
