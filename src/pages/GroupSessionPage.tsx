import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Plus,
  Minus,
  RotateCcw,
  Award,
  CheckCircle2,
  Scale,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  XCircle,
  Type,
  MessageSquare,
} from 'lucide-react';
import { findScenario } from '../scenarios';

type FontSizeMode = 'small' | 'medium' | 'large';

interface FeedbackData {
  violated: string;
  impact: string;
  tradeoff: string;
  criminologicalForecast: string;
}

interface GroupOption {
  id: string;
  label: string;
  actionText: string;
  metricsDelta: {
    integrity: number;
    peerTrust: number;
    institutionalTrust: number;
  };
  feedback: FeedbackData;
  nextStageId: string | null;
}

interface GroupStage {
  id: string;
  stepNumber: number;
  title: string;
  situation: string;
  discussionPrompts: string[];
  options: GroupOption[];
}

const MAX_VOTES_PER_OPTION = 100;
const INITIAL_METRICS = {
  integrity: 50,
  peerTrust: 50,
  institutionalTrust: 50,
};

const GROUP_STAGES: Record<string, Record<string, GroupStage>> = {
  'favor-for-friend': {
    'step-1': {
      id: 'step-1',
      stepNumber: 1,
      title: 'Етап 1: Вечірня перевірка та непомітна прогалина',
      situation:
        'Ви — курсант старшого курсу, командир взводу. За кілька хвилин до вечірньої перевірки ви помічаєте, що двоє курсантів із вашого взводу самовільно залишили розташування. Черговий офіцер уже починає обхід.',
      discussionPrompts: [
        'Чому в групі виникає бажання підтримати своїх під час перевірки та як це співвідноситься з вимогами дисципліни?',
        'Де проходить межа між товариською підтримкою та виконанням обов’язку достовірно доповідати?',
        'Як неправдиві відомості у службовій комунікації впливають на авторитет і довіру до органів державної влади і правосуддя?',
      ],
      options: [
        {
          id: 'A',
          label: 'Варіант А: Приховування відсутності (Колективна солідарність)',
          actionText:
            'Надати черговому офіцеру недостовірну інформацію про те, що курсанти нібито перебувають у медичному підрозділі.',
          metricsDelta: { integrity: -25, peerTrust: 30, institutionalTrust: -20 },
          feedback: {
            violated:
              'Ст. 11 та ст. 16 Дисциплінарного статуту Національної поліції України (обов’язок дотримуватися службової дисципліни та надавати достовірні доповіді); вимоги щодо достовірності службової облікової документації.',
            impact:
              'У разі перевірки облікової документації або медичних відомостей виникає підстава для службового розслідування, дисциплінарного розгляду та притягнення до відповідальності.',
            tradeoff:
              'Збережено лояльність у групі на початковому етапі, проте знижено рівень службової доброчесності, достовірності та довіри керівництва.',
            criminologicalForecast:
              'Порушення статутних вимог щодо правдивої доповіді закріплює звичку виправдовувати неточності груповою солідарністю. У подальшій службовій діяльності поліцейського та роботі на посаді слідчого це підвищує ризик професійної деформації, неточної фіксації фактів і грубих процесуальних помилок, що підриває авторитет і довіру до органів державної влади і правосуддя.',
          },
          nextStageId: 'step-2',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Принципова доповідь за процедурою',
          actionText:
            'Чесно доповісти черговому офіцеру про виявлену відсутність і вжиті заходи щодо з’ясування місцезнаходження.',
          metricsDelta: { integrity: 30, peerTrust: -20, institutionalTrust: 25 },
          feedback: {
            violated:
              'Порушень немає. Дотримано вимог ст. 11, 16 Дисциплінарного статуту Національної поліції України та стандартів достовірної службової доповіді.',
            impact:
              'Об’єктивна фіксація факту дозволяє вчасно зреагувати на подію в межах правової процедури; можливе тимчасове напруження у спілкуванні з окремими учасниками.',
            tradeoff:
              'Збережено службову доброчесність і достовірність на шкоду короткочасній зручності в колективі.',
            criminologicalForecast:
              'Дотримання правил правдивої доповіді формує стійкі професійні стандарти, знижує ризик процесуальних помилок у майбутній діяльності слідчого та зміцнює довіру до органів державної влади і правосуддя.',
          },
          nextStageId: 'step-2',
        },
      ],
    },
    'step-2': {
      id: 'step-2',
      stepNumber: 2,
      title: 'Етап 2: Письмові пояснення та фіксація фактів',
      situation:
        'За фактом події призначено перевірку, і учасникам необхідно подати письмові пояснення щодо часу та обставин виявлення відсутності.',
      discussionPrompts: [
        'Чому навіть незначне коригування часу чи деталей у поясненні підриває доказову та службову цінність документа?',
        'Які наслідки має розбіжність між усними словами та письмовими матеріалами перевірки?',
      ],
      options: [
        {
          id: 'A',
          label: 'Варіант А: Пом’якшити хронологію у поясненні',
          actionText:
            'Вказати пізніший час виявлення відсутності, щоб зменшити гостроту ситуації.',
          metricsDelta: { integrity: -15, peerTrust: 15, institutionalTrust: -15 },
          feedback: {
            violated:
              'Порушено принцип повноти, об’єктивності та достовірності службових пояснень і матеріалів перевірки.',
            impact:
              'Невідповідність фактам під час перевірки ставить під сумнів усі подальші пояснення та створює дисциплінарні ризики.',
            tradeoff:
              'Спроба пом’якшити відповідальність створює ризик втрати довіри з боку керівництва та перевіряючих.',
            criminologicalForecast:
              'Неточність у службових документах закріплює практику вибіркового викладення фактів, що у майбутній роботі слідчого веде до процесуальних помилок і підриває довіру до органів державної влади і правосуддя.',
          },
          nextStageId: 'step-3',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Викласти точні та перевірені факти',
          actionText:
            'Зафіксувати у поясненні реальну хронологію та всі відомі обставини без приховувань чи припущень.',
          metricsDelta: { integrity: 25, peerTrust: -10, institutionalTrust: 25 },
          feedback: {
            violated:
              'Порушень немає. Дотримано вимоги достовірності та повноти письмових пояснень.',
            impact:
              'Матеріали перевірки базуються на точних даних і не містять внутрішніх суперечностей.',
            tradeoff:
              'Чесна фіксація фактів може не сподобатися тим, хто розраховував на викривлення обставин.',
            criminologicalForecast:
              'Точна фіксація фактів формує навичку коректної роботи з документами та доказами, знижує ризик процесуальних помилок і підтримує довіру до органів державної влади і правосуддя.',
          },
          nextStageId: 'step-3',
        },
      ],
    },
    'step-3': {
      id: 'step-3',
      stepNumber: 3,
      title: 'Етап 3: Профілактика та висновки в колективі',
      situation:
        'Група підбиває підсумки ситуації та визначає, які заходи варто запровадити, щоб не допускати подібних випадків надалі.',
      discussionPrompts: [
        'Які конкретні правила взаємодії у взводі допоможуть попереджати порушення ще до їх виникнення?',
        'Як поєднати взаємну підтримку в колективі з повагою до закону та статуту?',
      ],
      options: [
        {
          id: 'A',
          label: 'Варіант А: Обмежитися разовою розмовою',
          actionText:
            'Не впроваджувати системних правил контролю та профілактики, обмежившись загальним зауваженням.',
          metricsDelta: { integrity: -10, peerTrust: 15, institutionalTrust: -10 },
          feedback: {
            violated:
              'Недостатньо реалізовано превентивний підхід до запобігання дисциплінарним і професійним ризикам.',
            impact:
              'Зберігається ймовірність повторення аналогічних порушень у майбутньому.',
            tradeoff:
              'Менше організаційних зусиль зараз, але вищий ризик нових проблем у колективі.',
            criminologicalForecast:
              'Відсутність системної профілактики підвищує ризик повторних правопорушень і процесуальних помилок та послаблює довіру до органів державної влади і правосуддя.',
          },
          nextStageId: null,
        },
        {
          id: 'Б',
          label: 'Варіант Б: Системна профілактика та відповідальність',
          actionText:
            'Запровадити регулярне інформування, взаємний контроль і розбір етичних кейсів у колективі.',
          metricsDelta: { integrity: 25, peerTrust: 10, institutionalTrust: 25 },
          feedback: {
            violated:
              'Порушень немає. Сформовано превентивний та відповідальний підхід.',
            impact:
              'Чіткі правила та менший ризик повторних порушень у підрозділі.',
            tradeoff:
              'Потребує постійної уваги та дисципліни, але створює стабільне безпечне середовище.',
            criminologicalForecast:
              'Системність у профілактиці знижує ризик помилок у професійній діяльності та зміцнює довіру до органів державної влади і правосуддя.',
          },
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
        'Викладач пропонує придбати «методичку» за 500 грн за гарантований залік і просить не виносити це за межі розмови.',
      discussionPrompts: [
        'Які ознаки неправомірної вигоди та конфлікту інтересів з’являються у цій ситуації?',
        'Чому формальна «покупка матеріалу» за залік підриває і знання, і авторитет закладу?',
      ],
      options: [
        {
          id: 'A',
          label: 'Варіант А: Прийняти неформальну умову',
          actionText:
            'Погодитися на оплату «методички» заради отримання заліку без належної підготовки.',
          metricsDelta: { integrity: -25, peerTrust: 15, institutionalTrust: -25 },
          feedback: {
            violated:
              'Ст. 42 Закону України «Про освіту» (академічна доброчесність); ч. 1 ст. 17 Закону України «Про освіту» (обов’язок сумлінно навчатися); ст. 1 та ст. 22 Закону України «Про запобігання корупції» (ознаки неправомірної вигоди та обмеження щодо одержання вигоди); внутрішні положення про академічну доброчесність і дисциплінарні норми ЗВО.',
            impact:
              'Гарантований залік без підготовки створює прогалину у профільних знаннях, необхідних у подальшій практичній діяльності, та формує ризик антикорупційної і дисциплінарної відповідальності.',
            tradeoff:
              'Тимчасовий успіх і легке проходження контролю ціною втрати знань та формування корупційної практики.',
            criminologicalForecast:
              'Наведені норми мають переважно бланкетний, відсильний та освітньо-дисциплінарний характер і не містять прямої кримінальної санкції в тексті відповідних приписів. Водночас їх порушення викладачем зумовлює фактичне одержання неправомірної вигоди та закріплює корупційну модель поведінки, а для курсантів породжує дефіцит фахових знань, що в подальшій роботі на посаді слідчого призводить до грубих процесуальних помилок і підриває довіру до органів державної влади та органів правосуддя.',
          },
          nextStageId: 'step-2',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Відмовитися та діяти за процедурою',
          actionText:
            'Ввічливо відмовитися від неформальної пропозиції, готуватися за програмою та звернутися до уповноважених осіб у разі тиску.',
          metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 25 },
          feedback: {
            violated:
              'Порушень немає. Дотримано вимог ст. 42 Закону України «Про освіту» та антикорупційного законодавства.',
            impact:
              'Зберігаються реальні знання та законний порядок оцінювання; можливий тиск з боку прихильників «простого шляху».',
            tradeoff:
              'Більше зусиль на підготовку та можливий дискомфорт у спілкуванні з частиною оточення.',
            criminologicalForecast:
              'Принципове дотримання закону знижує ризик фахових і процесуальних помилок у майбутній роботі слідчого та підтримує довіру до органів державної влади та органів правосуддя.',
          },
          nextStageId: 'step-2',
        },
      ],
    },
    'step-2': {
      id: 'step-2',
      stepNumber: 2,
      title: 'Етап 2: Сесія та тиск середовища',
      situation:
        'Наближається атестація, і частина групи пропонує підлаштуватися під неформальні правила, щоб «не ускладнювати життя».',
      discussionPrompts: [
        'Як груповий конформізм впливає на індивідуальний вибір під час тиску з боку старших або оточення?',
        'Які законні механізми захисту прав здобувачів освіти варто застосовувати?',
      ],
      options: [
        {
          id: 'A',
          label: 'Варіант А: Зламатися заради конформізму',
          actionText:
            'Підтримати неформальні домовленості під час сесії, щоб не виділятися в групі.',
          metricsDelta: { integrity: -35, peerTrust: 20, institutionalTrust: -30 },
          feedback: {
            violated:
              'Посилення порушень ст. 42 Закону України «Про освіту» (академічна доброчесність) та ризиків за ст. 1, 22 Закону України «Про запобігання корупції».',
            impact:
              'Закріплення неформальної моделі поведінки та поглиблення прогалин у фаховій підготовці.',
            tradeoff:
              'Короткочасний спокій у групі ціною глибокої втрати професійних стандартів.',
            criminologicalForecast:
              'Конформізм щодо неправомірних практик підвищує ризик грубих процесуальних помилок у подальшій службі слідчого та підриває довіру до органів державної влади і правосуддя.',
          },
          nextStageId: 'step-3',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Офіційне звернення та правовий захист',
          actionText:
            'Зафіксувати обставини та звернутися до уповноваженого підрозділу / керівництва для забезпечення прозорого оцінювання.',
          metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 30 },
          feedback: {
            violated:
              'Порушень немає. Реалізовано право на об’єктивне та законне оцінювання.',
            impact:
              'Ситуація переводиться в офіційну правову площину; можливе обговорення всередині групи.',
            tradeoff:
              'Потребує рішучості та витримки, але захищає законні інтереси й репутацію.',
            criminologicalForecast:
              'Дія виключно в межах закону формує професійну стійкість, зменшує ризик процесуальних помилок і зміцнює довіру до органів державної влади і правосуддя.',
          },
          nextStageId: 'step-3',
        },
      ],
    },
    'step-3': {
      id: 'step-3',
      stepNumber: 3,
      title: 'Етап 3: Перевірка та відповідальність за пояснення',
      situation:
        'Під час перевірки учасників просять надати пояснення щодо подій навколо оцінювання.',
      discussionPrompts: [
        'Чому правдивість на етапі перевірки є вирішальною для відновлення справедливості?',
        'Як формується довіра до правоохоронної та освітньої системи через прозорі процедури?',
      ],
      options: [
        {
          id: 'A',
          label: 'Варіант А: Приховати частину фактів',
          actionText:
            'Надати неповні або викривлені пояснення під час перевірки.',
          metricsDelta: { integrity: -30, peerTrust: 10, institutionalTrust: -35 },
          feedback: {
            violated:
              'Порушено обов’язок надавати достовірні та повні пояснення під час перевірки.',
            impact:
              'Ризик дисциплінарної або іншої відповідальності та втрати довіри.',
            tradeoff:
              'Спроба уникнути незручних запитань призводить до ще більших правових ризиків.',
            criminologicalForecast:
              'Приховування фактів підриває законність і точність рішень, підвищує ризик процесуальних помилок і шкодить довірі до органів державної влади і правосуддя.',
          },
          nextStageId: null,
        },
        {
          id: 'Б',
          label: 'Варіант Б: Повна та достовірна позиція',
          actionText:
            'Викласти всі відомі факти чітко, послідовно та в межах правової процедури.',
          metricsDelta: { integrity: 35, peerTrust: -10, institutionalTrust: 30 },
          feedback: {
            violated:
              'Порушень немає. Дотримано стандарту достовірної та добросовісної комунікації.',
            impact:
              'Об’єктивний розгляд обставин і підтвердження принципової позиції.',
            tradeoff:
              'Вимагає послідовності, але зберігає честь і довіру.',
            criminologicalForecast:
              'Чесність і дотримання процедур знижують ризик помилок у професійній діяльності та підтримують довіру до органів державної влади і правосуддя.',
          },
          nextStageId: null,
        },
      ],
    },
  },
};

