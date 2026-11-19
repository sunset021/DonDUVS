import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  RotateCcw,
  Award,
  Users,
  Landmark,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { findScenario } from '../scenarios';
import { useAppLanguage } from '../App';

interface StageOption {
  id: string;
  label: string;
  actionText: string;
  metricsDelta: {
    integrity: number;
    peerTrust: number;
    institutionalTrust: number;
  };
  violated: string;
  consequences: string;
  forecast: string;
  nextStageId: string | null;
}

interface Stage {
  id: string;
  stepNumber: number;
  title: string;
  situation: string;
  options: StageOption[];
}

const SCENARIOS_STEPS: Record<'uk' | 'en', Record<string, Record<string, Stage>>> = {
  uk: {
    'favor-for-friend': {
      'step-1': {
        id: 'step-1',
        stepNumber: 1,
        title: 'Етап 1: Вечірня перевірка',
        situation:
          'Ви — курсант старшого курсу, командир взводу. Перед вечірньою перевіркою ви помічаєте, що двоє курсантів самовільно залишили розташування. Черговий офіцер уже підходить.',
        options: [
          {
            id: 'A',
            label: 'Варіант А: Приховати відсутність',
            actionText: 'Сказати черговому, що курсанти нібито в медпункті.',
            metricsDelta: { integrity: -25, peerTrust: 30, institutionalTrust: -20 },
            violated: 'Порушено вимоги службової дисципліни та достовірної доповіді.',
            consequences: 'Ризик службової перевірки та втрати довіри при виявленні неправди.',
            forecast:
              'Звичка до неправдивих доповідей підвищує ризик процесуальних помилок і підриває довіру до органів державної влади і правосуддя.',
            nextStageId: 'step-2',
          },
          {
            id: 'Б',
            label: 'Варіант Б: Доповісти правду за Статутом',
            actionText: 'Доповісти фактичний стан справ і вжиті заходи.',
            metricsDelta: { integrity: 30, peerTrust: -25, institutionalTrust: 25 },
            violated: 'Порушень немає. Дотримано вимог статутної дисципліни.',
            consequences: 'Керівництво має точні дані; можливе тимчасове напруження в групі.',
            forecast:
              'Дотримання правил знижує ризик помилок у майбутній службі та підтримує довіру до органів державної влади і правосуддя.',
            nextStageId: 'step-2',
          },
        ],
      },
      'step-2': {
        id: 'step-2',
        stepNumber: 2,
        title: 'Етап 2: Письмові пояснення',
        situation:
          'Керівництво вимагає пояснення щодо контролю особового складу. Частина групи радить вказати інший час виявлення відсутності.',
        options: [
          {
            id: 'A',
            label: 'Варіант А: Пом’якшити час у поясненні',
            actionText: 'Написати неточний час, щоб зменшити наслідки.',
            metricsDelta: { integrity: -15, peerTrust: 15, institutionalTrust: -15 },
            violated: 'Порушено принцип повноти та достовірності службових матеріалів.',
            consequences: 'Невідповідність фактам під час перевірки.',
            forecast:
              'Неточність у документах веде до процесуальних помилок і підриває довіру до органів державної влади і правосуддя.',
            nextStageId: 'step-3',
          },
          {
            id: 'Б',
            label: 'Варіант Б: Написати об’єктивно й чесно',
            actionText: 'Викласти всі обставини та визнати недоліки контролю.',
            metricsDelta: { integrity: 25, peerTrust: -10, institutionalTrust: 25 },
            violated: 'Порушень немає. Дотримано достовірності пояснень.',
            consequences: 'Об’єктивна фіксація ситуації.',
            forecast:
              'Чесність і точність зміцнюють процесуальну культуру та зберігають довіру до органів державної влади і правосуддя.',
            nextStageId: 'step-3',
          },
        ],
      },
      'step-3': {
        id: 'step-3',
        stepNumber: 3,
        title: 'Етап 3: Профілактика та висновки',
        situation:
          'Перевірка позаду. Потрібно визначитися з подальшою профілактикою порушень дисципліни.',
        options: [
          {
            id: 'A',
            label: 'Варіант А: Обмежитися розмовою «між своїми»',
            actionText: 'Не проводити системної профілактики.',
            metricsDelta: { integrity: -10, peerTrust: 15, institutionalTrust: -10 },
            violated: 'Недостатній превентивний підхід.',
            consequences: 'Ризик повторення подібних ситуацій.',
            forecast:
              'Відсутність системних правил підвищує ризик помилок і шкодить довірі до органів державної влади і правосуддя.',
            nextStageId: null,
          },
          {
            id: 'Б',
            label: 'Варіант Б: Системна профілактика',
            actionText: 'Ініціювати розбір вимог Статуту та постійний контроль.',
            metricsDelta: { integrity: 25, peerTrust: 10, institutionalTrust: 25 },
            violated: 'Порушень немає. Реалізовано превентивний підхід.',
            consequences: 'Чіткі правила та менший ризик повторних порушень.',
            forecast:
              'Системність знижує ризик помилок і зміцнює довіру до органів державної влади і правосуддя.',
            nextStageId: null,
          },
        ],
      },
    },
    'supervisor-pressure': {
      'step-1': {
        id: 'step-1',
        stepNumber: 1,
        title: 'Етап 1: Пропозиція «методички» за залік',
        situation:
          'Викладач пропонує придбати «методичку» за 500 грн за гарантований залік і просить тримати це в таємниці.',
        options: [
          {
            id: 'A',
            label: 'Варіант А: Придбати та зберегти таємницю',
            actionText: 'Заплатити за «методичку» заради гарантованого заліку.',
            metricsDelta: { integrity: -25, peerTrust: 15, institutionalTrust: -25 },
            violated: 'Ознаки порушення академічної доброчесності та антикорупційних вимог.',
            consequences: 'Втрата реальних знань і закріплення неформальних практик.',
            forecast:
              'Неформальні домовленості підвищують ризик помилок і підривають довіру до органів державної влади і правосуддя.',
            nextStageId: 'step-2',
          },
          {
            id: 'Б',
            label: 'Варіант Б: Відмовитися та діяти за правилами',
            actionText: 'Відмовитися, готуватися самостійно та повідомити уповноважений підрозділ.',
            metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 25 },
            violated: 'Порушень немає. Дотримано доброчесності.',
            consequences: 'Збережено чесні знання; можливий тиск з боку оточення.',
            forecast:
              'Принциповість знижує ризик помилок і підтримує довіру до органів державної влади і правосуддя.',
            nextStageId: 'step-2',
          },
        ],
      },
      'step-2': {
        id: 'step-2',
        stepNumber: 2,
        title: 'Етап 2: Сесія та тиск оточення',
        situation:
          'Під час сесії виникає тиск: частина групи тисне, щоб не ускладнювати проходження контролю.',
        options: [
          {
            id: 'A',
            label: 'Варіант А: Поступитися під тиском',
            actionText: 'Погодитися на неформальні умови, щоб закрити залік.',
            metricsDelta: { integrity: -35, peerTrust: 20, institutionalTrust: -30 },
            violated: 'Посилення ризиків порушення доброчесності та закону.',
            consequences: 'Залежність від неформальних умов.',
            forecast:
              'Поступки тиску підвищують ризик помилок і шкодять довірі до органів державної влади і правосуддя.',
            nextStageId: 'step-3',
          },
          {
            id: 'Б',
            label: 'Варіант Б: Офіційне звернення за процедурою',
            actionText: 'Звернутися до уповноваженого підрозділу або керівництва.',
            metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 30 },
            violated: 'Порушень немає. Реалізовано право на об’єктивне оцінювання.',
            consequences: 'Переведення ситуації у правову площину.',
            forecast:
              'Дія за процедурою зменшує ризик помилок і зберігає довіру до органів державної влади і правосуддя.',
            nextStageId: 'step-3',
          },
        ],
      },
      'step-3': {
        id: 'step-3',
        stepNumber: 3,
        title: 'Етап 3: Перевірка та пояснення',
        situation:
          'Розпочато перевірку щодо порушень доброчесності. Від вас вимагають пояснень.',
        options: [
          {
            id: 'A',
            label: 'Варіант А: Надати неповні або неправдиві пояснення',
            actionText: 'Приховати відомі факти, щоб уникнути запитань.',
            metricsDelta: { integrity: -30, peerTrust: 10, institutionalTrust: -35 },
            violated: 'Порушено вимогу достовірності пояснень.',
            consequences: 'Ризик відповідальності та втрати довіри.',
            forecast:
              'Недостовірність підриває точність і довіру до органів державної влади і правосуддя.',
            nextStageId: null,
          },
          {
            id: 'Б',
            label: 'Варіант Б: Надати повні та правдиві пояснення',
            actionText: 'Чесно викласти всі відомі обставини.',
            metricsDelta: { integrity: 35, peerTrust: -10, institutionalTrust: 30 },
            violated: 'Порушень немає. Дотримано обов’язку достовірної комунікації.',
            consequences: 'Об’єктивність перевірки та правова чистота позиції.',
            forecast:
              'Правдивість зміцнює професійну культуру та підтримує довіру до органів державної влади і правосуддя.',
            nextStageId: null,
          },
        ],
      },
    },
  },
  en: {
    'favor-for-friend': {
      'step-1': {
        id: 'step-1',
        stepNumber: 1,
        title: 'Stage 1: Evening Roll Call',
        situation:
          'You are a senior cadet platoon leader. Just before evening roll call, you notice two cadets left without permission. The duty officer is already approaching.',
        options: [
          {
            id: 'A',
            label: 'Option A: Conceal the Absence',
            actionText: 'Tell the duty officer the cadets are in the medical unit.',
            metricsDelta: { integrity: -25, peerTrust: 30, institutionalTrust: -20 },
            violated: 'Breach of service discipline and accurate official reporting.',
            consequences: 'Risk of an official check and loss of trust if uncovered.',
            forecast:
              'Inaccurate reports increase procedural error risk and undermine public trust in state authorities and justice.',
            nextStageId: 'step-2',
          },
          {
            id: 'Б',
            label: 'Option B: Report Honestly Under Statute',
            actionText: 'Report the actual situation and actions taken.',
            metricsDelta: { integrity: 30, peerTrust: -25, institutionalTrust: 25 },
            violated: 'No violation. Statutory discipline is upheld.',
            consequences: 'Leadership gets accurate facts; temporary peer tension is possible.',
            forecast:
              'Following rules lowers error risk in future service and supports public trust in state authorities and justice.',
            nextStageId: 'step-2',
          },
        ],
      },
      'step-2': {
        id: 'step-2',
        stepNumber: 2,
        title: 'Stage 2: Written Explanations',
        situation:
          'Leadership requests written explanations on supervision. Some peers suggest entering a different time of discovering the absence.',
        options: [
          {
            id: 'A',
            label: 'Option A: Soften the Time in the Report',
            actionText: 'State an inaccurate time to reduce consequences.',
            metricsDelta: { integrity: -15, peerTrust: 15, institutionalTrust: -15 },
            violated: 'Breach of completeness and accuracy of official records.',
            consequences: 'Contradiction with other review materials.',
            forecast:
              'Inaccurate records lead to procedural errors and harm trust in state authorities and justice.',
            nextStageId: 'step-3',
          },
          {
            id: 'Б',
            label: 'Option B: Write Objectively and Honestly',
            actionText: 'Present all facts and acknowledge supervision gaps.',
            metricsDelta: { integrity: 25, peerTrust: -10, institutionalTrust: 25 },
            violated: 'No violation. Accuracy of explanations is preserved.',
            consequences: 'Transparent documentation of facts.',
            forecast:
              'Honesty and accuracy strengthen procedural culture and preserve trust in state authorities and justice.',
            nextStageId: 'step-3',
          },
        ],
      },
      'step-3': {
        id: 'step-3',
        stepNumber: 3,
        title: 'Stage 3: Prevention and Conclusions',
        situation:
          'The review is behind you. You need to decide how to prevent similar discipline breaches going forward.',
        options: [
          {
            id: 'A',
            label: 'Option A: Keep It to an Informal Chat',
            actionText: 'Skip systemic preventive measures.',
            metricsDelta: { integrity: -10, peerTrust: 15, institutionalTrust: -10 },
            violated: 'Insufficient preventive approach.',
            consequences: 'Higher risk of repeat incidents.',
            forecast:
              'Lack of systemic rules raises error risk and harms trust in state authorities and justice.',
            nextStageId: null,
          },
          {
            id: 'Б',
            label: 'Option B: Systemic Prevention',
            actionText: 'Initiate a structured review of rules and ongoing supervision.',
            metricsDelta: { integrity: 25, peerTrust: 10, institutionalTrust: 25 },
            violated: 'No violation. Preventive approach applied.',
            consequences: 'Clearer standards and lower recurrence risk.',
            forecast:
              'Systemic prevention lowers error risk and strengthens trust in state authorities and justice.',
            nextStageId: null,
          },
        ],
      },
    },
    'supervisor-pressure': {
      'step-1': {
        id: 'step-1',
        stepNumber: 1,
        title: 'Stage 1: "Study Guide" Offer for a Pass',
        situation:
          'An instructor offers a "study guide" for 500 UAH for a guaranteed pass and asks to keep it secret.',
        options: [
          {
            id: 'A',
            label: 'Option A: Buy and Keep It Secret',
            actionText: 'Pay for the guide to secure a guaranteed pass.',
            metricsDelta: { integrity: -25, peerTrust: 15, institutionalTrust: -25 },
            violated: 'Signs of academic integrity breach and anti-corruption risks.',
            consequences: 'Loss of real knowledge and normalization of informal deals.',
            forecast:
              'Informal arrangements raise error risk and undermine trust in state authorities and justice.',
            nextStageId: 'step-2',
          },
          {
            id: 'Б',
            label: 'Option B: Decline and Follow Rules',
            actionText: 'Decline, study independently, and notify the authorized unit.',
            metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 25 },
            violated: 'No violation. Integrity is upheld.',
            consequences: 'Honest preparation; possible peer pressure.',
            forecast:
              'Principled conduct lowers error risk and supports trust in state authorities and justice.',
            nextStageId: 'step-2',
          },
        ],
      },
      'step-2': {
        id: 'step-2',
        stepNumber: 2,
        title: 'Stage 2: Exams and Peer Pressure',
        situation:
          'During exams, pressure builds: some peers urge adapting so assessment goes smoothly.',
        options: [
          {
            id: 'A',
            label: 'Option A: Give In Under Pressure',
            actionText: 'Accept informal terms to pass.',
            metricsDelta: { integrity: -35, peerTrust: 20, institutionalTrust: -30 },
            violated: 'Heightened risk of breaching integrity and law.',
            consequences: 'Dependence on informal conditions.',
            forecast:
              'Yielding to pressure raises error risk and harms trust in state authorities and justice.',
            nextStageId: 'step-3',
          },
          {
            id: 'Б',
            label: 'Option B: Official Appeal via Procedure',
            actionText: 'Submit an official report regarding biased grading.',
            metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 30 },
            violated: 'No violation. Right to fair assessment exercised.',
            consequences: 'Moves the issue into a legal process.',
            forecast:
              'Following procedure lowers error risk and preserves trust in state authorities and justice.',
            nextStageId: 'step-3',
          },
        ],
      },
      'step-3': {
        id: 'step-3',
        stepNumber: 3,
        title: 'Stage 3: Review and Explanations',
        situation:
          'An integrity review is underway. You are asked for explanations.',
        options: [
          {
            id: 'A',
            label: 'Option A: Give Incomplete or Untruthful Explanations',
            actionText: 'Conceal known facts to avoid questions.',
            metricsDelta: { integrity: -30, peerTrust: 10, institutionalTrust: -35 },
            violated: 'Breach of duty to give truthful explanations.',
            consequences: 'Risk of liability and loss of trust.',
            forecast:
              'Untruthfulness undermines accuracy and trust in state authorities and justice.',
            nextStageId: null,
          },
          {
            id: 'Б',
            label: 'Option B: Give Full and Truthful Explanations',
            actionText: 'State all known facts honestly.',
            metricsDelta: { integrity: 35, peerTrust: -10, institutionalTrust: 30 },
            violated: 'No violation. Duty of truthful communication upheld.',
            consequences: 'Objective review and clear legal standing.',
            forecast:
              'Truthfulness strengthens professional culture and supports trust in state authorities and justice.',
            nextStageId: null,
          },
        ],
      },
    },
  },
};

