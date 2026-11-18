import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { load, save } from '../lib/storage';
import type { CategoryId } from '../types';

/** One chosen part per category, like a PCPartPicker build. */
export type PartList = Partial<Record<CategoryId, string>>;

interface ListCtx {
  list: PartList;
  setPart: (category: CategoryId, partId: string) => void;
  removePart: (category: CategoryId) => void;
  replaceList: (list: PartList) => void;
  clear: () => void;
  count: number;
}

const Ctx = createContext<ListCtx | null>(null);
const KEY = 'carps.list';

export function ListProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<PartList>(() => load(KEY, {}));

  const value = useMemo<ListCtx>(() => {
    const update = (next: PartList) => {
      setList(next);
      save(KEY, next);
    };
    return {
      list,
      setPart: (c, id) => update({ ...list, [c]: id }),
      removePart: (c) => {
        const next = { ...list };
        delete next[c];
        update(next);
      },
      replaceList: update,
      clear: () => update({}),
      count: Object.keys(list).length,
    };
  }, [list]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useList() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useList must be used inside ListProvider');
  return ctx;
}
