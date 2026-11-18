import { getPartsByIds } from '../api';
import type { Build, CategoryId, PartWithPrices } from '../types';
import { useAsync } from './useAsync';

/** Resolve a build's part ids to priced parts, checked against the build's vehicle. */
export function useBuildItems(build: Pick<Build, 'items' | 'vehicleId'> | null | undefined) {
  const key = build ? JSON.stringify([build.items, build.vehicleId]) : '';
  return useAsync(async () => {
    if (!build) return {};
    const ids = Object.values(build.items).map((i) => i!.partId);
    const list = await getPartsByIds(ids, build.vehicleId);
    const out: Partial<Record<CategoryId, PartWithPrices>> = {};
    for (const [cat, item] of Object.entries(build.items) as [CategoryId, { partId: string }][]) {
      const p = list.find((x) => x.id === item.partId);
      if (p) out[cat] = p;
    }
    return out;
  }, [key]);
}
