import { Link } from 'react-router-dom';
import type { Build, Category, CategoryId, PartWithPrices, Section } from '../types';
import { formatPrice } from '../lib/pricing';
import type { Issue } from '../lib/compat';
import { Gain } from './Badges';

interface Props {
  build: Build;
  sections: Section[];
  categories: Category[];
  items: Partial<Record<CategoryId, PartWithPrices>>;
  issues: Issue[];
  editable: boolean;
  onRemove?: (c: CategoryId) => void;
  onQty?: (c: CategoryId, qty: number) => void;
  /** Hide empty slots (read-only views) */
  compact?: boolean;
}

export function BuildTable({ build, sections, categories, items, issues, editable, onRemove, onQty, compact }: Props) {
  const flagged = (c: CategoryId) => {
    const lv = issues.filter((i) => i.categories.includes(c) && items[c]).map((i) => i.level);
    return lv.includes('error') ? 'error' : lv.includes('warning') ? 'warning' : null;
  };

  return (
    <div className="table-wrap">
      <table className="parts-table build-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Selection</th>
            <th>Gain</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Where</th>
            <th></th>
          </tr>
        </thead>
        {sections.map((s) => {
          const cats = categories.filter((c) => c.section === s.id && (!compact || items[c.id]));
          if (!cats.length) return null;
          return (
            <tbody key={s.id}>
              <tr className="section-row">
                <th colSpan={7}>{s.name}</th>
              </tr>
              {cats.map((c) => {
                const part = items[c.id];
                const item = build.items[c.id];
                const flag = flagged(c.id);
                return (
                  <tr key={c.id} className={flag ? `row-${flag}` : undefined}>
                    <td data-label="Component" className="col-component">
                      <Link to={`/parts/${c.id}`}>{c.icon} {c.name}</Link>
                    </td>
                    {part && item ? (
                      <>
                        <td data-label="Selection" className="col-name">
                          <div className="name-cell">
                            <Link to={`/part/${part.id}`}><strong>{part.brand}</strong> {part.name}</Link>
                            <span className="muted mono">#{part.partNumber}</span>
                          </div>
                        </td>
                        <td data-label="Gain">{part.perf ? <Gain value={part.perf.hpGain} /> : <span className="muted">—</span>}</td>
                        <td data-label="Qty">
                          {editable && c.defaultQty > 1 ? (
                            <input className="qty" type="number" min={1} max={8} value={item.qty} aria-label={`${c.name} quantity`}
                              onChange={(e) => onQty?.(c.id, Number(e.target.value) || 1)} />
                          ) : (
                            item.qty
                          )}
                        </td>
                        <td data-label="Price">
                          <strong>{formatPrice(part.lowestPrice === null ? null : part.lowestPrice * item.qty)}</strong>
                          {item.qty > 1 && <div className="muted small">{formatPrice(part.lowestPrice)} ea</div>}
                        </td>
                        <td data-label="Where">
                          {part.lowestRetailer && (
                            <a href={part.prices.find((p) => p.retailerId === part.lowestRetailer!.id)?.url} target="_blank" rel="noopener noreferrer">
                              {part.lowestRetailer.name} ↗
                            </a>
                          )}
                        </td>
                        <td className="col-remove">
                          {editable && <button className="link" onClick={() => onRemove?.(c.id)} aria-label={`Remove ${c.name}`}>✕</button>}
                        </td>
                      </>
                    ) : (
                      <td colSpan={6} data-label="" className="col-empty">
                        {editable && <Link to={`/parts/${c.id}`} className="btn btn-sm">+ Choose {c.name.toLowerCase()}</Link>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}
