import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import type { Category, PartWithPrices } from '../types';
import { formatPrice } from '../lib/pricing';
import { useBuild } from '../context/BuildContext';
import { Stars } from './Stars';
import { Difficulty, EmissionsBadge, FitBadge, Gain, WeightDelta } from './Badges';

const col = createColumnHelper<PartWithPrices>();
const varies = (parts: PartWithPrices[], fn: (p: PartWithPrices) => unknown) => new Set(parts.map(fn)).size > 1;

export function PartsTable({ category, parts }: { category: Category; parts: PartWithPrices[] }) {
  const { active, setPart } = useBuild();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'price', desc: false }]);
  const selectedId = active.items[category.id]?.partId;

  const columns = useMemo(
    () => [
      col.accessor((p) => `${p.brand} ${p.name}`, {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="name-cell">
              <Link to={`/part/${p.id}`}><strong>{p.brand}</strong> {p.name}</Link>
              <span className="muted mono">#{p.partNumber}</span>
              <FitBadge fit={p.fit} />
            </div>
          );
        },
      }),
      ...category.specColumns.map((s) =>
        col.accessor((p) => p.specs[s.key] ?? '', {
          id: `spec-${s.key}`,
          header: s.label,
          sortingFn: 'alphanumeric',
        }),
      ),
      // Only show perf columns that actually tell parts apart in this list.
      ...(parts.some((p) => p.perf?.hpGain)
        ? [
            col.accessor((p) => p.perf?.hpGain ?? 0, {
              id: 'hp',
              header: 'Est. gain',
              sortDescFirst: true,
              cell: ({ row }) => (
                <div className="stack">
                  <Gain value={row.original.perf?.hpGain ?? 0} />
                  {row.original.perf?.tqGain ? <span className="muted small">+{row.original.perf.tqGain} lb-ft</span> : null}
                </div>
              ),
            }),
          ]
        : []),
      ...(parts.some((p) => p.perf?.weightDelta)
        ? [
            col.accessor((p) => p.perf?.weightDelta ?? 0, {
              id: 'weight',
              header: category.defaultQty > 1 ? 'Δ vs OEM' : 'Δ Weight',
              cell: ({ getValue }) => <WeightDelta value={getValue()} />,
            }),
          ]
        : []),
      ...(varies(parts, (p) => `${p.perf?.emissions}${p.perf?.requiresTune}`)
        ? [
            col.accessor((p) => p.perf?.emissions ?? '', {
              id: 'emissions',
              header: 'Legal',
              cell: ({ row }) => (
                <div className="stack">
                  {row.original.perf && <EmissionsBadge value={row.original.perf.emissions} />}
                  {row.original.perf?.requiresTune && <span className="needs-tune">Needs tune</span>}
                </div>
              ),
            }),
          ]
        : []),
      ...(varies(parts, (p) => p.perf?.difficulty)
        ? [
            col.accessor((p) => p.perf?.difficulty ?? 0, {
              id: 'difficulty',
              header: 'Install',
              cell: ({ getValue }) => (getValue() ? <Difficulty level={getValue()} /> : null),
            }),
          ]
        : []),
      col.accessor('rating', {
        header: 'Rating',
        sortDescFirst: true,
        cell: ({ row }) => <Stars rating={row.original.rating} count={row.original.reviewCount} />,
      }),
      col.accessor((p) => p.lowestPrice ?? Infinity, {
        id: 'price',
        header: 'Best price',
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="price-cell">
              <strong>{formatPrice(p.lowestPrice)}</strong>
              <span className="muted">{p.lowestRetailer?.name}{p.prices.length > 1 && <> · {p.prices.length} stores</>}</span>
              {!p.inStockAnywhere && <span className="oos">Out of stock</span>}
            </div>
          );
        },
      }),
      col.display({
        id: 'add',
        header: '',
        cell: ({ row }) =>
          row.original.id === selectedId ? (
            <Link to="/build" className="added">✓ In build</Link>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setPart(category.id, row.original.id)}>
              Add
            </button>
          ),
      }),
    ],
    [category, selectedId, setPart, parts],
  );

  const table = useReactTable({
    data: parts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  if (!parts.length) return <p className="empty">No parts match these filters.</p>;

  const { pageIndex } = table.getState().pagination;

  return (
    <>
      <div className="table-wrap">
        <table className="parts-table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sort = h.column.getIsSorted();
                  return (
                    <th key={h.id} className={`col-${h.column.id}`} aria-sort={sort ? (sort === 'asc' ? 'ascending' : 'descending') : undefined}>
                      {h.column.getCanSort() ? (
                        <button className="sort" onClick={h.column.getToggleSortingHandler()}>
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          <span className="sort-ind">{sort === 'asc' ? '▲' : sort === 'desc' ? '▼' : '↕'}</span>
                        </button>
                      ) : (
                        flexRender(h.column.columnDef.header, h.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id} className={[r.original.id === selectedId && 'selected', r.original.fit?.status === 'no' && 'nofit'].filter(Boolean).join(' ') || undefined}>
                {r.getVisibleCells().map((c) => (
                  <td key={c.id} className={`col-${c.column.id}`} data-label={typeof c.column.columnDef.header === 'string' ? c.column.columnDef.header : ''}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="pagination">
          <button className="btn btn-sm" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>‹ Prev</button>
          <span>Page {pageIndex + 1} of {table.getPageCount()}</span>
          <button className="btn btn-sm" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next ›</button>
        </div>
      )}
    </>
  );
}

