import { getCategories, getParts } from '../api';
import { CategoryCard } from '../components/CategoryCard';
import { VehicleSelector } from '../components/VehicleSelector';
import { useVehicle, vehicleLabel } from '../context/VehicleContext';
import { useAsync } from '../lib/useAsync';

export function Home() {
  const { vehicle } = useVehicle();
  const { data } = useAsync(async () => {
    const [cats, parts] = await Promise.all([
      getCategories(),
      getParts({ vehicleId: vehicle?.id, fitsOnly: true }),
    ]);
    return cats.map((c) => {
      const inCat = parts.filter((p) => p.category === c.id);
      const priced = inCat.map((p) => p.lowestPrice).filter((n): n is number => n !== null);
      return { category: c, count: inCat.length, from: priced.length ? Math.min(...priced) : null };
    });
  }, [vehicle?.id]);

  return (
    <div className="container">
      <section className="hero">
        <h1>Compare car part prices in one place</h1>
        <p>Pick your vehicle, browse filters, oil, brakes and more, and see who has the best price.</p>
        <div className="hero-picker">
          <VehicleSelector />
          {vehicle && <p className="muted">Showing parts that fit your <strong>{vehicleLabel(vehicle)} {vehicle.engine}</strong></p>}
        </div>
      </section>
      <section>
        <h2>Categories</h2>
        <div className="category-grid">
          {data?.map((d) => <CategoryCard key={d.category.id} {...d} />)}
        </div>
      </section>
    </div>
  );
}
