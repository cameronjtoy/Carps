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
import { useList } from '../context/ListContext';
import { Stars } from './Stars';

const col = createColumnHelper<PartWithPrices>();

export function PartsTable({ category, parts }: { category: Category; parts: PartWithPrices[] }) {
  const { list, setPart } = useList();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'price', desc: false }]);
  const selectedId = list[category.id];

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
              {p.fitsSelectedVehicle === true && <span className="fit yes">✓ Fits</span>}
              {p.fitsSelectedVehicle === false && <span className="fit no">Doesn't fit</span>}
            </div>
          );
        },
      }),
      ...category.specColumns.map((s) =>
        col.accessor((p) => p.specs[s.key] ?? '', { id: `spec-${s.key}`, header: s.label }),
      ),
      col.accessor('rating', {
        header: 'Rating',
        cell: ({ row }) => <Stars rating={row.original.rating} count={row.original.reviewCount} />,
      }),
      col.accessor((p) => p.prices.length, { id: 'sellers', header: 'Sellers' }),
      col.accessor((p) => p.lowestPrice ?? Infinity, {
        id: 'price',
        header: 'Best price',
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="price-cell">
              <strong>{formatPrice(p.lowestPrice)}</strong>
              <span className="muted">{p.lowestRetailer?.name}</span>
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
            <span className="added">✓ In list</span>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setPart(category.id, row.original.id)}>
              Add
            </button>
          ),
      }),
    ],
    [category, selectedId, setPart],
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
              <tr key={r.id} className={r.original.id === selectedId ? 'selected' : undefined}>
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
