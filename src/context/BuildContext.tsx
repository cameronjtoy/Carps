import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { categories } from '../data/catalog';
import { load, save } from '../lib/storage';
import type { Build, BuildGoal, CategoryId } from '../types';
import { useVehicle } from './VehicleContext';

interface BuildCtx {
  builds: Build[];
  active: Build;
  setActive: (id: string) => void;
  createBuild: (init?: Partial<Omit<Build, 'id'>>) => Build;
  updateBuild: (patch: Partial<Omit<Build, 'id' | 'items'>>) => void;
  deleteBuild: (id: string) => void;
  setPart: (category: CategoryId, partId: string, qty?: number) => void;
  setQty: (category: CategoryId, qty: number) => void;
  removePart: (category: CategoryId) => void;
  clear: () => void;
  count: number;
}

const Ctx = createContext<BuildCtx | null>(null);
const KEY = 'carps.builds';
const ACTIVE_KEY = 'carps.activeBuild';

const newId = () => `b-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const defaultQty = (c: CategoryId) => categories.find((x) => x.id === c)?.defaultQty ?? 1;

function blank(vehicleId: string | null, n = 1): Build {
  return { id: newId(), name: n === 1 ? 'My Build' : `Build ${n}`, goal: 'Daily', vehicleId, carbState: false, items: {} };
}

function initialBuilds(vehicleId: string | null): Build[] {
  const stored = load<Build[]>(KEY, []);
  if (stored.length) return stored;
  // Migrate the single list from the first version of the POC.
  const legacy = load<Partial<Record<CategoryId, string>>>('carps.list', {});
  const b = blank(vehicleId);
  for (const [cat, partId] of Object.entries(legacy) as [CategoryId, string][]) b.items[cat] = { partId, qty: defaultQty(cat) };
  return [b];
}

export function BuildProvider({ children }: { children: ReactNode }) {
  const { vehicle, setVehicleId } = useVehicle();
  const [builds, setBuilds] = useState<Build[]>(() => initialBuilds(load('carps.vehicle', null)));
  const [activeId, setActiveId] = useState<string>(() => load(ACTIVE_KEY, builds[0].id));
  const active = builds.find((b) => b.id === activeId) ?? builds[0];

  // An empty build follows whichever vehicle you're browsing for.
  useEffect(() => {
    if (vehicle && !Object.keys(active.items).length && active.vehicleId !== vehicle.id) {
      persist(builds.map((b) => (b.id === active.id ? { ...b, vehicleId: vehicle.id } : b)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle?.id, active.id]);

  function persist(next: Build[]) {
    setBuilds(next);
    save(KEY, next);
  }

  const value = useMemo<BuildCtx>(() => {
    const patchActive = (fn: (b: Build) => Build) => persist(builds.map((b) => (b.id === active.id ? fn(b) : b)));
    const activate = (id: string) => {
      setActiveId(id);
      save(ACTIVE_KEY, id);
      const b = builds.find((x) => x.id === id);
      if (b?.vehicleId) setVehicleId(b.vehicleId);
    };
    return {
      builds,
      active,
      setActive: activate,
      createBuild: (init = {}) => {
        const b: Build = { ...blank(init.vehicleId ?? vehicle?.id ?? null, builds.length + 1), ...init, id: newId() };
        persist([...builds, b]);
        setActiveId(b.id);
        save(ACTIVE_KEY, b.id);
        if (b.vehicleId) setVehicleId(b.vehicleId);
        return b;
      },
      updateBuild: (patch) => patchActive((b) => ({ ...b, ...patch })),
      deleteBuild: (id) => {
        const rest = builds.filter((b) => b.id !== id);
        const next = rest.length ? rest : [blank(vehicle?.id ?? null)];
        persist(next);
        if (id === active.id) activate(next[0].id);
      },
      setPart: (category, partId, qty) =>
        patchActive((b) => ({
          ...b,
          vehicleId: b.vehicleId ?? vehicle?.id ?? null,
          items: { ...b.items, [category]: { partId, qty: qty ?? b.items[category]?.qty ?? defaultQty(category) } },
        })),
      setQty: (category, qty) =>
        patchActive((b) => {
          const item = b.items[category];
          return item ? { ...b, items: { ...b.items, [category]: { ...item, qty: Math.max(1, Math.min(8, qty)) } } } : b;
        }),
      removePart: (category) =>
        patchActive((b) => {
          const items = { ...b.items };
          delete items[category];
          return { ...b, items };
        }),
      clear: () => patchActive((b) => ({ ...b, items: {} })),
      count: Object.keys(active.items).length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builds, active, vehicle?.id]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBuild() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBuild must be used inside BuildProvider');
  return ctx;
}

export const GOALS: BuildGoal[] = ['Daily', 'Canyon / Street', 'Track', 'Drift', 'Show', 'Off-road'];

/** Compact, URL-safe encoding of a build for share links. */
export function encodeBuild(b: Build): string {
  const payload = { n: b.name, g: b.goal, v: b.vehicleId, c: b.carbState ? 1 : 0, i: Object.entries(b.items).map(([c, it]) => [c, it!.partId, it!.qty]) };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeBuild(s: string): Omit<Build, 'id'> | null {
  try {
    const json = decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
    const p = JSON.parse(json);
    const items: Build['items'] = {};
    for (const [c, partId, qty] of p.i as [CategoryId, string, number][]) items[c] = { partId, qty };
    return { name: String(p.n), goal: p.g, vehicleId: p.v ?? null, carbState: !!p.c, items };
  } catch {
    return null;
  }
}
