import type { PartWithPrices } from '../types';
import { formatPrice } from '../lib/pricing';

export function PriceTable({ part }: { part: PartWithPrices }) {
  const bestId = part.prices.find((p) => p.inStock && p.price === part.lowestPrice)?.retailerId;
  return (
    <div className="table-wrap">
      <table className="parts-table price-table">
        <thead>
          <tr>
            <th>Retailer</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Shipping</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {part.prices.map((p) => (
            <tr key={p.retailerId} className={p.retailerId === bestId ? 'best' : undefined}>
              <td data-label="Retailer"><strong>{p.retailer.name}</strong>{p.retailerId === bestId && <span className="best-tag">Best price</span>}</td>
              <td data-label="Price"><strong>{formatPrice(p.price)}</strong></td>
              <td data-label="Availability">{p.inStock ? <span className="in-stock">In stock</span> : <span className="oos">Out of stock</span>}</td>
              <td data-label="Shipping" className="muted">{p.retailer.shippingNote}</td>
              <td data-label="Updated" className="muted">{new Date(p.updatedAt).toLocaleDateString()}</td>
              <td><a className="btn btn-sm" href={p.url} target="_blank" rel="noopener noreferrer">View ↗</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
