import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getVehicles } from '../api';
import { load, save } from '../lib/storage';
import type { Vehicle } from '../types';

interface VehicleCtx {
  vehicles: Vehicle[];
  vehicle: Vehicle | null;
  setVehicleId: (id: string | null) => void;
}

const Ctx = createContext<VehicleCtx | null>(null);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setId] = useState<string | null>(() => load('carps.vehicle', null));

  useEffect(() => {
    getVehicles().then(setVehicles);
  }, []);

  const value = useMemo<VehicleCtx>(
    () => ({
      vehicles,
      vehicle: vehicles.find((v) => v.id === vehicleId) ?? null,
      setVehicleId: (id) => {
        setId(id);
        save('carps.vehicle', id);
      },
    }),
    [vehicles, vehicleId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVehicle() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useVehicle must be used inside VehicleProvider');
  return ctx;
}

export const vehicleLabel = (v: Vehicle) => `${v.year} ${v.make} ${v.model}`;
export const vehicleFull = (v: Vehicle) => `${v.year} ${v.make} ${v.model} ${v.trim} (${v.chassis})`;
