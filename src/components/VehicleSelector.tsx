import { useEffect, useState } from 'react';
import { useVehicle, vehicleLabel } from '../context/VehicleContext';

const uniq = <T,>(xs: T[]) => [...new Set(xs)];

/** Cascading Year → Make → Model → Engine picker. */
export function VehicleSelector({ compact = false }: { compact?: boolean }) {
  const { vehicles, vehicle, setVehicleId } = useVehicle();
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  useEffect(() => {
    if (vehicle) {
      setYear(String(vehicle.year));
      setMake(vehicle.make);
      setModel(vehicle.model);
    }
  }, [vehicle]);

  const years = uniq(vehicles.map((v) => v.year)).sort((a, b) => b - a);
  const makes = uniq(vehicles.filter((v) => String(v.year) === year).map((v) => v.make)).sort();
  const models = uniq(
    vehicles.filter((v) => String(v.year) === year && v.make === make).map((v) => v.model),
  ).sort();
  const engines = vehicles.filter((v) => String(v.year) === year && v.make === make && v.model === model);

  if (compact && vehicle) {
    return (
      <div className="vehicle-chip">
        <span aria-hidden>🚗</span>
        <span>
          {vehicleLabel(vehicle)} <small>{vehicle.engine}</small>
        </span>
        <button className="link" onClick={() => setVehicleId(null)}>
          Change
        </button>
      </div>
    );
  }

  return (
    <div className={`vehicle-selector ${compact ? 'compact' : ''}`}>
      <select aria-label="Year" value={year} onChange={(e) => { setYear(e.target.value); setMake(''); setModel(''); }}>
        <option value="">Year</option>
        {years.map((y) => <option key={y}>{y}</option>)}
      </select>
      <select aria-label="Make" value={make} disabled={!year} onChange={(e) => { setMake(e.target.value); setModel(''); }}>
        <option value="">Make</option>
        {makes.map((m) => <option key={m}>{m}</option>)}
      </select>
      <select aria-label="Model" value={model} disabled={!make} onChange={(e) => {
        const m = e.target.value;
        setModel(m);
        const options = vehicles.filter((v) => String(v.year) === year && v.make === make && v.model === m);
        if (options.length === 1) setVehicleId(options[0].id);
      }}>
        <option value="">Model</option>
        {models.map((m) => <option key={m}>{m}</option>)}
      </select>
      <select aria-label="Engine" value={vehicle && engines.some((e) => e.id === vehicle.id) ? vehicle.id : ''} disabled={!model} onChange={(e) => setVehicleId(e.target.value || null)}>
        <option value="">Engine</option>
        {engines.map((v) => <option key={v.id} value={v.id}>{v.engine}</option>)}
      </select>
    </div>
  );
}
