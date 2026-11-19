import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Play,
  Scale,
  Sparkles,
  Type,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAppLanguage } from '../App';

type TextScale = 'sm' | 'md' | 'lg';

const SCALE_STYLES: Record<
  TextScale,
  {
    title: string;
    lead: string;
    body: string;
    cardTitle: string;
    badge: string;
    labelUk: string;
    labelEn: string;
  }
> = {
  sm: {
    title: 'text-2xl sm:text-3xl',
    lead: 'text-sm sm:text-base',
    body: 'text-xs sm:text-sm',
    cardTitle: 'text-base sm:text-lg',
    badge: 'text-[11px]',
    labelUk: 'Менший',
    labelEn: 'Small',
  },
  md: {
    title: 'text-3xl sm:text-4xl',
    lead: 'text-base sm:text-lg',
    body: 'text-sm sm:text-base',
    cardTitle: 'text-lg sm:text-xl',
    badge: 'text-xs',
    labelUk: 'Стандартний',
    labelEn: 'Medium',
  },
  lg: {
    title: 'text-4xl sm:text-5xl',
    lead: 'text-lg sm:text-xl',
    body: 'text-base sm:text-lg',
    cardTitle: 'text-xl sm:text-2xl',
    badge: 'text-xs sm:text-sm',
    labelUk: 'Більший',
    labelEn: 'Large',
  },
};

const OVERVIEW_DATA = {
  uk: {
    back: 'До каталогу',
    textLabel: 'Текст:',
    status: 'Статус: інтерактивний прототип',
    audienceTitle: 'ЦІЛЬОВА АУДИТОРІЯ',
    audience: [
      'Курсанти й слухачі сектору безпеки та оборони',
      'Викладачі доброчесності й професійної етики',
      'Учасники курсів підвищення кваліфікації',
    ],
    legalTitle: 'НОРМАТИВНО-ПРАВОВА БАЗА',
    legal: [
      'Закон України «Про запобігання корупції»; Дисциплінарний статут НПУ; Правила етичної поведінки',
      'Перевірено та інтегровано',
    ],
    chooseFormat: 'ОБЕРІТЬ ФОРМУ ПРОВЕДЕННЯ',
    selectedPrefix: 'Обрано:',
    soloLabel: 'Індивідуальне проходження',
    soloDesc: 'Самостійний вибір дій та аналіз наслідків у власному темпі',
    groupLabel: 'Груповий режим (із викладачем)',
    groupDesc: 'Голосування групи та спільний розбір кейсу в аудиторії',
    selectedBadge: 'Обрано',
    hint: 'Натисніть «Почати!», щоб перейти до обраного формату роботи з дилемою.',
    startBtn: 'Почати!',
    cases: {
      'favor-for-friend': {
        title: 'Послуга для знайомого',
        description:
          'Ви проходите практику в підрозділі. Знайомий просить перевірити інформацію про іншу особу через службову систему. Як зберегти довіру та професійні межі, коли особисті стосунки впливають на рішення?',
        valueATitle: 'ЦІННІСТЬ А: ОСОБИСТА ЛОЯЛЬНІСТЬ',
        valueAText: 'Підтримати знайомого, який просить про допомогу',
        valueBTitle: 'ЦІННІСТЬ Б: ПРОФЕСІЙНИЙ ОБОВ’ЯЗОК',
        valueBText: 'Захистити службову інформацію та діяти в межах повноважень',
      },
      'supervisor-pressure': {
        title: 'Академічна підтримка чи неправомірна вигода',
        description:
          'Викладач пропонує придбати матеріал за гарантований залік та просить зберегти розмову в таємниці. Як діяти під час сесії, тиску оточення та перевірки?',
        valueATitle: 'ЦІННІСТЬ А: СОЛІДАРНІСТЬ ТА ЗРУЧНІСТЬ',
        valueAText: 'Уникнути конфлікту, не псувати стосунки з викладачем і групою та швидко закрити питання.',
        valueBTitle: 'ЦІННІСТЬ Б: ДОБРОЧЕСНІСТЬ ТА ЗАКОН',
        valueBText: 'Дотримуватися академічної доброчесності, антикорупційних вимог та чесного оцінювання.',
      },
    },
  },
  en: {
    back: 'Back to catalog',
    textLabel: 'Text:',
    status: 'Status: interactive prototype',
    audienceTitle: 'TARGET AUDIENCE',
    audience: [
      'Cadets and trainees of the security and defense sector',
      'Instructors of integrity and professional ethics',
      'Participants of professional development courses',
    ],
    legalTitle: 'LEGAL & REGULATORY FRAMEWORK',
    legal: [
      'Law of Ukraine "On Prevention of Corruption"; NPU Disciplinary Statute; Rules of Ethical Conduct',
      'Verified and integrated',
    ],
    chooseFormat: 'CHOOSE SESSION FORMAT',
    selectedPrefix: 'Selected:',
    soloLabel: 'Individual mode',
    soloDesc: 'Independent decision-making and consequence analysis at your own pace',
    groupLabel: 'Group mode (with instructor)',
    groupDesc: 'Group voting and joint case debriefing in the classroom',
    selectedBadge: 'Selected',
    hint: 'Click "Start!" to enter the selected mode for this dilemma.',
    startBtn: 'Start!',
    cases: {
      'favor-for-friend': {
        title: 'A Favor for a Friend',
        description:
          'You are doing an internship in a unit. A friend asks you to check information about another person in an official database. How do you preserve trust and professional boundaries when personal ties influence a decision?',
        valueATitle: 'VALUE A: PERSONAL LOYALTY',
        valueAText: 'Support a friend asking for help',
        valueBTitle: 'VALUE B: DUTY OF OFFICE',
        valueBText: 'Protect official information and act strictly within authority',
      },
      'supervisor-pressure': {
        title: 'Academic Support or Undue Benefit',
        description:
          'An instructor offers study material in exchange for a guaranteed pass and asks to keep the conversation secret. How should you act during exams, peer pressure, and an official review?',
        valueATitle: 'VALUE A: SOLIDARITY & CONVENIENCE',
        valueAText: 'Avoid conflict, keep relations smooth with the instructor and peers, and close the issue quickly.',
        valueBTitle: 'VALUE B: INTEGRITY & LAW',
        valueBText: 'Uphold academic integrity, anti-corruption standards, and fair assessment.',
      },
    },
  },
} as const;

