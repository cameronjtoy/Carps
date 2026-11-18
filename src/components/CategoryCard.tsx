import { Link } from 'react-router-dom';
import type { Category } from '../types';
import { formatPrice } from '../lib/pricing';

export function CategoryCard({ category, count, from }: { category: Category; count: number; from: number | null }) {
  return (
    <Link to={`/parts/${category.id}`} className="category-card">
      <span className="category-icon" aria-hidden>{category.icon}</span>
      <div>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
        <p className="muted">
          {count} parts{from !== null && <> · from <strong>{formatPrice(from)}</strong></>}
        </p>
      </div>
    </Link>
  );
}