export function GroupSessionPage() {
  const { id } = useParams<{ id: string }>();
  const scenarioId =
    id === 'favor-for-friend' ? 'favor-for-friend' : 'supervisor-pressure';
  const scenarioData = findScenario(scenarioId);
  const stages = GROUP_STAGES[scenarioId];

  const [currentStageId, setCurrentStageId] = useState('step-1');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [fontSizeMode, setFontSizeMode] = useState<FontSizeMode>('medium');
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [history, setHistory] = useState<
    { title: string; option: GroupOption; votesCount: number }[]
  >([]);

  useEffect(() => {
    setCurrentStageId('step-1');
    setVotes({});
    setIsCompleted(false);
    setMetrics(INITIAL_METRICS);
    setHistory([]);
  }, [scenarioId]);

  const stage = stages[currentStageId] || stages['step-1'];
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const leadingOption = stage.options.reduce(
    (best, opt) => ((votes[opt.id] || 0) > (votes[best.id] || 0) ? opt : best),
    stage.options[0]
  );

  const setVoteExact = (optId: string, nextValue: number) => {
    const clamped = Math.min(MAX_VOTES_PER_OPTION, Math.max(0, nextValue));
    setVotes((prev) => ({ ...prev, [optId]: clamped }));
  };

  const changeVote = (optId: string, delta: number) => {
    setVotes((prev) => {
      const current = prev[optId] || 0;
      const next = Math.min(MAX_VOTES_PER_OPTION, Math.max(0, current + delta));
      return { ...prev, [optId]: next };
    });
  };

  const annulOptionVotes = (optId: string) => {
    setVotes((prev) => ({ ...prev, [optId]: 0 }));
  };

  const annulStageVotes = () => {
    setVotes({});
  };

  const handleConfirmStageDecision = () => {
    const winner = leadingOption;
    setMetrics((prev) => ({
      integrity: Math.min(
        100,
        Math.max(0, prev.integrity + winner.metricsDelta.integrity)
      ),
      peerTrust: Math.min(
        100,
        Math.max(0, prev.peerTrust + winner.metricsDelta.peerTrust)
      ),
      institutionalTrust: Math.min(
        100,
        Math.max(0, prev.institutionalTrust + winner.metricsDelta.institutionalTrust)
      ),
    }));
    setHistory((prev) => [
      ...prev,
      { title: stage.title, option: winner, votesCount: totalVotes },
    ]);

    if (winner.nextStageId && stages[winner.nextStageId]) {
      setCurrentStageId(winner.nextStageId);
      setVotes({});
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStageId('step-1');
    setVotes({});
    setIsCompleted(false);
    setMetrics(INITIAL_METRICS);
    setHistory([]);
  };

  const scaleClasses =
    fontSizeMode === 'large'
      ? 'text-base sm:text-lg leading-[1.68]'
      : fontSizeMode === 'small'
        ? 'text-xs sm:text-sm leading-[1.58]'
        : 'text-sm sm:text-base leading-[1.62]';

  const explanationTextClasses =
    fontSizeMode === 'large'
      ? 'text-sm sm:text-base leading-[1.65]'
      : fontSizeMode === 'small'
        ? 'text-xs sm:text-sm leading-[1.55]'
        : 'text-sm sm:text-[15px] leading-[1.6]';

  const renderScaleSwitcher = () => (
    <div className="inline-flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-xl">
      <Type className="w-4 h-4 text-slate-300 ml-1" />
      <button
        type="button"
        onClick={() => setFontSizeMode('small')}
        title="Малий шрифт"
        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
          fontSizeMode === 'small'
            ? 'bg-teal-500 text-slate-950'
            : 'text-slate-200 hover:bg-slate-800'
        }`}
      >
        A-
      </button>
      <button
        type="button"
        onClick={() => setFontSizeMode('medium')}
        title="Середній шрифт"
        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
          fontSizeMode === 'medium'
            ? 'bg-teal-500 text-slate-950'
            : 'text-slate-200 hover:bg-slate-800'
        }`}
      >
        A
      </button>
      <button
        type="button"
        onClick={() => setFontSizeMode('large')}
        title="Великий шрифт"
        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
          fontSizeMode === 'large'
            ? 'bg-teal-500 text-slate-950'
            : 'text-slate-200 hover:bg-slate-800'
        }`}
      >
        A+
      </button>
    </div>
  );

  if (isCompleted) {
    return (
      <div className={`max-w-4xl mx-auto px-4 py-8 space-y-6 ${scaleClasses}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/scenarios/${scenarioId}`}
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Повернутися до опису сценарію
          </Link>
          {renderScaleSwitcher()}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 text-teal-300">
            <Award className="w-8 h-8 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Підсумок групової сесії
              </h1>
              <p className="text-sm text-slate-300">{scenarioData?.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-medium text-slate-300">
                Доброчесність
              </div>
              <div className="text-2xl font-bold text-teal-300">
                {metrics.integrity}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-medium text-slate-300">
                Довіра колективу
              </div>
              <div className="text-2xl font-bold text-sky-300">
                {metrics.peerTrust}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-medium text-slate-300">
                Інституційна довіра
              </div>
              <div className="text-2xl font-bold text-amber-300">
                {metrics.institutionalTrust}%
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {history.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-slate-900/85 border border-slate-800 space-y-3 ${explanationTextClasses}`}
              >
                <div className="text-xs font-bold text-teal-300 uppercase tracking-wide">
                  {item.title} • Голосів: {item.votesCount}
                </div>
                <div className="text-lg sm:text-xl font-bold text-white">
                  {item.option.label}
                </div>
                <p className="text-rose-100">
                  <Scale className="w-4 h-4 inline mr-1.5 text-rose-400" />
                  <strong className="text-rose-300">
                    Нормативно-правові акти / оцінка:
                  </strong>{' '}
                  {item.option.feedback.violated}
                </p>
                <p className="text-amber-100">
                  <AlertTriangle className="w-4 h-4 inline mr-1.5 text-amber-400" />
                  <strong className="text-amber-300">На що це вплине:</strong>{' '}
                  {item.option.feedback.impact}
                </p>
                <p className="text-emerald-100">
                  <ShieldCheck className="w-4 h-4 inline mr-1.5 text-emerald-400" />
                  <strong className="text-emerald-300">
                    Компроміс / ціна вибору:
                  </strong>{' '}
                  {item.option.feedback.tradeoff}
                </p>
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-sky-500/35 text-sky-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sky-300">
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span>Кримінологічний прогноз подальших наслідків:</span>
                  </div>
                  <p>{item.option.feedback.criminologicalForecast}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Почати групову сесію заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 space-y-6 ${scaleClasses}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/scenarios/${scenarioId}`}
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> До опису сценарію
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {renderScaleSwitcher()}
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/35 px-3 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5" /> Груповий режим • Крок{' '}
            {stage.stepNumber} з 3
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {stage.title}
          </h1>
          <div className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 text-slate-100">
            {stage.situation}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-medium text-slate-300">
              Доброчесність
            </div>
            <div className="text-xl font-bold text-teal-300">
              {metrics.integrity}%
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-medium text-slate-300">
              Довіра колективу
            </div>
            <div className="text-xl font-bold text-sky-300">
              {metrics.peerTrust}%
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-medium text-slate-300">
              Інституційна довіра
            </div>
            <div className="text-xl font-bold text-amber-300">
              {metrics.institutionalTrust}%
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {stage.options.map((option) => {
            const count = votes[option.id] || 0;
            const pct =
              totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <div
                key={option.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-base sm:text-lg font-bold text-teal-300">
                      {option.label}
                    </div>
                    <p className="text-slate-100">{option.actionText}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => changeVote(option.id, -1)}
                      disabled={count === 0}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-45 border border-slate-700 text-white cursor-pointer"
                      title="Мінус 1 голос"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => changeVote(option.id, 1)}
                      disabled={count >= MAX_VOTES_PER_OPTION}
                      className="px-3 py-2 rounded-xl bg-teal-600/35 hover:bg-teal-600/55 disabled:opacity-45 border border-teal-500/45 text-teal-100 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> +1
                    </button>
                    <button
                      type="button"
                      onClick={() => changeVote(option.id, 10)}
                      disabled={count >= MAX_VOTES_PER_OPTION}
                      className="px-3 py-2 rounded-xl bg-sky-600/30 hover:bg-sky-600/45 disabled:opacity-45 border border-sky-500/45 text-sky-100 text-xs font-bold cursor-pointer"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoteExact(option.id, MAX_VOTES_PER_OPTION)}
                      disabled={count >= MAX_VOTES_PER_OPTION}
                      className="px-3 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/45 disabled:opacity-45 border border-amber-500/45 text-amber-100 text-xs font-bold cursor-pointer"
                    >
                      100
                    </button>
                    <button
                      type="button"
                      onClick={() => annulOptionVotes(option.id)}
                      disabled={count === 0}
                      className="px-3 py-2 rounded-xl bg-rose-950/75 hover:bg-rose-900/80 disabled:opacity-45 border border-rose-500/40 text-rose-100 text-xs font-semibold cursor-pointer"
                    >
                      Анулювати
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-300">
                    <span>
                      Голосів: {count} / {MAX_VOTES_PER_OPTION}
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-400 h-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`pt-3.5 border-t border-slate-800 space-y-2.5 ${explanationTextClasses}`}
                >
                  <p className="text-slate-100">
                    <Scale className="w-4 h-4 inline mr-1.5 text-rose-400" />
                    <strong className="text-rose-300">
                      Нормативно-правові акти / оцінка:
                    </strong>{' '}
                    {option.feedback.violated}
                  </p>
                  <p className="text-slate-100">
                    <AlertTriangle className="w-4 h-4 inline mr-1.5 text-amber-400" />
                    <strong className="text-amber-300">На що це вплине:</strong>{' '}
                    {option.feedback.impact}
                  </p>
                  <p className="text-slate-100">
                    <ShieldCheck className="w-4 h-4 inline mr-1.5 text-emerald-400" />
                    <strong className="text-emerald-300">
                      Компроміс / ціна вибору:
                    </strong>{' '}
                    {option.feedback.tradeoff}
                  </p>
                  <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-sky-500/30 text-sky-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sky-300">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span>Кримінологічний прогноз подальших наслідків:</span>
                    </div>
                    <p>{option.feedback.criminologicalForecast}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-base sm:text-lg">
            <MessageSquare className="w-5 h-5 shrink-0" />
            <span>Питання для обговорення з викладачем:</span>
          </div>
          <ul className="space-y-2 text-sm sm:text-base text-slate-100 leading-[1.65]">
            {stage.discussionPrompts.map((prompt, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={annulStageVotes}
              disabled={totalVotes === 0}
              className="px-4 py-2.5 rounded-xl bg-rose-950/75 hover:bg-rose-900/80 disabled:opacity-45 border border-rose-500/40 text-rose-100 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <XCircle className="w-4 h-4" /> Анулювати голоси етапу
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Скинути сесію
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirmStageDecision}
            className="w-full sm:w-auto py-3.5 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {stage.stepNumber < 3
                ? 'Зафіксувати та перейти далі'
                : 'Завершити та сформувати звіт'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupSessionPage;