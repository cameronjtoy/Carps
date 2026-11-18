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
  return <CategoryView key={categoryId} categoryId={categoryId!} />;
}

function CategoryView({ categoryId }: { categoryId: CategoryId }) {
  const { vehicle } = useVehicle();
  const [filters, setFilters] = useState<TableFilters>(emptyFilters);
  const [fitsOnly, setFitsOnly] = useState(true);

  const { data, loading } = useAsync(async () => {
    const category = await getCategory(categoryId);
    const parts = category ? await getParts({ category: category.id, vehicleId: vehicle?.id }) : [];
    return { category, parts };
  }, [categoryId, vehicle?.id]);

  const all = data?.parts ?? [];
  const pool = useMemo(() => all.filter((p) => !(vehicle && fitsOnly) || p.fit?.status !== 'no'), [all, vehicle, fitsOnly]);
  const priceCeiling = useMemo(() => Math.ceil(Math.max(10, ...pool.map((p) => p.lowestPrice ?? 0))), [pool]);
  const visible = pool.filter((p) => matchesFilters(p, filters));

  if (loading && !data) return <div className="container"><p>Loading…</p></div>;
  if (!data?.category) {
    return <div className="container"><h1>Category not found</h1><Link to="/">Back to categories</Link></div>;
  }

  const { category } = data;
  const hidden = all.length - pool.length;
  return (
    <div className="container">
      <nav className="breadcrumb"><Link to="/">Browse</Link> / {category.name}</nav>
      <div className="page-head">
        <h1>{category.icon} {category.name}</h1>
        <p className="muted">
          {visible.length} shown
          {vehicle && fitsOnly && hidden > 0 && <> · {hidden} hidden that don't fit your {vehicleLabel(vehicle)} {vehicle.chassis}</>}
          {!vehicle && <> · <strong>select a vehicle</strong> to check bolt pattern, offset and fitment</>}
        </p>
      </div>
      <div className="browse-layout">
        <FilterSidebar
          category={category}
          parts={pool}
          filters={filters}
          onChange={setFilters}
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
