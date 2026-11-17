import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ScenarioOverviewPage } from './pages/ScenarioOverviewPage';
import ScenarioPlayPage from './pages/ScenarioPlayPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scenarios" element={<CatalogPage />} />
            <Route path="/scenarios/:id" element={<ScenarioOverviewPage />} />
            <Route path="/scenarios/:id/play" element={<ScenarioPlayPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}