import { Link, NavLink } from 'react-router-dom';
import { useBuild } from '../context/BuildContext';
import { VehicleSelector } from './VehicleSelector';

export function Header() {
  const { count } = useBuild();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={28} height={28} />
          <span>Carps</span>
        </Link>
        <nav className="main-nav">
          <NavLink to="/" end>Browse</NavLink>
          <NavLink to="/builds">Builds</NavLink>
          <NavLink to="/tools/fitment">Fitment</NavLink>
          <NavLink to="/build" className="nav-build">
            My Build {count > 0 && <span className="badge">{count}</span>}
          </NavLink>
        </nav>
        <div className="header-vehicle">
          <VehicleSelector compact />
        </div>
      </div>
      <div className="demo-banner">
        Proof of concept — prices, part numbers, specs and gains are sample data.
      </div>
    </header>
  );
}
