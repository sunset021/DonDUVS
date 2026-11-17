import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldAlert, RotateCcw, Award, Users, Landmark, Lightbulb } from 'lucide-react';
import { findScenario } from '../scenarios';

interface FeedbackData {
  violated: string;
  impact: string;
  tradeoff: string;
}

interface StageOption {
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

interface Stage {
  id: string;
  stepNumber: number;
  title: string;
  situation: string;
  options: StageOption[];
}

export default function ScenarioPlayPage() {
  const { id } = useParams<{ id: string }>();
  const scenarioData = findScenario(id || '');

  const [currentStageId, setCurrentStageId] = useState<string>('step-1');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  const [metrics, setMetrics] = useState({
    integrity: 50,
    peerTrust: 50,
    institutionalTrust: 50,
  });

  const [history, setHistory] = useState<{ stageTitle: string; optionLabel: string; feedback: FeedbackData; delta: { integrity: number; peerTrust: number; institutionalTrust: number } }[]>([]);

  const stages: Record<string, Stage> = {
    'step-1': {
      id: 'step-1',
      stepNumber: 1,
      title: 'Етап 1: Вечірня перевірка та непомітна прогалина',
      situation:
        'Ви — курсант старшого курсу, командир взводу. За кілька хвилин до вечірньої перевірки ви помічаєте, що двоє курсантів із вашого взводу самовільно залишили розташування. Черговий офіцер уже починає обхід.',
      options: [
        {
          id: 'A',
          label: 'Варіант А: Покривання відсутніх (Курсантська солідарність)',
          actionText: 'Збрехати черговому офіцеру про те, що курсанти нібито перебувають у медсанчастині.',
          metricsDelta: { integrity: -25, peerTrust: 30, institutionalTrust: -20 },
          feedback: {
            violated:
              'Порушено ст. 11, 16 Дисциплінарного статуту Національної поліції України, вимоги Статуту щодо правдивості доповіді керівництву.',
            impact:
              'У разі виявлення обману під час перевірки журналів медсанчастини загрожує розгляд на дисциплінарній комісії.',
            tradeoff:
              'Збережено мікроклімат у колективі та авторитет серед курсантів, проте втрачено особисту службову чесноту.',
          },
          nextStageId: 'step-2',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Принципова доповідь за Статутом',
          actionText: 'Доповісти черговому офіцеру реальний стан речей без жодних прикрас.',
          metricsDelta: { integrity: 30, peerTrust: -35, institutionalTrust: 25 },
          feedback: {
            violated:
              'Жодних нормативних актів з вашого боку не порушено. Виконано вимоги щодо неухильного дотримання службової дисципліни.',
            impact:
              'Командування відзначить вашу принциповість, але курсанти сприймуть це як здачу своїх.',
            tradeoff:
              'Повна юридична та дисциплінарна безпека для вас особисто ціною внутрішнього конфлікту у підрозділі.',
          },
          nextStageId: 'step-2',
        },
      ],
    },
    'step-2': {
      id: 'step-2',
      stepNumber: 2,
      title: 'Етап 2: Наслідки та реакція колективу',
      situation:
        'Ситуація набула розголосу. Керівництво курсу вимагає пояснень щодо того, чому контроль за особовим складом було ослаблено. Перед вами ставлять питання про офіційне оформлення пояснювальної записки.',
      options: [
        {
          id: 'A',
          label: 'Варіант А: Написати рапорт обтічно (пом\'якшити провину)',
          actionText: 'Вказати у пояснювальній, що про відсутність стало відомо лише в останню хвилину.',
          metricsDelta: { integrity: -15, peerTrust: 15, institutionalTrust: -10 },
          feedback: {
            violated:
              'Порушено принцип повноти та достовірності службової документації (ст. 3 Закону України Про Національну поліцію).',
            impact:
              'Створюється ризик перекладання відповідальності, а формальне приховування реального часу виявлення може розкритися.',
            tradeoff:
              'М\'якше дисциплінарне стягнення для курсу, але балансування на межі службової нещирості.',
          },
          nextStageId: 'step-3',
        },
        {
          id: 'Б',
          label: 'Варіант Б: Повна і детальна правда у рапорті',
          actionText: 'Викласти всі факти як є, взявши на себе відповідальність за недогляд командира взводу.',
          metricsDelta: { integrity: 25, peerTrust: -15, institutionalTrust: 30 },
          feedback: {
            violated:
              'Порушень немає. Продемонстровано високий стандарт службової культури та готовність відповідати за підрозділ.',
            impact:
              'Офіцери бачать у вас зрілого майбутнього офіцера, здатного адекватно реагувати на кризові ситуації.',
            tradeoff:
              'Ви отримуєте офіційне зауваження за слабкий контроль, проте зберігаєте бездоганну репутацію перед керівництвом.',
          },
          nextStageId: 'step-3',
        },
      ],
    },
    'step-3': {
      id: 'step-3',
      stepNumber: 3,
      title: 'Етап 3: Висновки та управлінське рішення',
      situation:
        'Інцидент вичерпано, проте настав час проводити профілактичну роботу з курсантами, які самовільно залишали розташування. Як ви поступите як командир?',
      options: [
        {
          id: 'A',
          label: 'Варіант А: Вирішити все всередині колективу',
          actionText: 'Провести сувору розмову віч-на-віч, не виносячи сміття з хати на офіційний рівень.',
          metricsDelta: { integrity: -10, peerTrust: 20, institutionalTrust: -15 },
          feedback: {
            violated:
              'Неформальне вирішення службових проступків порушує порядок реагування на правопорушення, передбачений відомчими інструкціями.',
            impact:
              'Проблема може повторитися, оскільки офіційного запобіжного правового механізму задіяно не було.',
            tradeoff:
              'Збережено авторитет хлопців перед керівництвом, але відсутній правовий виховний ефект.',
          },
          nextStageId: null,
        },
        {
          id: 'Б',
          label: 'Варіант Б: Ініціювати офіційне профілактичне заняття',
          actionText: 'Доповісти керівництву про готовність провести відкрите обговорення норм дисципліни.',
          metricsDelta: { integrity: 25, peerTrust: 10, institutionalTrust: 25 },
          feedback: {
            violated:
              'Повністю дотримано норм чинного законодавства та статутних вимог щодо виховної роботи у колективі.',
            impact:
              'Формується нульова толерантність до порушень серед курсантів, підняття загальної правової свідомості.',
            tradeoff:
              'Вимагає значних моральних зусиль та подолання тиску колективу, проте дає довгостроковий позитивний результат.',
          },
          nextStageId: null,
        },
      ],
    },
  };

  const currentStage = stages[currentStageId] || stages['step-1'];

  const handleConfirm = () => {
    const selectedOption = currentStage.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) return;

    setMetrics((prev) => ({
      integrity: Math.min(100, Math.max(0, prev.integrity + selectedOption.metricsDelta.integrity)),
      peerTrust: Math.min(100, Math.max(0, prev.peerTrust + selectedOption.metricsDelta.peerTrust)),
      institutionalTrust: Math.min(100, Math.max(0, prev.institutionalTrust + selectedOption.metricsDelta.institutionalTrust)),
    }));

    setHistory((prev) => [
      ...prev,
      {
        stageTitle: currentStage.title,
        optionLabel: selectedOption.label,
        feedback: selectedOption.feedback,
        delta: selectedOption.metricsDelta,
      },
    ]);

    if (selectedOption.nextStageId) {
      setCurrentStageId(selectedOption.nextStageId);
      setSelectedOptionId(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStageId('step-1');
    setSelectedOptionId(null);
    setIsCompleted(false);
    setMetrics({ integrity: 50, peerTrust: 50, institutionalTrust: 50 });
    setHistory([]);
  };

  const getVerdict = (integrityScore: number) => {
    if (integrityScore >= 80) {
      return {
        title: '💎 Еталон професійної доброчесності',
        desc: 'Ви дієте виключно в межах закону, статутів та моральних принципів офіцера поліції. Керівництво бачить у вас лідера майбутнього, хоча колеги можуть вважати вас занадто принциповим.',
        color: 'text-teal-400 border-teal-500/40 bg-teal-950/30',
        tips: [
          'Продовжуйте тримати високий стандарт правової культури, але працюйте над комунікацією з колективом, щоб принциповість не сприймалася як відірваність від команди.',
          'Використовуйте свій авторитет для того, щоб м’яко спрямовувати колег у правове русло без зайвого тиску.',
        ],
      };
    } else if (integrityScore >= 45) {
      return {
        title: '⚖️ Прагматичний балансир',
        desc: 'Ви намагаєтеся маневрувати між людськими стосунками у колективі та суворими вимогами інструкцій. Це зменшує конфлікти, але створює ризики дисциплінарної відповідальності.',
        color: 'text-amber-400 border-amber-500/40 bg-amber-950/30',
        tips: [
          'Зверніть увагу на те, що намагання догодити всім часто призводить до розмивання службової відповідальності.',
          'У реальних кризових ситуаціях завжди ставте вимоги закону та статутів вище за особисті симпатії до колег.',
        ],
      };
    } else {
      return {
        title: '⚠️ Зона ризику: Порушення службової дисципліни',
        desc: 'Схильність покривати порушення заради курсантської солідарності призвела до критичного зниження рівня доброчесності. Такий стиль поведінки загрожує розслідуванням.',
        color: 'text-rose-400 border-rose-500/40 bg-rose-950/30',
        tips: [
          'Терміново перегляньте ставлення до норм Дисциплінарного статуту НПУ: «солідарність», що суперечить закону, є прямим шляхом до службових стягнень.',
          'Пам’ятайте, що справжня підтримка товаришів полягає не в тому, щоб приховати їхній проступок, а в тому, щоб допомогти їм уникнути помилок у майбутньому.',
        ],
      };
    }
  };

  if (isCompleted) {
    const verdict = getVerdict(metrics.integrity);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 text-teal-400 border-b border-slate-800 pb-4">
            <Award className="w-9 h-9" />
            <div>
              <h1 className="text-2xl font-bold">Фінальний звіт симулятора</h1>
              <p className="text-xs text-slate-400">Аналіз прийнятих управлінських та етичних рішень</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-teal-400"/> Доброчесність</span>
                <span className="font-bold text-teal-400">{metrics.integrity}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full transition-all duration-500" style={{ width: `${metrics.integrity}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-400"/> Довіра взводу</span>
                <span className="font-bold text-blue-400">{metrics.peerTrust}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${metrics.peerTrust}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1.5"><Landmark className="w-4 h-4 text-purple-400"/> Довіра керівництва</span>
                <span className="font-bold text-purple-400">{metrics.institutionalTrust}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${metrics.institutionalTrust}%` }}></div>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-xl border ${verdict.color} space-y-2`}>
            <div className="font-bold text-lg">{verdict.title}</div>
            <p className="text-sm text-slate-300 leading-relaxed">{verdict.desc}</p>
          </div>

          {/* Блок експертних порад */}
          <div className="bg-slate-950/90 p-5 rounded-xl border border-teal-500/30 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
              <Lightbulb className="w-5 h-5" />
              <span>Рекомендації та поради на що звернути увагу:</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {verdict.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Хронологія ваших рішень:</h3>
            <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2">
              {history.map((item, index) => (
                <div key={index} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-teal-400 uppercase">
                    <span>{item.stageTitle}</span>
                    <span className="text-slate-400">
                      Зміна доброчесності: <span className={item.delta.integrity >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{item.delta.integrity > 0 ? `+${item.delta.integrity}%` : `${item.delta.integrity}%`}</span>
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-200">Вибір: {item.optionLabel}</div>
                  <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-900">
                    <div><span className="text-rose-400 font-semibold">Порушено:</span> {item.feedback.violated}</div>
                    <div><span className="text-amber-400 font-semibold">Наслідок:</span> {item.feedback.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Пройти сценарій знову
            </button>
            <Link
              to="/scenarios"
              className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
            >
              До каталогу сценаріїв
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Назад до сценаріїв {scenarioData ? `(${scenarioData.title})` : ''}
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-teal-400 font-semibold uppercase tracking-wider text-xs bg-teal-950/60 px-3 py-1 rounded-full border border-teal-800/50">
              КРОК {currentStage.stepNumber} З 3
            </div>
            <div className="text-slate-400 text-xs flex items-center gap-1">
              Симулятор етичного вибору НПУ
            </div>
          </div>

          <h1 className="text-xl font-bold text-slate-100">{currentStage.title}</h1>
          <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            {currentStage.situation}
          </p>

          <div className="space-y-3 pt-2">
            {currentStage.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-500 shadow-lg ring-1 ring-teal-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="font-semibold text-teal-300">{opt.label}</div>
                  <div className="text-sm text-slate-300 mt-1">{opt.actionText}</div>

                  {isSelected && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-teal-500/40 text-sm space-y-3">
                      <div className="font-semibold text-teal-400 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-teal-400" />
                        <span>Правовий та управлінський аналіз (Статті та норми):</span>
                      </div>

                      <div className="text-slate-200">
                        <span className="font-semibold text-rose-400">Що порушено: </span>
                        {opt.feedback.violated}
                      </div>

                      <div className="text-slate-200">
                        <span className="font-semibold text-amber-400">На що це вплине: </span>
                        {opt.feedback.impact}
                      </div>

                      <div className="text-slate-300 pt-2 border-t border-slate-800">
                        <span className="font-semibold text-emerald-400">Компроміс: </span>
                        {opt.feedback.tradeoff}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedOptionId && (
            <button
              onClick={handleConfirm}
              className="w-full mt-4 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" /> 
              {currentStageId === 'step-3' ? 'Завершити сценарій та переглянути підсумковий звіт' : 'Підтвердити вибір та перейти далі'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}