import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Eye,
  EyeOff,
  MessageSquare,
  CheckCircle2,
  RotateCcw,
  Award,
  ShieldAlert,
  Landmark,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { findScenario } from '../scenarios';

interface FeedbackData {
  violated: string;
  impact: string;
  tradeoff: string;
  criminologicalForecast: string;
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

interface GroupStage {
  id: string;
  stepNumber: number;
  title: string;
  situation: string;
  discussionPrompts: string[];
  options: StageOption[];
}

const GROUP_FRIEND_STAGES: Record<string, GroupStage> = {
  'step-1': {
    id: 'step-1',
    stepNumber: 1,
    title: 'Етап 1: Вечірня перевірка та непомітна прогалина',
    situation:
      'Ви — курсант старшого курсу, командир взводу. За кілька хвилин до вечірньої перевірки ви помічаєте, що двоє курсантів із вашого взводу самовільно залишили розташування. Черговий офіцер уже починає обхід.',
    discussionPrompts: [
      'Чому в групі виникає бажання підтримати своїх під час перевірки та як це співвідноситься з вимогами дисципліни?',
      'Де проходить межа між товариською підтримкою та порушенням обов’язку достовірно доповідати?',
      'Як неправдиві відомості у службовій комунікації впливають на авторитет та довіру до органів державної влади і правосуддя?',
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
            'Порушено ст. 11, 16 Дисциплінарного статуту Національної поліції України та вимоги щодо достовірності службової доповіді.',
          impact:
            'У разі перевірки облікової документації виникає підстава для дисциплінарного розгляду та притягнення до відповідальності.',
          tradeoff:
            'Збережено лояльність у групі на початковому етапі, проте знижено рівень службової доброчесності та достовірності.',
          criminologicalForecast:
            'Порушення статутних вимог щодо правдивої доповіді закріплює звичку виправдовувати неточності груповою солідарністю. У подальшій службовій діяльності поліцейського це підвищує ризик професійної деформації та процесуальних помилок, що підриває авторитет і довіру до органів державної влади і правосуддя.',
        },
        nextStageId: 'step-2',
      },
      {
        id: 'Б',
        label: 'Варіант Б: Принципова доповідь за Статутом',
        actionText:
          'Доповісти черговому офіцеру фактичний стан справ у суворій відповідності до статутних вимог.',
        metricsDelta: { integrity: 30, peerTrust: -35, institutionalTrust: 25 },
        feedback: {
          violated:
            'Порушень немає. Дотримано вимог службової дисципліни та обов’язку надавати достовірну інформацію.',
          impact:
            'Керівництво бачить реальний стан справ, але в колективі можливе тимчасове напруження через принциповість.',
          tradeoff:
            'Дотримання правил і правової коректності ціною складнішої комунікації всередині підрозділу.',
          criminologicalForecast:
            'Дотримання вимог щодо достовірної доповіді обмежує практику неформальних винятків і приховування відхилень від порядку. У подальшій службовій діяльності поліцейського це знижує вірогідність процесуальних помилок та сприяє збереженню авторитету і довіри до органів державної влади і правосуддя.',
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
    discussionPrompts: [
      'Чому під час оформлення пояснень виникає спокуса пом’якшити або змінити час виявлення події?',
      'Як точність фіксації фактів у службових документах пов’язана з подальшою роботою поліцейського?',
    ],
    options: [
      {
        id: 'A',
        label: 'Варіант А: Пом’якшене викладення обставин у поясненні',
        actionText:
          'Зазначити у пояснювальній записці, що про відсутність особового складу стало відомо безпосередньо перед перевіркою.',
        metricsDelta: { integrity: -15, peerTrust: 15, institutionalTrust: -10 },
        feedback: {
          violated:
            'Порушено принцип повноти та достовірності службової документації (ст. 3 Закону України «Про Національну поліцію» та відомчі правила документування).',
          impact:
            'Виникає ризик невідповідності пояснень іншим матеріалам перевірки та втрати довіри до зафіксованих даних.',
          tradeoff:
            'Спроба зменшити дисциплінарні наслідки для групи ціною відхилення від повної фактичної точності.',
          criminologicalForecast:
            'Неточне відображення обставин у службових поясненнях формує ризик викривлення фактів у документах. У подальшій службовій діяльності поліцейського це може призвести до процесуальних помилок та підірвати авторитет і довіру до органів державної влади і правосуддя.',
        },
        nextStageId: 'step-3',
      },
      {
        id: 'Б',
        label: 'Варіант Б: Повне та об’єктивне викладення фактів',
        actionText:
          'Відобразити всі обставини у повному обсязі та взяти відповідальність за недоліки контролю з боку командира взводу.',
        metricsDelta: { integrity: 25, peerTrust: -15, institutionalTrust: 30 },
        feedback: {
          violated:
            'Порушень немає. Продемонстровано належний рівень службової культури та відповідальності за підрозділ.',
          impact:
            'Керівництво отримує об’єктивну картину подій, а відповідальність за недогляд оформлюється коректно.',
          tradeoff:
            'Визнання недоліків контролю та можливе дисциплінарне зауваження заради достовірності службових матеріалів.',
          criminologicalForecast:
            'Повне та об’єктивне викладення обставин зміцнює відповідальність за власні рішення та знижує практику приховування помилок. У подальшій службовій діяльності поліцейського це підтримує належну фіксацію фактів, зменшує ризик помилок та зберігає авторитет і довіру до органів державної влади і правосуддя.',
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
    discussionPrompts: [
      'Чи достатньо розмови «між своїми», щоб запобігти повторенню подібних порушень?',
      'Яке значення має системна профілактика та відкрите роз’яснення правил у підготовці поліцейського?',
    ],
    options: [
      {
        id: 'A',
        label: 'Варіант А: Неформальне врегулювання всередині колективу',
        actionText:
          'Обмежитися індивідуальною розмовою без залучення встановлених процедур профілактичного та дисциплінарного реагування.',
        metricsDelta: { integrity: -10, peerTrust: 20, institutionalTrust: -15 },
        feedback: {
          violated:
            'Порушено встановлений порядок реагування на порушення дисципліни, передбачений відомчими інструкціями та статутними вимогами.',
          impact:
            'Зберігається вірогідність повторення порушень через відсутність системного профілактичного механізму.',
          tradeoff:
            'Збереження неформальних відносин у групі ціною послаблення превентивного впливу правил.',
          criminologicalForecast:
            'Заміна офіційного реагування неформальними розмовами послаблює дієвість правил і дисципліни. У подальшій службовій діяльності поліцейського це може формувати схильність до вибіркових рішень, що призводить до процесуальних помилок і підриває авторитет та довіру до органів державної влади і правосуддя.',
        },
        nextStageId: null,
      },
      {
        id: 'Б',
        label: 'Варіант Б: Ініціювання офіційного профілактичного заходу',
        actionText:
          'Внести пропозицію керівництву щодо проведення планового профілактичного заняття з роз’ясненням вимог дисципліни.',
        metricsDelta: { integrity: 25, peerTrust: 10, institutionalTrust: 25 },
        feedback: {
          violated:
            'Порушень немає. Дотримано вимог щодо профілактичної та виховної роботи та запобігання порушенням у колективі.',
          impact:
            'Формується чітке розуміння правил і підвищується дисциплінованість усього підрозділу.',
          tradeoff:
            'Потребує послідовності та витримки в умовах тиску групи, але дає стійкий позитивний результат.',
          criminologicalForecast:
            'Системна профілактична робота та чітке роз’яснення вимог знижують ризики порушень і формують стійку правову культуру. У подальшій службовій діяльності поліцейського це сприяє дотриманню процедур та зміцнює авторитет і довіру до органів державної влади і правосуддя.',
        },
        nextStageId: null,
      },
    ],
  },
};

const GROUP_LECTURER_STAGES: Record<string, GroupStage> = {
  'step-1': {
    id: 'step-1',
    stepNumber: 1,
    title: 'Етап 1: Вступне заняття та спокуса',
    situation:
      'У закладі освіти є викладач — високофаховий і авторитетний фахівець, який цікаво викладає свій предмет та користується повагою серед слухачів. Під час проведення заняття викладач повідомляє про складну життєву ситуацію та потребу в коштах через проблеми зі здоров’ям, після чого інформує про власну розробку — «Методичку» (кілька аркушів) за ціною 500 грн, придбання якої гарантує складання заліку з його дисципліни. Викладач наполягає зберігати цю розмову в конфіденційності.',
    discussionPrompts: [
      'Чому посилання на складні життєві обставини та прохання про конфіденційність ускладнюють вибір?',
      'Як оплата за формальний результат впливає на реальну підготовку майбутнього поліцейського?',
      'Які наслідки це несе для авторитету та довіри до органів державної влади і правосуддя?',
    ],
    options: [
      {
        id: 'A',
        label: 'Варіант А: «Неформальна домовленість»',
        actionText:
          'Придбати посібник за 500 грн для отримання гарантованого заліку без повноцінної підготовки та з урахуванням прохання викладача.',
        metricsDelta: { integrity: -20, peerTrust: 15, institutionalTrust: -20 },
        feedback: {
          violated:
            'Ст. 42 Закону України «Про освіту» (академічна доброчесність); ч. 1 ст. 17 Закону України «Про освіту» (обов’язок сумлінно навчатися); ст. 1 та ст. 22 Закону України «Про запобігання корупції» (ознаки неправомірної вигоди та обмеження щодо одержання вигоди); внутрішні положення ЗВО.',
          impact:
            'Отримання оцінки без реального засвоєння матеріалу створює прогалини у професійних знаннях.',
          tradeoff:
            'Формальне проходження контролю знань ціною втрати знань та закріплення неправомірної практики.',
          criminologicalForecast:
            'Одержання формального результату через неформальну оплату підміняє реальну підготовку та закріплює недоброчесні практики. У подальшій службовій діяльності поліцейського це призводить до процесуальних помилок і підриває авторитет та довіру до органів державної влади і правосуддя.',
        },
        nextStageId: 'step-2',
      },
      {
        id: 'Б',
        label: 'Варіант Б: «Пасивне уникнення»',
        actionText:
          'Відмовитися від придбання посібника, не інформувати уповноважені підрозділи про ситуацію та складати дисципліну самостійно на загальних підставах.',
        metricsDelta: { integrity: 0, peerTrust: 5, institutionalTrust: -5 },
        feedback: {
          violated:
            'Ч. 1 ст. 17 та ст. 42 Закону України «Про освіту»; ч. 2 ст. 53 Закону України «Про запобігання корупції» (загальні засади реагування на корупційні ризики); внутрішні правила ЗВО.',
          impact:
            'Особиста підготовка зберігається, але виявлений ризик в освітньому середовищі залишається нерозв’язаним.',
          tradeoff:
            'Уникнення конфлікту на старті ціною пасивної позиції щодо порушення правил.',
          criminologicalForecast:
            'Пасивне ухилення від реагування на порушення дозволяє неправомірним практикам зберігатися в середовищі. У подальшій службовій діяльності поліцейського це підвищує ризик процесуальних помилок і підриває авторитет та довіру до органів державної влади і правосуддя.',
        },
        nextStageId: 'step-2',
      },
      {
        id: 'В',
        label: 'Варіант В: «Принципове реагування»',
        actionText:
          'Відмовитися від придбання, поінформувати керівництво або уповноважений підрозділ про ознаки неправомірних вимог та складати дисципліну самостійно.',
        metricsDelta: { integrity: 25, peerTrust: -15, institutionalTrust: 25 },
        feedback: {
          violated:
            'Порушень немає. Дотримано ч. 1 ст. 53 Закону України «Про запобігання корупції», ст. 42 Закону України «Про освіту» та внутрішніх правил доброчесності ЗВО.',
          impact:
            'Формуються справжні знання та правова позиція, хоча можливе напруження у спілкуванні з частиною оточення.',
          tradeoff:
            'Дотримання принципів доброчесності та реальні знання ціною ризику нерозуміння з боку частини групи.',
          criminologicalForecast:
            'Своєчасне інформування уповноважених підрозділів та чесне навчання обмежують неправомірні практики і зміцнюють фахову підготовку. У подальшій службовій діяльності поліцейського це знижує вірогідність процесуальних помилок та підтримує авторитет і довіру до органів державної влади і правосуддя.',
        },
        nextStageId: 'step-2',
      },
    ],
  },
  'step-2': {
    id: 'step-2',
    stepNumber: 2,
    title: 'Етап 2: Перевірка на міцність (Сесія та тиск середовища)',
    situation:
      'Настає період підсумкового контролю. Слухачі, які придбали посібник, отримують заліки автоматично. Ті, хто відмовився, стикаються з упередженим ставленням: викладач ускладнює вимоги та створює штучні перешкоди під час здачі. Частина колективу висловлює невдоволення через те, що принциповість окремих осіб призводить до ускладнення ситуації для всіх, вимагаючи адаптуватися до загальних правил групи.',
    discussionPrompts: [
      'Чому під час сесії виникає тиск групи на тих, хто відмовився від неформального шляху?',
      'Коли варто звертатися до офіційних процедур захисту прав здобувача освіти?',
    ],
    options: [
      {
        id: 'A',
        label: 'Варіант А: «Поступка під тиском середовища»',
        actionText:
          'Погодитися на передачу коштів під впливом тиску групи та упередженого оцінювання для отримання заліку.',
        metricsDelta: { integrity: -40, peerTrust: 20, institutionalTrust: -30 },
        feedback: {
          violated:
            'Ст. 42 Закону України «Про освіту»; ст. 22–23 Закону України «Про запобігання корупції»; ч. 1 ст. 172-6 КУпАП (у частині ризиків щодо неправомірної вигоди); внутрішні правила ЗВО.',
          impact:
            'Зникають поточні труднощі під час сесії, але закріплюється залежність від неправомірних практик.',
          tradeoff:
            'Зняття поточного тиску ціною суттєвого відступу від принципів доброчесності.',
          criminologicalForecast:
            'Підпорядкування неформальному тиску закріплює практику обхідних рішень замість реальних знань і правил. У подальшій службовій діяльності поліцейського це підвищує ризик процесуальних помилок і підриває авторитет та довіру до органів державної влади і правосуддя.',
        },
        nextStageId: 'step-3',
      },
      {
        id: 'Б',
        label: 'Варіант Б: «Автономна підготовка без офіційного реагування»',
        actionText:
          'Не піддаватися тиску колективу, поглиблено підготуватися та скласти предмет самостійно, не ініціюючи офіційної перевірки упередженості.',
        metricsDelta: { integrity: 10, peerTrust: -5, institutionalTrust: 10 },
        feedback: {
          violated:
            'Порушень з вашого боку немає. Дії відповідають ст. 62 Закону України «Про вищу освіту» та ч. 1 ст. 17 Закону України «Про освіту», але штучні перешкоди залишаються поза офіційним реагуванням.',
          impact:
            'Власні знання зберігаються, але зростає емоційне навантаження через упереджене ставлення.',
          tradeoff:
            'Збереження власної позиції без відкритого конфлікту ціною підвищеного навантаження.',
          criminologicalForecast:
            'Самостійна підготовка дає знання, проте відсутність інституційного реагування зберігає ризики для інших учасників. У подальшій службовій діяльності поліцейського це нагадує про важливість поєднання особистої доброчесності з належним реагуванням у межах закону, щоб не підривати авторитет і довіру до органів державної влади і правосуддя.',
        },
        nextStageId: 'step-3',
      },
      {
        id: 'В',
        label: 'Варіант В: «Інституційний захист»',
        actionText:
          'Подати офіційне звернення до адміністрації або уповноваженого підрозділу закладу щодо упередженого оцінювання та ознак неправомірного тиску.',
        metricsDelta: { integrity: 30, peerTrust: -20, institutionalTrust: 25 },
        feedback: {
          violated:
            'Порушень немає. Реалізовано право на об’єктивне оцінювання та захист за ст. 62 Закону України «Про вищу освіту», ст. 53 Закону України «Про запобігання корупції» та внутрішніми процедурами ЗВО.',
          impact:
            'Запускається офіційна перевірка обставин оцінювання, але можливе напруження у спілкуванні з частиною групи.',
          tradeoff:
            'Захист прав і доброчесності ціною ризику нерозуміння з боку прихильників неформальної адаптації.',
          criminologicalForecast:
            'Офіційне звернення переводить проблему у правову площину та зменшує відчуття безкарності упередженого оцінювання. У подальшій службовій діяльності поліцейського це формує звичку діяти за процедурою, знижує ризик процесуальних помилок та зберігає авторитет і довіру до органів державної влади і правосуддя.',
        },
        nextStageId: 'step-3',
      },
    ],
  },
  'step-3': {
    id: 'step-3',
    stepNumber: 3,
    title: 'Етап 3: Відкладені наслідки (Зовнішній контроль та перевірка)',
    situation:
      'Через певний час у закладі розпочинається службова або зовнішня перевірка через скарги на порушення академічної доброчесності та фінансові зловживання на окремих кафедрах. Під час перевірки виявляються матеріали щодо оплат за «посібники». Комісія ставить умову: або дати формальні пояснення, що порушень не було, або зіткнутися з ускладненнями щодо подальшого навчання чи служби.',
    discussionPrompts: [
      'Чому під час перевірки важливо давати повні та достовірні пояснення?',
      'Як чесність під час перевірок впливає на майбутню процесуальну культуру поліцейського?',
    ],
    options: [
      {
        id: 'A',
        label: 'Варіант А: «Надання недостовірних пояснень»',
        actionText:
          'Надати комісії пояснення про відсутність будь-яких порушень із метою уникнення особистих ускладнень.',
        metricsDelta: { integrity: -30, peerTrust: 10, institutionalTrust: -35 },
        feedback: {
          violated:
            'Ч. 1 ст. 53-3 Закону України «Про запобігання корупції» (добросовісність та недопущення неправдивих пояснень); ст. 42 Закону України «Про освіту»; внутрішні положення ЗВО щодо надання недостовірної інформації.',
          impact:
            'Зростає ризик дисциплінарної та репутаційної вразливості у разі встановлення фактичних обставин перевіркою.',
          tradeoff:
            'Спроба уникнути безпосереднього тиску ціною втрати достовірності пояснень та довіри.',
          criminologicalForecast:
            'Недостовірні пояснення під час перевірки закріплюють практику приховування порушень і послаблюють правову точність. У подальшій службовій діяльності поліцейського це веде до процесуальних помилок і підриває авторитет та довіру до органів державної влади і правосуддя.',
        },
        nextStageId: null,
      },
      {
        id: 'Б',
        label: 'Варіант Б: «Повна та достовірна інформація»',
        actionText:
          'Надати контролюючій комісії повні та достовірні пояснення щодо відомих обставин правопорушення, тиску та попередніх етапів.',
        metricsDelta: { integrity: 35, peerTrust: -15, institutionalTrust: 30 },
        feedback: {
          violated:
            'Порушень немає. Дотримано вимог щодо достовірності пояснень та сприяння перевірці за ст. 53 Закону України «Про запобігання корупції», ст. 62 Закону України «Про вищу освіту» та внутрішніми нормами ЗВО.',
          impact:
            'Забезпечується об’єктивність з’ясування фактів та правова коректність дій під час перевірки.',
          tradeoff:
            'Достовірність і правова чистота позиції ціною складної комунікації з прихильниками неформальних практик.',
          criminologicalForecast:
            'Повні та достовірні пояснення допомагають об’єктивно встановити обставини та усунути неправомірні практики. У подальшій службовій діяльності поліцейського це формує належну процесуальну культуру, зменшує ризик помилок та підтримує авторитет і довіру до органів державної влади і правосуддя.',
        },
        nextStageId: null,
      },
      {
        id: 'В',
        label: 'Варіант В: «Офіційний статус захисту»',
        actionText:
          'Звернутися до уповноваженого підрозділу закладу з офіційною заявою про тиск і скористатися гарантіями правового захисту відповідно до закону.',
        metricsDelta: { integrity: 40, peerTrust: -10, institutionalTrust: 35 },
        feedback: {
          violated:
            'Порушень немає. Реалізовано гарантії захисту викривачів за ст. 53-1 та ст. 53-3 Закону України «Про запобігання корупції» та права здобувача освіти за ст. 62 Закону України «Про вищу освіту».',
          impact:
            'Забезпечується правовий захист у межах передбачених законом процедур.',
          tradeoff:
            'Потребує оформлення звернень і рішучості, але надає надійні правові гарантії.',
          criminologicalForecast:
            'Використання законних механізмів захисту переводить реагування на порушення у правову процедуру та знижує тиск. У подальшій службовій діяльності поліцейського це зміцнює дотримання процедур, обмежує ризик помилок та зберігає авторитет і довіру до органів державної влади і правосуддя.',
        },
        nextStageId: null,
      },
    ],
  },
};

const GROUP_STAGES_MAP: Record<string, Record<string, GroupStage>> = {
  'favor-for-friend': GROUP_FRIEND_STAGES,
  'supervisor-pressure': GROUP_LECTURER_STAGES,
};

function getGroupSummary(scenarioId: string, integrityScore: number): string {
  if (scenarioId === 'supervisor-pressure') {
    if (integrityScore >= 80) {
      return 'Тобто, дана ситуація показує, що відмова від неформальних «домовленостей» і чесне ставлення до навчання захищають від тиску та допомагають здобути справжні знання. Коли курсант — незалежно від того, чи він на першому, чи на четвертому курсі — вчиться діяти за правилами, це формує надійну професійну основу. У подальшій службовій діяльності поліцейського такий підхід зменшує вірогідність процесуальних помилок, а також допомагає зберігати авторитет і довіру суспільства до органів державної влади і правосуддя.';
    }
    if (integrityScore >= 45) {
      return 'Тобто, дана ситуація демонструє, що ухилення від активної позиції або часткові компроміси залишають нерозв’язаними проблеми в освітньому процесі. Звичка покладатися на формальні оцінки або неформальні правила послаблює підготовку майбутніх фахівців і створює ризики на майбутнє. У подальшій службовій діяльності поліцейського це підвищує ризик процесуальних помилок і підриває авторитет та довіру до органів державної влади і правосуддя.';
    }
    return 'Тобто, дана ситуація показує, що спроби отримати формальний результат через неформальні оплати або дати неправдиві пояснення створюють серйозні ризики для майбутньої професії. Коли замість реальних знань і дотримання правил обираються обхідні шляхи, формується небезпечна звичка діяти всупереч установленим вимогам. У подальшій службовій діяльності поліцейського це призводить до процесуальних помилок і підриває авторитет та довіру до органів державної влади і правосуддя.';
  }

  if (integrityScore >= 80) {
    return 'Тобто, дана ситуація показує, що чесне дотримання правил і правдиве оформлення документів ще під час навчання формують правильну професійну звичку. Така послідовність однаково важлива і для першокурсника, і для курсанта випускного курсу, який готується до служби. У подальшій службовій діяльності поліцейського це допомагає уникати процесуальних помилок та зберігати авторитет і довіру до органів державної влади і правосуддя.';
  }
  if (integrityScore >= 45) {
    return 'Тобто, дана ситуація демонструє, що бажання підтримати колектив і водночас дотриматися правил нерідко створює складний вибір. Навіть невеликі неточності в поясненнях або вирішення питань «по-своєму» можуть ускладнити ситуацію під час перевірок. Якщо подібні звички перейдуть у подальшу службову діяльність поліцейського, вони можуть спричинити процесуальні помилки та підірвати авторитет і довіру до органів державної влади і правосуддя.';
  }
  return 'Тобто, дана ситуація показує, що приховування порушень і заміна офіційних правил неформальними домовленостями послаблюють дисципліну та порядок. Коли замість чіткого дотримання вимог обирається приховування фактів, це створює ризики для всієї системи. У подальшій службовій діяльності поліцейського це веде до процесуальних помилок і підриває авторитет та довіру до органів державної влади і правосуддя.';
}

export default function GroupSessionPage() {
  const { id } = useParams<{ id: string }>();
  const scenarioId = id || 'favor-for-friend';
  const scenarioData = findScenario(scenarioId);

  const stages = GROUP_STAGES_MAP[scenarioId] || GROUP_LECTURER_STAGES;

  const [currentStageId, setCurrentStageId] = useState<string>('step-1');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [revealVotes, setRevealVotes] = useState<boolean>(false);
  const [selectedGroupOptionId, setSelectedGroupOptionId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [metrics, setMetrics] = useState({
    integrity: 50,
    peerTrust: 50,
    institutionalTrust: 50,
  });

  const [history, setHistory] = useState<
    {
      stageTitle: string;
      option: StageOption;
      stageVotes: Record<string, number>;
      totalStageVotes: number;
    }[]
  >([]);

  useEffect(() => {
    setCurrentStageId('step-1');
    setVotes({});
    setRevealVotes(false);
    setSelectedGroupOptionId(null);
    setIsCompleted(false);
    setMetrics({ integrity: 50, peerTrust: 50, institutionalTrust: 50 });
    setHistory([]);
  }, [scenarioId]);

  const currentStage = stages[currentStageId] || stages['step-1'];
  const totalVotes = Object.values(votes).reduce((acc, count) => acc + count, 0);

  const handleAddVote = (optionId: string) => {
    setVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] || 0) + 1,
    }));
  };

  const handleConfirmStageDecision = () => {
    const chosen =
      currentStage.options.find((opt) => opt.id === selectedGroupOptionId) ||
      currentStage.options.reduce(
        (best, opt) => ((votes[opt.id] || 0) > (votes[best.id] || 0) ? opt : best),
        currentStage.options[0]
      );

    setMetrics((prev) => ({
      integrity: Math.min(100, Math.max(0, prev.integrity + chosen.metricsDelta.integrity)),
      peerTrust: Math.min(100, Math.max(0, prev.peerTrust + chosen.metricsDelta.peerTrust)),
      institutionalTrust: Math.min(100, Math.max(0, prev.institutionalTrust + chosen.metricsDelta.institutionalTrust)),
    }));

    setHistory((prev) => [
      ...prev,
      {
        stageTitle: currentStage.title,
        option: chosen,
        stageVotes: { ...votes },
        totalStageVotes: totalVotes,
      },
    ]);

    if (chosen.nextStageId && stages[chosen.nextStageId]) {
      setCurrentStageId(chosen.nextStageId);
      setVotes({});
      setRevealVotes(false);
      setSelectedGroupOptionId(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStageId('step-1');
    setVotes({});
    setRevealVotes(false);
    setSelectedGroupOptionId(null);
    setIsCompleted(false);
    setMetrics({ integrity: 50, peerTrust: 50, institutionalTrust: 50 });
    setHistory([]);
  };

  if (isCompleted) {
    const groupSummary = getGroupSummary(scenarioId, metrics.integrity);

    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 py-8 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 text-teal-400 border-b border-slate-800 pb-5">
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30">
              <Award className="w-9 h-9 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Підсумок групової сесії з викладачем</h1>
              <p className="text-sm sm:text-base text-slate-400">
                {scenarioData ? scenarioData.title : 'Анонімне голосування та обговорення рішень'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/85 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-300 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-teal-400" /> Доброчесність
                </span>
                <span className="font-bold text-lg text-teal-400">{metrics.integrity}%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full" style={{ width: `${metrics.integrity}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-950/85 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-300 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" /> Довіра колективу
                </span>
                <span className="font-bold text-lg text-blue-400">{metrics.peerTrust}%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${metrics.peerTrust}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-950/85 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-300 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-purple-400" /> Інституційна довіра
                </span>
                <span className="font-bold text-lg text-purple-400">{metrics.institutionalTrust}%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: `${metrics.institutionalTrust}%` }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm sm:text-base font-semibold text-slate-300 uppercase tracking-wider">
              Розбір рішень та голосування по етапах:
            </h2>
            <div className="space-y-5 max-h-[58vh] overflow-y-auto pr-2">
              {history.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-teal-400 uppercase">
                    <span>{item.stageTitle}</span>
                    <span className="text-slate-300 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      Голосів зафіксовано: {item.totalStageVotes}
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    Рішення для аналізу: {item.option.label}
                  </div>
                  <p className="text-sm sm:text-base text-slate-400 italic">{item.option.actionText}</p>
                  <div className="text-sm sm:text-base text-slate-200 space-y-2.5 pt-3 border-t border-slate-800 leading-[1.7]">
                    <div>
                      <span className="text-rose-400 font-semibold">Нормативно-правові акти / оцінка: </span>
                      {item.option.feedback.violated}
                    </div>
                    <div>
                      <span className="text-amber-400 font-semibold">На що це вплине: </span>
                      {item.option.feedback.impact}
                    </div>
                    <div>
                      <span className="text-emerald-400 font-semibold">Компроміс / ціна вибору: </span>
                      {item.option.feedback.tradeoff}
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/95 border border-sky-500/35 space-y-1">
                      <div className="text-sky-400 font-semibold inline-flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Кримінологічний прогноз подальших наслідків:</span>
                      </div>
                      <p className="text-slate-200 leading-[1.7]">{item.option.feedback.criminologicalForecast}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/35 via-slate-950 to-slate-950 p-6 rounded-2xl border border-emerald-500/35 space-y-2.5">
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-base sm:text-lg">
              <BookOpen className="w-5 h-5" />
              <span>Короткий висновок для користувача / тестувальника:</span>
            </div>
            <p className="text-base sm:text-[17px] text-slate-100 leading-[1.75]">{groupSummary}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="flex-1 py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-base font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Почати групову сесію знову
            </button>
            <Link
              to={`/scenarios/${scenarioId}`}
              className="flex-1 py-3.5 px-5 bg-teal-600 hover:bg-teal-500 text-white text-base font-semibold rounded-2xl transition-colors flex items-center justify-center text-center"
            >
              До опису сценарію
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/scenarios/${scenarioId}`}
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm sm:text-base font-medium py-1.5 px-3 rounded-xl hover:bg-slate-900/70"
          >
            <ArrowLeft className="w-4 h-4" /> Назад до опису сценарію
          </Link>
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 bg-amber-950/50 border border-amber-500/30 px-4 py-1.5 rounded-full">
            <Users className="w-4 h-4" /> Груповий режим (з викладачем)
          </span>
        </div>

        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-teal-300 font-semibold uppercase tracking-wider text-xs sm:text-sm bg-teal-950/70 px-4 py-1.5 rounded-full border border-teal-700/50">
              КРОК {currentStage.stepNumber} З 3 • АНОНІМНЕ ГОЛОСУВАННЯ
            </div>
            <div className="text-slate-300 text-sm bg-slate-950/70 px-3.5 py-1.5 rounded-full border border-slate-800">
              Голосів на етапі: <strong className="text-teal-400">{totalVotes}</strong>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">{currentStage.title}</h1>

          <p className="text-base sm:text-[17px] text-slate-200 leading-[1.75] bg-slate-950/60 p-5 sm:p-6 rounded-2xl border border-slate-800/90">
            {currentStage.situation}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <span className="text-sm sm:text-base text-slate-300">
              Натискайте «+1 голос», щоб додати анонімний голос учасника або підгрупи:
            </span>
            <button
              type="button"
              onClick={() => setRevealVotes((prev) => !prev)}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 cursor-pointer transition-colors"
            >
              {revealVotes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {revealVotes ? 'Приховати результати' : 'Показати результати'}
            </button>
          </div>

          <div className="space-y-3.5">
            {currentStage.options.map((opt) => {
              const optionVotes = votes[opt.id] || 0;
              const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
              const isChosenForAnalysis = selectedGroupOptionId === opt.id;

              return (
                <div
                  key={opt.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isChosenForAnalysis
                      ? 'bg-slate-800/90 border-teal-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-bold text-base sm:text-lg text-teal-300">{opt.label}</div>
                      <div className="text-base text-slate-200 leading-[1.65]">{opt.actionText}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAddVote(opt.id)}
                        className="px-4 py-2 rounded-xl bg-teal-600/20 hover:bg-teal-600/35 text-teal-300 border border-teal-500/40 text-sm font-semibold cursor-pointer transition-colors"
                      >
                        +1 голос
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedGroupOptionId(opt.id)}
                        className={`px-3.5 py-2 rounded-xl text-sm font-semibold border cursor-pointer transition-colors ${
                          isChosenForAnalysis
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        Обрати для розбору
                      </button>
                    </div>
                  </div>

                  {revealVotes && (
                    <div className="mt-4 pt-3 border-t border-slate-800/90 space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm text-slate-300">
                        <span>Результат голосування по варіанту</span>
                        <span className="font-bold text-teal-300">
                          {optionVotes} {optionVotes === 1 ? 'голос' : 'голосів'} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950/85 p-5 sm:p-6 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-base sm:text-lg">
              <MessageSquare className="w-5 h-5" />
              <span>Питання для обговорення з викладачем:</span>
            </div>
            <ul className="space-y-2 text-sm sm:text-base text-slate-200 leading-[1.65]">
              {currentStage.discussionPrompts.map((prompt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleConfirmStageDecision}
              className="w-full sm:w-auto py-3.5 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-base font-semibold rounded-2xl transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              {currentStage.stepNumber < 3 ? 'Зафіксувати та перейти далі' : 'Завершити та сформувати звіт'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
