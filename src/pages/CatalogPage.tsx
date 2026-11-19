import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Layers, ShieldAlert } from 'lucide-react';
import { useAppLanguage } from '../App';

interface ScenarioCardItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  accent: 'teal' | 'amber';
}

const CARDS_BY_LANG: Record<'uk' | 'en', ScenarioCardItem[]> = {
  uk: [
    {
      id: 'favor-for-friend',
      tag: 'Конфіденційність',
      title: 'Послуга для знайомого',
      subtitle: 'Конфіденційність, дружба та службовий обов’язок',
      level: 'Початковий',
      duration: '8 хв',
      accent: 'teal',
    },
    {
      id: 'supervisor-pressure',
      tag: 'Академічна доброчесність',
      title: 'Академічна підтримка чи неправомірна вигода',
      subtitle: 'Академічна доброчесність та протидія неправомірній вигоді',
      level: 'Складний',
      duration: '10 хв',
      accent: 'amber',
    },
  ],
  en: [
    {
      id: 'favor-for-friend',
      tag: 'Confidentiality',
      title: 'A Favor for a Friend',
      subtitle: 'Confidentiality, friendship, and duty of office',
      level: 'Foundational',
      duration: '8 min',
      accent: 'teal',
    },
    {
      id: 'supervisor-pressure',
      tag: 'Academic Integrity',
      title: 'Academic Support or Undue Benefit',
      subtitle: 'Academic integrity and countering undue benefit',
      level: 'Advanced',
      duration: '10 min',
      accent: 'amber',
    },
  ],
};

const CATALOG_COPY = {
  uk: {
    eyebrow: 'БІБЛІОТЕКА СЦЕНАРІЇВ',
    titleBefore: 'Оберіть',
    titleAccent: 'етичну дилему',
    lead: 'Кожен сценарій моделює конфлікт цінностей і професійної відповідальності. Оберіть кейс для індивідуального проходження або запуску групового обговорення в аудиторії.',
    view: 'Переглянути',
  },
  en: {
    eyebrow: 'SCENARIO LIBRARY',
    titleBefore: 'Choose an',
    titleAccent: 'ethical dilemma',
    lead: 'Each scenario models a conflict of values and professional accountability. Select a case for individual practice or launch a group discussion in class.',
    view: 'Open case',
  },
} as const;

export function CatalogPage() {
  const { lang } = useAppLanguage();
  const t = CATALOG_COPY[lang];
  const cards = CARDS_BY_LANG[lang];

  return (
    <main className="page-wrap relative py-6 sm:py-10">
      <section
        className="panel relative overflow-hidden rounded-3xl border border-slate-800/90 p-6 sm:p-10 shadow-2xl space-y-8"
        style={{
          backgroundImage: `
            radial-gradient(circle at 85% 15%, rgba(20, 184, 166, 0.16), transparent 42%),
            radial-gradient(circle at 15% 88%, rgba(56, 189, 248, 0.12), transparent 48%),
            linear-gradient(145deg, rgba(7, 13, 25, 0.96) 0%, rgba(12, 23, 43, 0.93) 55%, rgba(6, 11, 22, 0.98) 100%)
          `,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148, 163, 184, 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.16) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 space-y-3">
          <span className="eyebrow inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-teal-300/90 uppercase">
            <Layers size={14} />
            <span>{t.eyebrow}</span>
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t.titleBefore}{' '}
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              {t.titleAccent}
            </span>
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.lead}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((item) => {
            const isAmber = item.accent === 'amber';

            return (
              <Link
                key={item.id}
                to={`/scenarios/${item.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-950/70 p-6 transition-all duration-200 backdrop-blur-md hover:border-teal-400/50 hover:bg-slate-900/85"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-xs font-semibold tracking-wide ${
                        isAmber ? 'text-amber-300' : 'text-teal-300'
                      }`}
                    >
                      {item.tag}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-xs text-slate-300">
                      <Clock size={13} className="text-slate-400" />
                      {item.duration}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-teal-200 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.subtitle}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border ${
                      isAmber
                        ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                        : 'bg-teal-950/40 text-teal-300 border-teal-500/30'
                    }`}
                  >
                    <ShieldAlert size={13} />
                    {item.level}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-sm font-semibold transition-transform group-hover:translate-x-0.5 ${
                      isAmber ? 'text-amber-300' : 'text-teal-300'
                    }`}
                  >
                    <span>{t.view}</span>
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default CatalogPage;