import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ScenarioOverviewPage } from './pages/ScenarioOverviewPage';
export default function App(){return <BrowserRouter><Header/><Routes><Route path="/" element={<HomePage/>}/><Route path="/scenarios" element={<CatalogPage/>}/><Route path="/scenarios/:id" element={<ScenarioOverviewPage/>}/><Route path="*" element={<main className="page-wrap"><h1>Сторінку не знайдено</h1></main>}/></Routes></BrowserRouter>}
