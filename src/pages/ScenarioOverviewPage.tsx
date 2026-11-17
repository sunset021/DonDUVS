import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock3, Download, Info, Play, Scale, ShieldAlert, Users } from 'lucide-react';
import { findScenario } from '../scenarios';

export function ScenarioOverviewPage() {
  const { id } = useParams(); 
  const scenario = findScenario(id ?? '');
  
  if (!scenario) {
    return (
      <main className="page-wrap">
        <h1>Сценарій не знайдено</h1>
        <Link to="/scenarios" className="text-link">Повернутися до каталогу</Link>
      </main>
    );
  }

  const downloadJson = () => { 
    const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: 'application/json' }); 
    const url = URL.createObjectURL(blob); 
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = `${scenario.id}.json`; 
    a.click(); 
    URL.revokeObjectURL(url); 
  };

  return (
    <main className="page-wrap">
      <Link to="/scenarios" className="back-link">
        <ArrowLeft size={16}/> До каталогу
      </Link>
      <article className="overview panel">
        <div className="chip-row">
          <span className="pill gold">ID: {scenario.id.toUpperCase()}</span>
          <span className="pill muted">Статус: інтерактивний прототип</span>
        </div>
        <h1>{scenario.title}</h1>
        <p className="overview-lead">{scenario.description}</p>
        <div className="divider"/>
        <div className="conflict-box">
          <div className="value-box value-a">
            <small>{scenario.conflict.leftLabel}</small>
            <strong>{scenario.conflict.left}</strong>
          </div>
          <span className="versus">VS</span>
          <div className="value-box value-b">
            <small>{scenario.conflict.rightLabel}</small>
            <strong>{scenario.conflict.right}</strong>
          </div>
        </div>
        <div className="info-grid">
          <section className="info-card">
            <h2><Users size={17}/> ЦІЛЬОВА АУДИТОРІЯ</h2>
            <ul>{scenario.audience.map(x => <li key={x}>{x}</li>)}</ul>
          </section>
          <section className="info-card">
            <h2><BookOpen size={17}/> НОРМАТИВНО-ПРАВОВА БАЗА</h2>
            <p>Закон України «Про запобігання корупції», Дисциплінарний статут НПУ, Правила етичної поведінки.</p>
            <span className="source-note"><ShieldAlert size={15}/> Перевірено та інтегровано</span>
          </section>
        </div>
        <h2 className="section-label">ФОРМАТ ПРОХОДЖЕННЯ</h2>
        <div className="mode-grid">
          <div className="mode-card selected">
            <strong>Індивідуальне проходження</strong>
            <span>Самостійний вибір дій та аналіз наслідків.</span>
            <small>Готово до запуску</small>
          </div>
          <div className="mode-card disabled">
            <strong>Груповий режим (з викладачем)</strong>
            <span>Анонімне голосування та обговорення рішень.</span>
            <small>У розробці</small>
          </div>
        </div>
        <div className="notice">
          <Info size={18}/>
          <div>
            <strong>Маркер безпеки даних</strong>
            <p>Симулятор є повністю анонімним освітнім інструментом і не збирає персональні дані користувачів.</p>
          </div>
        </div>
        <div className="overview-actions">
          <Link to={`/scenarios/${scenario.id}/play`} className="btn btn-primary">
            <Play size={18}/> Почати проходження
          </Link>
          <button className="btn btn-secondary" onClick={downloadJson}>
            <Download size={18}/> Завантажити JSON
          </button>
          <span className="meta"><Clock3 size={15}/> ~{scenario.estimatedMinutes} хв</span>
        </div>
      </article>
      <p className="footnote"><Scale size={14}/> Оцінюються навчальні рішення, а не особистість користувача.</p>
    </main>
  );
}
