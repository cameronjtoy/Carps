import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCategory, getParts } from '../api';
import { FilterSidebar } from '../components/FilterSidebar';
import { PartsTable } from '../components/PartsTable';
import { useVehicle, vehicleLabel } from '../context/VehicleContext';
import { emptyFilters, matchesFilters, type TableFilters } from '../lib/pricing';
import { useAsync } from '../lib/useAsync';
import type { CategoryId } from '../types';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: CategoryId }>();
  const { vehicle } = useVehicle();
  const [filters, setFilters] = useState<TableFilters>(emptyFilters);
  const [fitsOnly, setFitsOnly] = useState(true);

  const { data, loading } = useAsync(async () => {
    const category = await getCategory(categoryId!);
    const parts = category ? await getParts({ category: category.id, vehicleId: vehicle?.id }) : [];
    return { category, parts };
  }, [categoryId, vehicle?.id]);

  const parts = data?.parts ?? [];
  const brands = useMemo(() => [...new Set(parts.map((p) => p.brand))].sort(), [parts]);
  const priceCeiling = useMemo(
    () => Math.ceil(Math.max(10, ...parts.map((p) => p.lowestPrice ?? 0))),
    [parts],
  );
  const visible = parts
    .filter((p) => !(vehicle && fitsOnly) || p.fitsSelectedVehicle)
    .filter((p) => matchesFilters(p, filters));

  if (loading && !data) return <div className="container"><p>Loading…</p></div>;
  if (!data?.category) {
    return <div className="container"><h1>Category not found</h1><Link to="/">Back to categories</Link></div>;
  }

  const { category } = data;
  return (
    <div className="container">
      <nav className="breadcrumb"><Link to="/">Browse</Link> / {category.name}</nav>
      <div className="page-head">
        <h1>{category.icon} {category.name}</h1>
        <p className="muted">
          {visible.length} of {parts.length} parts
          {vehicle && fitsOnly && <> · fitting {vehicleLabel(vehicle)}</>}
          {!vehicle && <> · select a vehicle to check fitment</>}
        </p>
      </div>
      <div className="browse-layout">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          brands={brands}
          priceCeiling={priceCeiling}
          fitsOnly={fitsOnly}
          onFitsOnlyChange={setFitsOnly}
          hasVehicle={!!vehicle}
        />
        <div className="browse-main">
          <PartsTable category={category} parts={visible} />
        </div>
      </div>
    </div>
  );
}
