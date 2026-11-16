import { Link, NavLink } from 'react-router-dom';
import { ShieldCheck, LockKeyhole, WifiOff } from 'lucide-react';
export function Header() {
  return <header className="site-header"><div className="header-inner">
    <Link className="brand" to="/"><span className="brand-icon"><ShieldCheck size={22}/></span><span><strong>ЕТИЧНИЙ ВИБІР</strong><small>Симулятор етичних дилем у секторі безпеки та оборони</small></span></Link>
    <nav aria-label="Основна навігація" className="top-nav"><NavLink to="/" end>Головна</NavLink><NavLink to="/scenarios">Сценарії</NavLink></nav>
    <div className="header-badges"><span className="pill teal"><LockKeyhole size={14}/> Без збору персональних даних</span><span className="pill gold"><WifiOff size={14}/> Локальний режим</span></div>
  </div></header>;
}
