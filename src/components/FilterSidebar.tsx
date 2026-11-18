import type { TableFilters } from '../lib/pricing';
import { formatPrice } from '../lib/pricing';

interface Props {
  filters: TableFilters;
  onChange: (f: TableFilters) => void;
  brands: string[];
  priceCeiling: number;
  fitsOnly: boolean;
  onFitsOnlyChange: (v: boolean) => void;
  hasVehicle: boolean;
}

export function FilterSidebar({ filters, onChange, brands, priceCeiling, fitsOnly, onFitsOnlyChange, hasVehicle }: Props) {
  const set = (patch: Partial<TableFilters>) => onChange({ ...filters, ...patch });
  const maxPrice = filters.maxPrice ?? priceCeiling;

  return (
    <aside className="filters">
      <div className="filter-group">
        <label className="filter-title" htmlFor="search">Search</label>
        <input id="search" type="search" placeholder="Brand, name or part #" value={filters.search} onChange={(e) => set({ search: e.target.value })} />
      </div>

      {hasVehicle && (
        <div className="filter-group">
          <label className="check">
            <input type="checkbox" checked={fitsOnly} onChange={(e) => onFitsOnlyChange(e.target.checked)} />
            Only parts that fit my vehicle
          </label>
        </div>
      )}

      <div className="filter-group">
        <label className="filter-title" htmlFor="price">Max price: {formatPrice(maxPrice)}</label>
        <input id="price" type="range" min={0} max={priceCeiling} step={1} value={maxPrice}
          onChange={(e) => {
            const v = Number(e.target.value);
            set({ maxPrice: v >= priceCeiling ? null : v });
          }} />
      </div>

      <div className="filter-group">
        <label className="check">
          <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => set({ inStockOnly: e.target.checked })} />
          In stock only
        </label>
      </div>

      <div className="filter-group">
        <label className="filter-title" htmlFor="rating">Minimum rating</label>
        <select id="rating" value={filters.minRating} onChange={(e) => set({ minRating: Number(e.target.value) })}>
          <option value={0}>Any</option>
          <option value={3.5}>3.5+</option>
          <option value={4}>4.0+</option>
          <option value={4.5}>4.5+</option>
        </select>
      </div>

      <fieldset className="filter-group">
        <legend className="filter-title">Brand</legend>
        {brands.map((b) => (
          <label key={b} className="check">
            <input type="checkbox" checked={filters.brands.includes(b)}
              onChange={(e) => set({ brands: e.target.checked ? [...filters.brands, b] : filters.brands.filter((x) => x !== b) })} />
            {b}
          </label>
        ))}
      </fieldset>
    </aside>
  );
}
