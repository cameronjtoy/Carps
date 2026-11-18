import { Link, NavLink } from 'react-router-dom';
import { useList } from '../context/ListContext';
import { VehicleSelector } from './VehicleSelector';

export function Header() {
  const { count } = useList();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={28} height={28} />
          <span>Carps</span>
        </Link>
        <nav className="main-nav">
          <NavLink to="/" end>Browse</NavLink>
          <NavLink to="/list">
            My List {count > 0 && <span className="badge">{count}</span>}
          </NavLink>
        </nav>
        <div className="header-vehicle">
          <VehicleSelector compact />
        </div>
      </div>
      <div className="demo-banner">
        Proof of concept — prices shown are sample data, not live retailer quotes.
      </div>
    </header>
  );
}
