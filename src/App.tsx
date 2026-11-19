import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ScenarioOverviewPage } from './pages/ScenarioOverviewPage';
import { ScenarioPlayPage } from './pages/ScenarioPlayPage';
import { GroupSessionPage } from './pages/GroupSessionPage';

export type AppLang = 'uk' | 'en';

export function useAppLanguage() {
  const [lang, setLang] = useState<AppLang>(() => {
    try {
      return window.localStorage.getItem('app_lang') === 'en' ? 'en' : 'uk';
    } catch {
      return 'uk';
    }
  });

  useEffect(() => {
    const syncLang = () => {
      try {
        setLang(window.localStorage.getItem('app_lang') === 'en' ? 'en' : 'uk');
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', syncLang);
    window.addEventListener('app-lang-changed', syncLang);
    return () => {
      window.removeEventListener('storage', syncLang);
      window.removeEventListener('app-lang-changed', syncLang);
    };
  }, []);

  const changeLang = (next: AppLang) => {
    setLang(next);
    try {
      window.localStorage.setItem('app_lang', next);
      window.dispatchEvent(new Event('app-lang-changed'));
    } catch {
      // ignore
    }
  };

  return { lang, setLang: changeLang };
}

export function App() {
  const { lang } = useAppLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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
            <Route path="/scenarios/:id/group" element={<GroupSessionPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;