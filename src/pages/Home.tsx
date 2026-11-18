import { Link } from 'react-router-dom';
import { getCategories, getFeaturedBuilds, getParts, getSections } from '../api';
import { CategoryCard } from '../components/CategoryCard';
import { FeaturedCard } from '../components/FeaturedCard';
import { VehicleSelector } from '../components/VehicleSelector';
import { VehicleSpecs } from '../components/VehicleSpecs';
import { useVehicle } from '../context/VehicleContext';
import { useAsync } from '../lib/useAsync';

export function Home() {
  const { vehicle } = useVehicle();
  const { data } = useAsync(async () => {
    const [sections, cats, parts, featured] = await Promise.all([
      getSections(),
      getCategories(),
      getParts({ vehicleId: vehicle?.id, fitsOnly: true }),
      getFeaturedBuilds(),
    ]);
    const cards = cats.map((c) => {
      const inCat = parts.filter((p) => p.category === c.id);
      const priced = inCat.map((p) => p.lowestPrice).filter((n): n is number => n !== null);
      return { category: c, count: inCat.length, from: priced.length ? Math.min(...priced) : null };
    });
    return { sections, cards, featured };
  }, [vehicle?.id]);

  const featured = data?.featured
    .slice()
    .sort((a, b) => Number(b.vehicleId === vehicle?.id) - Number(a.vehicleId === vehicle?.id))
    .slice(0, 3);

  return (
    <div className="container">
      <section className="hero">
        <div>
          <h1>Plan your build. Check fitment. Compare prices.</h1>
          <p>From oil filters to coilovers and turbo kits: pick your car, see what fits, and find the best price.</p>
          <div className="hero-picker">
            <VehicleSelector />
          </div>
        </div>
        {vehicle && <VehicleSpecs vehicle={vehicle} />}
      </section>

      {data?.sections.map((s) => {
        const cards = data.cards.filter((c) => c.category.section === s.id);
        return (
          <section key={s.id} className="home-section">
            <div className="section-head">
              <h2>{s.name}</h2>
              <span className="muted">{s.blurb}</span>
            </div>
            <div className="category-grid">
              {cards.map((d) => <CategoryCard key={d.category.id} {...d} />)}
            </div>
          </section>
        );
      })}

      <section className="home-section">
        <div className="section-head">
          <h2>Featured builds</h2>
          <Link to="/builds">See all →</Link>
        </div>
        <div className="featured-grid">
          {featured?.map((b) => <FeaturedCard key={b.slug} build={b} />)}
        </div>
      </section>

      <section className="home-section tool-promo">
        <div>
          <h2>Wheel &amp; tire fitment calculator</h2>
          <p className="muted">See how much poke, inner clearance and speedo error a new wheel and tire setup adds compared with stock.</p>
        </div>
        <Link to="/tools/fitment" className="btn btn-primary">Open calculator</Link>
      </section>
    </div>
  );
}