export function ScenarioOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useAppLanguage();
  const scenarioId = id === 'supervisor-pressure' ? 'supervisor-pressure' : 'favor-for-friend';

  const [textScale, setTextScale] = useState<TextScale>('md');
  const [selectedMode, setSelectedMode] = useState<'solo' | 'group'>('solo');

  const t = OVERVIEW_DATA[lang];
  const caseInfo = t.cases[scenarioId];
  const styles = SCALE_STYLES[textScale];

  const handleStart = () => {
    if (selectedMode === 'group') {
      navigate(`/scenarios/${scenarioId}/group`);
    } else {
      navigate(`/scenarios/${scenarioId}/play`);
    }
  };

  return (
    <main className="page-wrap relative py-6 sm:py-10">
      <section
        className="panel relative overflow-hidden rounded-3xl border border-slate-800/90 p-6 sm:p-10 shadow-2xl space-y-7"
        style={{
          backgroundImage: `
            radial-gradient(circle at 86% 14%, rgba(20, 184, 166, 0.16), transparent 44%),
            radial-gradient(circle at 14% 90%, rgba(251, 191, 36, 0.09), transparent 48%),
            linear-gradient(145deg, rgba(7, 13, 25, 0.97) 0%, rgba(12, 23, 43, 0.94) 55%, rgba(6, 11, 22, 0.99) 100%)
          `,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148, 163, 184, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/scenarios"
            className="inline-flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-950/35 px-3.5 py-2 text-sm font-medium text-teal-300 transition hover:border-teal-400/60 hover:bg-teal-900/45 hover:text-teal-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.back}</span>
          </Link>

          <div
            className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-1.5 backdrop-blur-md"
            role="group"
            aria-label="Text size"
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 text-xs font-medium text-slate-300">
              <Type className="h-3.5 w-3.5 text-teal-300" />
              <span>{t.textLabel}</span>
            </span>

            {(['sm', 'md', 'lg'] as TextScale[]).map((sc) => (
              <button
                key={sc}
                type="button"
                onClick={() => setTextScale(sc)}
                className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  textScale === sc
                    ? 'bg-teal-500/25 text-teal-200 border border-teal-400/50'
                    : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                {sc === 'sm' ? 'А-' : sc === 'md' ? 'А' : 'А+'}
              </button>
            ))}

            <span className="hidden sm:inline-block pl-1.5 pr-1 text-[11px] text-slate-400">
              {lang === 'uk' ? styles.labelUk : styles.labelEn}
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-amber-400/35 bg-amber-950/40 px-3.5 py-1 font-semibold tracking-wide text-amber-300 uppercase ${styles.badge}`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>ID: {scenarioId.toUpperCase()}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-teal-400/35 bg-teal-950/40 px-3.5 py-1 font-medium text-teal-300 ${styles.badge}`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t.status}</span>
            </span>
          </div>

          <h1 className={`${styles.title} font-bold tracking-tight text-white leading-snug`}>
            {caseInfo.title}
          </h1>

          <p className={`${styles.lead} max-w-4xl text-slate-200/95 leading-relaxed`}>
            {caseInfo.description}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-3.5">
          <div className="rounded-2xl border border-rose-400/25 bg-gradient-to-br from-slate-950/85 to-rose-950/20 p-5 backdrop-blur-md space-y-2">
            <div className={`${styles.badge} font-bold tracking-wider text-rose-300 uppercase`}>
              {caseInfo.valueATitle}
            </div>
            <p className={`${styles.body} text-slate-100 leading-relaxed`}>{caseInfo.valueAText}</p>
          </div>

          <div className="flex items-center justify-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/40 bg-amber-950/50 text-xs font-extrabold tracking-wider text-amber-300 shadow-md">
              VS
            </span>
          </div>

          <div className="rounded-2xl border border-teal-400/25 bg-gradient-to-br from-slate-950/85 to-teal-950/20 p-5 backdrop-blur-md space-y-2">
            <div className={`${styles.badge} font-bold tracking-wider text-teal-300 uppercase`}>
              {caseInfo.valueBTitle}
            </div>
            <p className={`${styles.body} text-slate-100 leading-relaxed`}>{caseInfo.valueBText}</p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/75 p-5 sm:p-6 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold tracking-wide uppercase">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span className={styles.badge}>{t.audienceTitle}</span>
            </div>

            <ul className={`${styles.body} space-y-2 text-slate-200 leading-relaxed`}>
              {t.audience.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/75 p-5 sm:p-6 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-sky-300 font-bold tracking-wide uppercase">
              <Scale className="h-4 w-4 shrink-0" />
              <span className={styles.badge}>{t.legalTitle}</span>
            </div>

            <ul className={`${styles.body} space-y-2.5 text-slate-200 leading-relaxed`}>
              {t.legal.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 space-y-4 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`${styles.badge} font-bold tracking-wider text-slate-300 uppercase`}>
              {t.chooseFormat}
            </span>
            <span className="text-xs text-teal-300/90">
              {t.selectedPrefix}{' '}
              <strong>{selectedMode === 'group' ? t.groupLabel : t.soloLabel}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedMode('solo')}
              className={`group text-left rounded-2xl border p-5 transition-all cursor-pointer backdrop-blur-md ${
                selectedMode === 'solo'
                  ? 'border-amber-400 bg-amber-950/30 ring-2 ring-amber-400/35 shadow-lg shadow-amber-950/25'
                  : 'border-slate-800/90 bg-slate-950/75 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-white font-bold">
                  <UserCheck className="h-5 w-5 text-amber-300 shrink-0" />
                  <span className={styles.cardTitle}>{t.soloLabel}</span>
                </div>
                {selectedMode === 'solo' && (
                  <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200">
                    {t.selectedBadge}
                  </span>
                )}
              </div>
              <p className={`${styles.body} mt-1.5 text-slate-300 leading-relaxed`}>
                {t.soloDesc}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode('group')}
              className={`group text-left rounded-2xl border p-5 transition-all cursor-pointer backdrop-blur-md ${
                selectedMode === 'group'
                  ? 'border-teal-400 bg-teal-950/30 ring-2 ring-teal-400/35 shadow-lg shadow-teal-950/25'
                  : 'border-slate-800/90 bg-slate-950/75 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-white font-bold">
                  <Users className="h-5 w-5 text-teal-300 shrink-0" />
                  <span className={styles.cardTitle}>{t.groupLabel}</span>
                </div>
                {selectedMode === 'group' && (
                  <span className="rounded-full bg-teal-400/20 border border-teal-400/40 px-2.5 py-0.5 text-[11px] font-semibold text-teal-200">
                    {t.selectedBadge}
                  </span>
                )}
              </div>
              <p className={`${styles.body} mt-1.5 text-slate-300 leading-relaxed`}>
                {t.groupDesc}
              </p>
            </button>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-400">{t.hint}</p>

            <button
              type="button"
              onClick={handleStart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-500 px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>{t.startBtn}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ScenarioOverviewPage;