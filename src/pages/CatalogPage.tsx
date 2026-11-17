import { scenarios } from '../scenarios';
import { ScenarioCard } from '../components/ScenarioCard';
export function CatalogPage() { return <main className="page-wrap"><div className="page-heading"><span className="eyebrow">БІБЛІОТЕКА СЦЕНАРІЇВ</span><h1>Оберіть етичну дилему</h1><p>Кожен сценарій моделює конфлікт цінностей. На цій стадії доступний огляд першого кейсу; інтерактивне проходження буде додано наступним етапом.</p></div><section className="catalog-grid" aria-label="Каталог сценаріїв">{scenarios.map(s=><ScenarioCard key={s.id} scenario={s}/>)}</section></main>; }
