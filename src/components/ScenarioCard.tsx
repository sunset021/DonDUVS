import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, ShieldAlert } from 'lucide-react';
import type { ScenarioOverview } from '../types/scenario';
export function ScenarioCard({ scenario }: { scenario: ScenarioOverview }) {
  return <article className="scenario-card"><div className="card-top"><span className="eyebrow">{scenario.category}</span><span className="meta"><Clock3 size={14}/> {scenario.estimatedMinutes} хв</span></div><h3>{scenario.title}</h3><p>{scenario.subtitle}</p><div className="card-footer"><span className="pill muted">{scenario.difficulty}</span>{scenario.available ? <Link className="text-link" to={`/scenarios/${scenario.id}`}>Переглянути <ArrowUpRight size={17}/></Link> : <span className="muted-text"><ShieldAlert size={14}/> У розробці</span>}</div></article>;
}