const UI_TEXT = {
  uk: {
    backToOverview: 'До опису сценарію',
    stepOf: 'Крок',
    ofThree: 'з 3',
    integrity: 'Доброчесність',
    peerTrust: 'Довіра колективу',
    institutionalTrust: 'Інституційна довіра',
    chooseOption: 'Оберіть варіант дії:',
    summaryTitle: 'Підсумок проходження',
    assessment: 'Оцінка:',
    consequences: 'Наслідки:',
    forecast: 'Прогноз:',
    retry: 'Пройти ще раз',
    toCatalog: 'До каталогу сценаріїв',
  },
  en: {
    backToOverview: 'Back to scenario overview',
    stepOf: 'Step',
    ofThree: 'of 3',
    integrity: 'Integrity',
    peerTrust: 'Peer trust',
    institutionalTrust: 'Institutional trust',
    chooseOption: 'Choose an option:',
    summaryTitle: 'Completion summary',
    assessment: 'Assessment:',
    consequences: 'Consequences:',
    forecast: 'Forecast:',
    retry: 'Try again',
    toCatalog: 'Back to scenarios',
  },
} as const;

export function ScenarioPlayPage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useAppLanguage();
  const scenarioId = id === 'supervisor-pressure' ? 'supervisor-pressure' : 'favor-for-friend';
  const scenarioData = findScenario(scenarioId);
  const stages = SCENARIOS_STEPS[lang][scenarioId];
  const t = UI_TEXT[lang];

  const [currentStageId, setCurrentStageId] = useState('step-1');
  const [isCompleted, setIsCompleted] = useState(false);
  const [metrics, setMetrics] = useState({
    integrity: 50,
    peerTrust: 50,
    institutionalTrust: 50,
  });
  const [history, setHistory] = useState<{ title: string; option: StageOption }[]>([]);

  useEffect(() => {
    setCurrentStageId('step-1');
    setIsCompleted(false);
    setMetrics({ integrity: 50, peerTrust: 50, institutionalTrust: 50 });
    setHistory([]);
  }, [scenarioId, lang]);

  const stage = stages[currentStageId] || stages['step-1'];

  const handleChoose = (option: StageOption) => {
    setMetrics((prev) => ({
      integrity: Math.min(100, Math.max(0, prev.integrity + option.metricsDelta.integrity)),
      peerTrust: Math.min(100, Math.max(0, prev.peerTrust + option.metricsDelta.peerTrust)),
      institutionalTrust: Math.min(
        100,
        Math.max(0, prev.institutionalTrust + option.metricsDelta.institutionalTrust)
      ),
    }));
    setHistory((prev) => [...prev, { title: stage.title, option }]);

    if (option.nextStageId && stages[option.nextStageId]) {
      setCurrentStageId(option.nextStageId);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStageId('step-1');
    setIsCompleted(false);
    setMetrics({ integrity: 50, peerTrust: 50, institutionalTrust: 50 });
    setHistory([]);
  };

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Link
          to={`/scenarios/${scenarioId}`}
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> {t.backToOverview}
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 text-teal-300">
            <Award className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold text-white">{t.summaryTitle}</h1>
              <p className="text-sm text-slate-400">{scenarioData?.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">{t.integrity}</div>
              <div className="text-2xl font-bold text-teal-300">{metrics.integrity}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">{t.peerTrust}</div>
              <div className="text-2xl font-bold text-sky-300">{metrics.peerTrust}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">{t.institutionalTrust}</div>
              <div className="text-2xl font-bold text-amber-300">
                {metrics.institutionalTrust}%
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
              >
                <div className="text-xs font-bold text-teal-300">{item.title}</div>
                <div className="text-base font-bold text-white">{item.option.label}</div>
                <p className="text-sm text-rose-200">
                  <strong>{t.assessment}</strong> {item.option.violated}
                </p>
                <p className="text-sm text-slate-200">
                  <strong>{t.consequences}</strong> {item.option.consequences}
                </p>
                <p className="text-sm text-sky-200">
                  <strong>{t.forecast}</strong> {item.option.forecast}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> {t.retry}
            </button>
            <Link
              to="/scenarios"
              className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {t.toCatalog}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/scenarios/${scenarioId}`}
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> {t.backToOverview}
        </Link>
        <span className="text-xs font-bold text-teal-300 bg-teal-950/50 border border-teal-500/30 px-3 py-1.5 rounded-full">
          {t.stepOf} {stage.stepNumber} {t.ofThree}
        </span>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">{t.integrity}</div>
              <div className="text-lg font-bold text-teal-300">{metrics.integrity}%</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Users className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">{t.peerTrust}</div>
              <div className="text-lg font-bold text-sky-300">{metrics.peerTrust}%</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Landmark className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">{t.institutionalTrust}</div>
              <div className="text-lg font-bold text-amber-300">
                {metrics.institutionalTrust}%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{stage.title}</h1>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 leading-relaxed">
            {stage.situation}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>{t.chooseOption}</span>
          </div>

          {stage.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleChoose(option)}
              className="w-full text-left p-5 rounded-2xl border border-slate-800 bg-slate-900/75 hover:border-teal-400/60 hover:bg-slate-900 transition-all cursor-pointer space-y-1.5"
            >
              <div className="text-base font-bold text-teal-300">{option.label}</div>
              <p className="text-sm text-slate-200">{option.actionText}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScenarioPlayPage;