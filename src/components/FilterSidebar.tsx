import type { Category, Emissions, PartWithPrices } from '../types';
import type { TableFilters } from '../lib/pricing';
import { emissionsLabel, formatPrice } from '../lib/pricing';

interface Props {
  category: Category;
  parts: PartWithPrices[];
  filters: TableFilters;
  onChange: (f: TableFilters) => void;
  priceCeiling: number;
  fitsOnly: boolean;
  onFitsOnlyChange: (v: boolean) => void;
  hasVehicle: boolean;
}

const toggle = <T,>(list: T[], v: T, on: boolean) => (on ? [...list, v] : list.filter((x) => x !== v));

function countBy(parts: PartWithPrices[], fn: (p: PartWithPrices) => string | undefined) {
  const m = new Map<string, number>();
  parts.forEach((p) => {
    const k = fn(p);
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  });
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }));
}

export function FilterSidebar({ category, parts, filters, onChange, priceCeiling, fitsOnly, onFitsOnlyChange, hasVehicle }: Props) {
  const set = (patch: Partial<TableFilters>) => onChange({ ...filters, ...patch });
  const maxPrice = filters.maxPrice ?? priceCeiling;
  const brands = countBy(parts, (p) => p.brand);
  const facetKeys = category.specColumns.filter((s) => countBy(parts, (p) => String(p.specs[s.key] ?? '')).length > 1);
  const active =
    filters.search || filters.brands.length || filters.maxPrice !== null || filters.inStockOnly || filters.minRating ||
    Object.values(filters.specs).some((v) => v.length) || filters.emissions.length || filters.noTuneRequired || filters.maxDifficulty < 5;

  return (
    <aside className="filters">
      <details open>
        <summary className="filters-summary">Filters {active ? <button className="link small" onClick={(e) => { e.preventDefault(); onChange({ ...filters, search: '', brands: [], maxPrice: null, inStockOnly: false, minRating: 0, specs: {}, emissions: [], noTuneRequired: false, maxDifficulty: 5 }); }}>Reset</button> : null}</summary>

        <div className="filter-group">
          <label className="filter-title" htmlFor="search">Search</label>
          <input id="search" type="search" placeholder="Brand, name, part #, size…" value={filters.search} onChange={(e) => set({ search: e.target.value })} />
        </div>

        {hasVehicle && (
          <div className="filter-group">
            <label className="check">
              <input type="checkbox" checked={fitsOnly} onChange={(e) => onFitsOnlyChange(e.target.checked)} />
              Hide parts that don't fit
            </label>
          </div>
        )}

        <div className="filter-group">
          <label className="filter-title" htmlFor="price">Max price: {formatPrice(maxPrice)}</label>
          <input id="price" type="range" min={0} max={priceCeiling} step={Math.max(1, Math.round(priceCeiling / 100))} value={maxPrice}
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

        {category.performance && (
          <>
            <fieldset className="filter-group">
              <legend className="filter-title">Emissions</legend>
              {(['carb', '50-state', 'off-road'] as Emissions[]).map((e) => (
                <label key={e} className="check">
                  <input type="checkbox" checked={filters.emissions.includes(e)} onChange={(ev) => set({ emissions: toggle(filters.emissions, e, ev.target.checked) })} />
                  {emissionsLabel[e]}
                </label>
              ))}
              <label className="check">
                <input type="checkbox" checked={filters.noTuneRequired} onChange={(e) => set({ noTuneRequired: e.target.checked })} />
                No tune required
              </label>
            </fieldset>
            <div className="filter-group">
              <label className="filter-title" htmlFor="diff">Max install difficulty</label>
              <select id="diff" value={filters.maxDifficulty} onChange={(e) => set({ maxDifficulty: Number(e.target.value) })}>
                <option value={5}>Any</option>
                <option value={1}>Bolt-on only</option>
                <option value={2}>Easy (driveway)</option>
                <option value={3}>Moderate (jack stands)</option>
                <option value={4}>Advanced</option>
              </select>
            </div>
          </>
        )}

        {facetKeys.map((s) => (
          <fieldset key={s.key} className="filter-group">
            <legend className="filter-title">{s.label}</legend>
            <div className="facet-list">
              {countBy(parts, (p) => String(p.specs[s.key] ?? '')).map(([v, n]) => (
                <label key={v} className="check">
                  <input type="checkbox" checked={(filters.specs[s.key] ?? []).includes(v)}
                    onChange={(e) => set({ specs: { ...filters.specs, [s.key]: toggle(filters.specs[s.key] ?? [], v, e.target.checked) } })} />
                  {v} <span className="muted small">({n})</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="filter-group">
          <label className="filter-title" htmlFor="rating">Minimum rating</label>
          <select id="rating" value={filters.minRating} onChange={(e) => set({ minRating: Number(e.target.value) })}>
            <option value={0}>Any</option>
            <option value={4}>4.0+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </div>

        <fieldset className="filter-group">
          <legend className="filter-title">Brand</legend>
          <div className="facet-list">
            {brands.map(([b, n]) => (
              <label key={b} className="check">
                <input type="checkbox" checked={filters.brands.includes(b)} onChange={(e) => set({ brands: toggle(filters.brands, b, e.target.checked) })} />
                {b} <span className="muted small">({n})</span>
              </label>
            ))}
          </div>
        </fieldset>
      </details>
    </aside>
  );
}
