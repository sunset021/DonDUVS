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
} from 'lucide-react';
import { findScenario } from '../scenarios';

interface GroupOption {
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

interface GroupStage {
  id: string;
  stepNumber: number;
  title: string;
  situation: string;
  options: GroupOption[];
}

const GROUP_STAGES: Record<string, Record<string, GroupStage>> = {
  'favor-for-friend': {
    'step-1': {
      id: 'step-1',
      stepNumber: 1,
      title: 'Етап 1: Вечірня перевірка у взводі',
      situation:
        'Перед вечірньою перевіркою виявляється, що двоє курсантів самовільно залишили розташування. Група обговорює, як реагувати перед приходом чергового.',
      options: [
        {
          id: 'A',
          label: 'Варіант А: Прикрити відсутніх перед перевіркою',
          actionText: 'Надати неправдиву інформацію про причину відсутності.',
          metricsDelta: { integrity: -25, peerTrust: 25, institutionalTrust: -20 },
          violated: 'Порушено вимоги дисципліни та достовірної доповіді.',
          consequences: 'Ризик викриття під час звірки та службової перевірки.',
          forecast:
            'Звичка до неправдивих доповідей підвищує ризик помилок і підриває довіру до органів державної влади і правосуддя.',
          nextStageId: 'step-2',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Доповісти фактичний стан справ',
          actionText: 'Чесно доповісти про відсутність і вжиті заходи.',
          metricsDelta: { integrity: 30, peerTrust: -20, institutionalTrust: 25 },
          violated: 'Порушень немає. Дотримано вимог статутного порядку.',
          consequences: 'Об’єктивна доповідь; можливе обговорення в колективі.',
          forecast:
            'Дотримання правил знижує ризик помилок і підтримує довіру до органів державної влади і правосуддя.',
          nextStageId: 'step-2',
        },
      ],
    },
    'step-2': {
      id: 'step-2',
      stepNumber: 2,
      title: 'Етап 2: Оформлення пояснень',
      situation:
        'Керівництво вимагає письмові пояснення. Група радиться, як описати хронологію подій.',
      options: [
        {
          id: 'A',
          label: 'Варіант А: Змінити час виявлення відсутності',
          actionText: 'Вказати неточний час у поясненні.',
          metricsDelta: { integrity: -15, peerTrust: 15, institutionalTrust: -15 },
          violated: 'Порушено принцип достовірності службових документів.',
          consequences: 'Суперечності з іншими матеріалами перевірки.',
          forecast:
            'Неточність у документах веде до помилок і підриває довіру до органів державної влади і правосуддя.',
          nextStageId: 'step-3',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Викласти точні факти',
          actionText: 'Описати події об’єктивно та без викривлень.',
          metricsDelta: { integrity: 25, peerTrust: -10, institutionalTrust: 25 },
          violated: 'Порушень немає. Дотримано повноти та точності пояснень.',
          consequences: 'Прозора фіксація фактів.',
          forecast:
            'Точність зміцнює правову культуру та підтримує довіру до органів державної влади і правосуддя.',
          nextStageId: 'step-3',
        },
      ],
    },
    'step-3': {
      id: 'step-3',
      stepNumber: 3,
      title: 'Етап 3: Профілактика в колективі',
      situation:
        'Група підбиває підсумки та вирішує, як запобігти подібним ситуаціям надалі.',
      options: [
        {
          id: 'A',
          label: 'Варіант А: Лише неформальна розмова',
          actionText: 'Не впроваджувати системних заходів профілактики.',
          metricsDelta: { integrity: -10, peerTrust: 15, institutionalTrust: -10 },
          violated: 'Недостатній превентивний підхід.',
          consequences: 'Ризик повторення порушень.',
          forecast:
            'Відсутність системності підвищує ризик помилок і шкодить довірі до органів державної влади і правосуддя.',
          nextStageId: null,
        },
        {
          id: 'Б',
          label: 'Варіант Б: Системна профілактика та контроль',
          actionText: 'Запровадити регулярний розбір вимог і взаємний контроль.',
          metricsDelta: { integrity: 25, peerTrust: 10, institutionalTrust: 25 },
          violated: 'Порушень немає. Сформовано превентивний підхід.',
          consequences: 'Зростання дисципліни та зниження ризиків.',
          forecast:
            'Системна профілактика зменшує ризик помилок і зміцнює довіру до органів державної влади і правосуддя.',
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
        'Викладач пропонує придбати «методичку» за 500 грн за гарантований залік і просить не розголошувати це.',
      options: [
        {
          id: 'A',
          label: 'Варіант А: Придбати за неформальною домовленістю',
          actionText: 'Заплатити за «методичку» заради заліку.',
          metricsDelta: { integrity: -25, peerTrust: 15, institutionalTrust: -25 },
          violated: 'Ознаки порушення академічної доброчесності та антикорупційних правил.',
          consequences: 'Втрата реальних знань та неформальна залежність.',
          forecast:
            'Неформальні практики підвищують ризик помилок і підривають довіру до органів державної влади і правосуддя.',
          nextStageId: 'step-2',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Відмовитися та діяти за процедурою',
          actionText: 'Відмовитися, готуватися самостійно й повідомити уповноважений підрозділ.',
          metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 25 },
          violated: 'Порушень немає. Дотримано доброчесності.',
          consequences: 'Чесна підготовка; можливий тиск з боку частини оточення.',
          forecast:
            'Принциповість знижує ризик помилок і підтримує довіру до органів державної влади і правосуддя.',
          nextStageId: 'step-2',
        },
      ],
    },
    'step-2': {
      id: 'step-2',
      stepNumber: 2,
      title: 'Етап 2: Сесія та позиція групи',
      situation:
        'Під час сесії виникає тиск: частина групи пропонує адаптуватися, щоб не ускладнювати здачу.',
      options: [
        {
          id: 'A',
          label: 'Варіант А: Поступитися тиску',
          actionText: 'Погодитися на неформальні умови під час сесії.',
          metricsDelta: { integrity: -35, peerTrust: 20, institutionalTrust: -30 },
          violated: 'Посилення ризиків порушення доброчесності.',
          consequences: 'Закріплення неформальної практики.',
          forecast:
            'Поступки тиску підвищують ризик помилок і шкодять довірі до органів державної влади і правосуддя.',
          nextStageId: 'step-3',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Звернутися до уповноваженого підрозділу',
          actionText: 'Подати офіційне звернення щодо упередженого оцінювання.',
          metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 30 },
          violated: 'Порушень немає. Реалізовано право на об’єктивне оцінювання.',
          consequences: 'Переведення ситуації у правову площину.',
          forecast:
            'Дія за процедурою знижує ризик помилок і підтримує довіру до органів державної влади і правосуддя.',
          nextStageId: 'step-3',
        },
      ],
    },
    'step-3': {
      id: 'step-3',
      stepNumber: 3,
      title: 'Етап 3: Перевірка та пояснення',
      situation:
        'Розпочато перевірку. Групі потрібно визначитися з характером пояснень.',
      options: [
        {
          id: 'A',
          label: 'Варіант А: Надати неповні або неправдиві пояснення',
          actionText: 'Приховати відомі обставини під час перевірки.',
          metricsDelta: { integrity: -30, peerTrust: 10, institutionalTrust: -35 },
          violated: 'Порушено вимогу достовірності пояснень.',
          consequences: 'Ризик відповідальності та втрати довіри.',
          forecast:
            'Недостовірність підриває точність і довіру до органів державної влади і правосуддя.',
          nextStageId: null,
        },
        {
          id: 'Б',
          label: 'Варіант Б: Надати повні та достовірні пояснення',
          actionText: 'Чесно викласти всі відомі факти.',
          metricsDelta: { integrity: 35, peerTrust: -10, institutionalTrust: 30 },
          violated: 'Порушень немає. Дотримано обов’язку достовірної комунікації.',
          consequences: 'Об’єктивність перевірки.',
          forecast:
            'Правдивість зміцнює професійну культуру та підтримує довіру до органів державної влади і правосуддя.',
          nextStageId: null,
        },
      ],
    },
  },
};

export function GroupSessionPage() {
  const { id } = useParams<{ id: string }>();
  const scenarioId = id === 'favor-for-friend' ? 'favor-for-friend' : 'supervisor-pressure';
  const scenarioData = findScenario(scenarioId);
  const stages = GROUP_STAGES[scenarioId];

  const [currentStageId, setCurrentStageId] = useState('step-1');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [metrics, setMetrics] = useState({
    integrity: 50,
    peerTrust: 50,
    institutionalTrust: 50,
  });
  const [history, setHistory] = useState<
    { title: string; option: GroupOption; votesCount: number }[]
  >([]);

  useEffect(() => {
    setCurrentStageId('step-1');
    setVotes({});
    setIsCompleted(false);
    setMetrics({ integrity: 50, peerTrust: 50, institutionalTrust: 50 });
    setHistory([]);
  }, [scenarioId]);

  const stage = stages[currentStageId] || stages['step-1'];
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const changeVote = (optId: string, delta: number) => {
    setVotes((prev) => ({
      ...prev,
      [optId]: Math.max(0, (prev[optId] || 0) + delta),
    }));
  };

  const handleConfirmStage = () => {
    const winner = stage.options.reduce(
      (best, opt) => ((votes[opt.id] || 0) > (votes[best.id] || 0) ? opt : best),
      stage.options[0]
    );

    setMetrics((prev) => ({
      integrity: Math.min(100, Math.max(0, prev.integrity + winner.metricsDelta.integrity)),
      peerTrust: Math.min(100, Math.max(0, prev.peerTrust + winner.metricsDelta.peerTrust)),
      institutionalTrust: Math.min(
        100,
        Math.max(0, prev.institutionalTrust + winner.metricsDelta.institutionalTrust)
      ),
    }));
    setHistory((prev) => [...prev, { title: stage.title, option: winner, votesCount: totalVotes }]);

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
          <ArrowLeft className="w-4 h-4" /> Повернутися до опису сценарію
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 text-teal-300">
            <Award className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold text-white">Підсумок групової сесії</h1>
              <p className="text-sm text-slate-400">{scenarioData?.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Доброчесність</div>
              <div className="text-2xl font-bold text-teal-300">{metrics.integrity}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Довіра колективу</div>
              <div className="text-2xl font-bold text-sky-300">{metrics.peerTrust}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Інституційна довіра</div>
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
                <div className="text-xs font-bold text-teal-300">
                  {item.title} • Голосів: {item.votesCount}
                </div>
                <div className="text-base font-bold text-white">{item.option.label}</div>
                <p className="text-sm text-rose-200">
                  <Scale className="w-4 h-4 inline mr-1" />
                  <strong>Оцінка:</strong> {item.option.violated}
                </p>
                <p className="text-sm text-amber-200">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  <strong>Наслідки:</strong> {item.option.consequences}
                </p>
                <p className="text-sm text-sky-200">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  <strong>Прогноз:</strong> {item.option.forecast}
                </p>
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/scenarios/${scenarioId}`}
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> До опису сценарію
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/50 border border-amber-500/30 px-3 py-1.5 rounded-full">
          <Users className="w-3.5 h-3.5" /> Груповий режим • Крок {stage.stepNumber} з 3
        </span>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{stage.title}</h1>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 leading-relaxed">
            {stage.situation}
          </div>
        </div>

        <div className="space-y-4">
          {stage.options.map((option) => {
            const count = votes[option.id] || 0;
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <div
                key={option.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/75 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-base font-bold text-teal-300">{option.label}</div>
                    <p className="text-sm text-slate-200">{option.actionText}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => changeVote(option.id, -1)}
                      disabled={count === 0}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => changeVote(option.id, 1)}
                      className="px-3.5 py-2 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-200 text-sm font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> +1 голос
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-400">
                  <span>Голосів: {count}</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-400 h-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleConfirmStage}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{stage.stepNumber < 3 ? 'Зафіксувати та перейти далі' : 'Завершити сесію'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupSessionPage;