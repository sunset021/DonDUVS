import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch, Globe, ShieldCheck, Users } from 'lucide-react';
import { useAppLanguage } from '../App';

const COPY = {
  uk: {
    eyebrow: 'ІНТЕРАКТИВНА ОСВІТНЯ ПЛАТФОРМА',
    titleLine1: 'Етичний вибір починається',
    titleLine2: 'з твого рішення.',
    lead: 'Тренуйте професійне мислення в складних ситуаціях: особиста лояльність, службовий обов’язок, неповна інформація та наслідки рішень.',
    chooseScenario: 'Обрати сценарій',
    dilemma1: 'Огляд першої дилеми',
    dilemma2: 'Огляд другої дилеми',
    card1Title: 'Розгалужені рішення',
    card1Desc: 'Різні дії — різні наслідки',
    card2Title: 'Прозорий аналіз',
    card2Desc: 'Аргументи замість ярликів',
    card3Title: 'Групове навчання',
    card3Desc: 'Голосування та розбір в аудиторії',
    footnote:
      'Навчальний прототип. Не призначений для оцінювання професійної придатності чи відбору персоналу.',
    langLabel: 'Мова',
  },
  en: {
    eyebrow: 'INTERACTIVE EDUCATIONAL PLATFORM',
    titleLine1: 'Ethical choice starts',
    titleLine2: 'with your decision.',
    lead: 'Train professional judgment in complex situations: personal loyalty, duty of office, incomplete information, and real-world consequences.',
    chooseScenario: 'Choose a scenario',
    dilemma1: 'First dilemma overview',
    dilemma2: 'Second dilemma overview',
    card1Title: 'Branching decisions',
    card1Desc: 'Different actions — different outcomes',
    card2Title: 'Transparent analysis',
    card2Desc: 'Arguments instead of labels',
    card3Title: 'Group learning',
    card3Desc: 'Classroom voting and case discussion',
    footnote:
      'Educational prototype. Not intended for assessing professional suitability or personnel selection.',
    langLabel: 'Language',
  },
} as const;

export function HomePage() {
  const { lang, setLang } = useAppLanguage();
  const t = COPY[lang];

  return (
    <main className="page-wrap relative py-6 sm:py-10">
      <section
        className="hero panel relative overflow-hidden rounded-3xl border border-slate-800/90 p-6 sm:p-10 shadow-2xl"
        style={{
          backgroundImage: `
            radial-gradient(circle at 85% 15%, rgba(20, 184, 166, 0.18), transparent 42%),
            radial-gradient(circle at 12% 90%, rgba(56, 189, 248, 0.14), transparent 48%),
            linear-gradient(145deg, rgba(7, 13, 25, 0.96) 0%, rgba(13, 24, 45, 0.92) 55%, rgba(6, 11, 22, 0.98) 100%)
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

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow inline-block text-xs font-semibold tracking-widest text-teal-300/90 uppercase">
              {t.eyebrow}
            </span>

            <div
              className="inline-flex items-center gap-1 rounded-2xl border border-slate-700/80 bg-slate-950/85 p-1 backdrop-blur-md"
              role="group"
              aria-label={t.langLabel}
            >
              <span className="inline-flex items-center gap-1.5 px-2.5 text-xs font-medium text-slate-300">
                <Globe className="h-3.5 w-3.5 text-teal-300" />
                <span>{t.langLabel}:</span>
              </span>

              <button
                type="button"
                onClick={() => setLang('uk')}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  lang === 'uk'
                    ? 'bg-teal-500/25 text-teal-200 border border-teal-400/50'
                    : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                УКР
              </button>

              <button
                type="button"
                onClick={() => setLang('en')}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  lang === 'en'
                    ? 'bg-teal-500/25 text-teal-200 border border-teal-400/50'
                    : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {t.titleLine1}
            <br />
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              {t.titleLine2}
            </span>
          </h1>

          <p className="hero-lead max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.lead}
          </p>

          <div className="hero-actions flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/scenarios"
              className="btn btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition"
            >
              <span>{t.chooseScenario}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/scenarios/favor-for-friend"
              className="btn btn-secondary rounded-xl px-4 py-3 font-medium transition"
            >
              {t.dilemma1}
            </Link>

            <Link
              to="/scenarios/supervisor-pressure"
              className="btn btn-secondary rounded-xl px-4 py-3 font-medium transition"
            >
              {t.dilemma2}
            </Link>
          </div>

          <div className="feature-grid grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <article className="feature-card rounded-2xl border border-slate-800/90 bg-slate-950/65 p-5 backdrop-blur-md transition hover:border-teal-500/40">
              <GitBranch className="feature-icon mb-3 text-teal-400" size={22} />
              <h2 className="text-lg font-semibold text-white">{t.card1Title}</h2>
              <p className="mt-1 text-sm text-slate-400">{t.card1Desc}</p>
            </article>

            <article className="feature-card rounded-2xl border border-slate-800/90 bg-slate-950/65 p-5 backdrop-blur-md transition hover:border-cyan-500/40">
              <ShieldCheck className="feature-icon mb-3 text-cyan-400" size={22} />
              <h2 className="text-lg font-semibold text-white">{t.card2Title}</h2>
              <p className="mt-1 text-sm text-slate-400">{t.card2Desc}</p>
            </article>

            <article className="feature-card rounded-2xl border border-slate-800/90 bg-slate-950/65 p-5 backdrop-blur-md transition hover:border-sky-500/40">
              <Users className="feature-icon mb-3 text-sky-400" size={22} />
              <h2 className="text-lg font-semibold text-white">{t.card3Title}</h2>
              <p className="mt-1 text-sm text-slate-400">{t.card3Desc}</p>
            </article>
          </div>
        </div>
      </section>

      <p className="footnote mt-4 text-xs text-slate-400">{t.footnote}</p>
    </main>
  );
}

export default HomePage;