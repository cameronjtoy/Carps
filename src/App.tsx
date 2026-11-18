import { useEffect } from 'react';
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { BuildProvider } from './context/BuildContext';
import { VehicleProvider } from './context/VehicleContext';
import { BuildPage } from './pages/BuildPage';
import { BuildsPage, FeaturedBuildPage } from './pages/BuildsPage';
import { CategoryPage } from './pages/CategoryPage';
import { FitmentTool } from './pages/FitmentTool';
import { Home } from './pages/Home';
import { PartPage } from './pages/PartPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// HashRouter: GitHub Pages can't rewrite deep links to index.html.
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <VehicleProvider>
        <BuildProvider>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/parts/:categoryId" element={<CategoryPage />} />
              <Route path="/part/:partId" element={<PartPage />} />
              <Route path="/build" element={<BuildPage />} />
              <Route path="/list" element={<BuildPage />} />
              <Route path="/builds" element={<BuildsPage />} />
              <Route path="/builds/:slug" element={<FeaturedBuildPage />} />
              <Route path="/tools/fitment" element={<FitmentTool />} />
              <Route path="*" element={<div className="container"><h1>Page not found</h1><Link to="/">Go home</Link></div>} />
            </Routes>
          </main>
          <footer className="site-footer container muted">
            Carps POC · Prices, specs and gains are sample data · Not affiliated with any brand or retailer
          </footer>
        </BuildProvider>
      </VehicleProvider>
    </HashRouter>
  );
}
