import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { ListProvider } from './context/ListContext';
import { VehicleProvider } from './context/VehicleContext';
import { CategoryPage } from './pages/CategoryPage';
import { Home } from './pages/Home';
import { ListPage } from './pages/ListPage';
import { PartPage } from './pages/PartPage';

// HashRouter: GitHub Pages can't rewrite deep links to index.html.
export default function App() {
  return (
    <HashRouter>
      <VehicleProvider>
        <ListProvider>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/parts/:categoryId" element={<CategoryPage />} />
              <Route path="/part/:partId" element={<PartPage />} />
              <Route path="/list" element={<ListPage />} />
              <Route path="*" element={<div className="container"><h1>Page not found</h1><Link to="/">Go home</Link></div>} />
            </Routes>
          </main>
          <footer className="site-footer container muted">
            Carps POC · Prices are sample data · Not affiliated with any retailer
          </footer>
        </ListProvider>
      </VehicleProvider>
    </HashRouter>
  );
}
