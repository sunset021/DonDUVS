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
  TrendingUp,
  Type,
} from 'lucide-react';
import { findScenario } from '../scenarios';
import { useAppLanguage } from '../App';

type FontSizeMode = 'small' | 'medium' | 'large';

interface LocalizedAnalysis {
  violated: string;
  impact: string;
  tradeoff: string;
  criminologicalForecast: string;
}

interface PlayOption {
  id: 'A' | 'B' | 'C';
  badgeLabel: { uk: string; en: string };
  label: { uk: string; en: string };
  actionText: { uk: string; en: string };
  metricsDelta: {
    integrity: number;
    peerTrust: number;
    institutionalTrust: number;
  };
  analysis: {
    uk: LocalizedAnalysis;
    en: LocalizedAnalysis;
  };
  nextStageId: string | null;
}

interface PlayStage {
  id: string;
  stepNumber: number;
  title: { uk: string; en: string };
  situation: { uk: string; en: string };
  options: PlayOption[];
}

const INITIAL_METRICS = {
  integrity: 50,
  peerTrust: 50,
  institutionalTrust: 50,
};

const PLAY_STAGES: Record<string, Record<string, PlayStage>> = {
  'supervisor-pressure': {
    'step-1': {
      id: 'step-1',
      stepNumber: 1,
      title: {
        uk: 'ЕТАП 1: «ВСТУПНЕ ЗАНЯТТЯ ТА СПОКУСА»',
        en: 'STAGE 1: "INTRODUCTORY CLASS AND TEMPTATION"',
      },
      situation: {
        uk: 'У закладі освіти є викладач — високофаховий і авторитетний фахівець, який цікаво викладає свій предмет та користується повагою серед слухачів. Під час проведення заняття викладач повідомляє про складну життєву ситуацію та потребу в коштах через проблеми зі здоров’ям (майбутню операцію), після чого інформує про власну розробку — навчально-методичний посібник («Методичку») обсягом у кілька аркушів за ціною 500 грн, придбання якої гарантує складання заліку з його дисципліни. Викладач наполягає зберігати цю розмову в конфіденційності та нікому про неї не повідомляти.',
        en: 'At the educational institution, there is a highly qualified and authoritative instructor who teaches the subject engagingly and enjoys respect among students. During class, the instructor shares a difficult personal situation and need for funds due to health issues (upcoming surgery), then announces a personal study guide ("metodychka") of a few printed pages priced at 500 UAH, stating that purchasing it guarantees passing the course credit. The instructor insists on keeping the conversation confidential and reporting it to no one.',
      },
      options: [
        {
          id: 'A',
          badgeLabel: { uk: 'Варіант А', en: 'Option A' },
          label: {
            uk: 'Варіант А: «Людяність і легкий шлях»',
            en: 'Option A: "Humanity and the Easy Path"',
          },
          actionText: {
            uk: 'Придбати «Методичку» за 500 грн, забезпечивши собі гарантований залік без підготовки та підтримавши викладача в складній життєвій ситуації.',
            en: 'Buy the "study guide" for 500 UAH to secure a guaranteed pass without studying while helping the instructor in a difficult personal situation.',
          },
          metricsDelta: { integrity: -20, peerTrust: 15, institutionalTrust: -20 },
          analysis: {
            uk: {
              violated:
                'Ст. 42 Закону України «Про освіту» (академічна доброчесність); ч. 1 ст. 17 Закону України «Про освіту» (обов’язок сумлінно навчатися); ст. 1 та ст. 22 Закону України «Про запобігання корупції» (ознаки завуальованої неправомірної вигоди та обмеження щодо її одержання/надання); внутрішні положення про академічну доброчесність і дисциплінарні норми закладу освіти.',
              impact:
                'Гарантований залік без підготовки створює прогалину у профільних знаннях, необхідних у подальшій практичній діяльності, та закріплює неформальну практику оцінювання.',
              tradeoff:
                'Тимчасовий успіх і легке проходження контролю ціною втрати фахових знань та компромісу з принципами доброчесності.',
              criminologicalForecast:
                'Наведені норми мають переважно бланкетний, відсильний та освітньо-дисциплінарний характер і не містять прямої кримінальної санкції в тексті відповідних приписів. Водночас їх порушення викладачем зумовлює фактичне одержання неправомірної вигоди та закріплює корупційну модель поведінки, а для курсантів породжує дефіцит фахових знань, що в подальшій роботі на посаді слідчого призводить до грубих процесуальних помилок і підриває довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'Art. 42 of the Law of Ukraine "On Education" (academic integrity); Art. 17(1) of the Law of Ukraine "On Education" (duty to study conscientiously); Arts. 1 and 22 of the Law of Ukraine "On Prevention of Corruption" (signs of disguised undue benefit and restrictions); internal academic integrity and disciplinary regulations.',
              impact:
                'A guaranteed pass without preparation creates gaps in core legal knowledge needed in future practice and normalizes informal grading.',
              tradeoff:
                'Short-term grading convenience at the expense of professional knowledge and integrity principles.',
              criminologicalForecast:
                'These provisions are largely blanket, cross-referential, and educational-disciplinary in nature without a direct criminal sanction in the text itself. Yet violating them by an instructor involves actual undue benefit and entrenches corrupt behavior, while creating professional knowledge gaps for cadets that lead to severe procedural errors in future work as an investigator and undermine trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-2',
        },
        {
          id: 'B',
          badgeLabel: { uk: 'Варіант Б', en: 'Option B' },
          label: {
            uk: 'Варіант Б: «Моя хата скраю / Уникнення»',
            en: 'Option B: "Detachment / Avoidance"',
          },
          actionText: {
            uk: 'Відмовитися від придбання «Методички», але не повідомляти про ситуацію іншим — готуватися та складати предмет на загальних підставах.',
            en: 'Decline buying the "study guide" without reporting the situation to others, preparing and taking the exam on standard terms.',
          },
          metricsDelta: { integrity: 0, peerTrust: 5, institutionalTrust: -5 },
          analysis: {
            uk: {
              violated:
                'Прямого порушення заборони на одержання вигоди немає, однак усунення від реагування на ознаки неправомірних дій залишає корупційну практику без протидії.',
              impact:
                'Посередній ризик конфлікту та збереження власних знань при відсутності системного реагування на порушення.',
              tradeoff:
                'Уникнення відкритого конфлікту ціною пасивної позиції щодо виявлених ознак зловживань.',
              criminologicalForecast:
                'Пасивне уникнення реагування на неправомірні пропозиції дозволяє корупційним практикам зберігатися в середовищі. У подальшій службі слідчого схильність «не помічати» системних відхилень підвищує ризик процесуальних помилок і підриває довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'No direct violation of benefit restrictions, yet avoiding a response leaves improper conduct unaddressed.',
              impact:
                'Moderate conflict risk and preserved personal study without systemic counteraction to misconduct.',
              tradeoff:
                'Avoiding open confrontation at the cost of remaining passive toward potential abuse.',
              criminologicalForecast:
                'Passive avoidance allows corrupt practices to persist. In future work as an investigator, overlooking systemic irregularities heightens procedural error risks and erodes trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-2',
        },
        {
          id: 'C',
          badgeLabel: { uk: 'Варіант В', en: 'Option C' },
          label: {
            uk: 'Варіант В: «Прояв принциповості»',
            en: 'Option C: "Principled Stand"',
          },
          actionText: {
            uk: 'Відмовитися від придбання, повідомити керівництво курсу або профільний підрозділ про неприпустимість таких зборів коштів, готуватися і складати предмет самостійно.',
            en: 'Decline the purchase, report the improper fee request to course leadership or the authorized unit, and prepare independently.',
          },
          metricsDelta: { integrity: 25, peerTrust: -15, institutionalTrust: 25 },
          analysis: {
            uk: {
              violated:
                'Порушень немає. Реалізовано принципи академічної доброчесності (ст. 42 Закону України «Про освіту») та добросовісної громадянської і службової позиції.',
              impact:
                'Зберігаються реальні знання та ініціюється правова перевірка; можлива напруга у відносинах із частиною колективу, яка обрала легкий шлях.',
              tradeoff:
                'Соціальний ризик і напруження у спілкуванні з окремими учасниками заради захисту закону та доброчесності.',
              criminologicalForecast:
                'Принципова відмова від неформальних практик формує високу професійну стійкість, знижує ризик процесуальних помилок у майбутній діяльності слідчого та зміцнює довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'No violation. Upholds academic integrity (Art. 42 of the Law of Ukraine "On Education") and principled accountability.',
              impact:
                'Preserves genuine knowledge and triggers lawful review; possible friction with peers preferring the easy route.',
              tradeoff:
                'Social risk and interpersonal tension in exchange for upholding law and integrity.',
              criminologicalForecast:
                'Principled refusal of informal deals builds strong professional resilience, lowers procedural error risks as an investigator, and strengthens trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-2',
        },
      ],
    },
    'step-2': {
      id: 'step-2',
      stepNumber: 2,
      title: {
        uk: 'ЕТАП 2: «ПЕРЕВІРКА НА МІЦНІСТЬ» (СЕСІЯ ТА ТИСК СЕРЕДОВИЩА)',
        en: 'STAGE 2: "RESILIENCE CHECK" (EXAM SESSION AND PEER PRESSURE)',
      },
      situation: {
        uk: 'Настає період підсумкового контролю. Слухачі, які придбали «Методичку», отримують заліки автоматично. Ті, хто відмовився, стикаються з упередженим ставленням: викладач ускладнює вимоги та створює штучні перешкоди під час складання. Частина колективу висловлює невдоволення через те, що принциповість окремих осіб призводить до ускладнення ситуації для всіх, вимагаючи «не виносити сміття з хати» та адаптуватися до загальних правил групи.',
        en: 'The assessment period arrives. Students who bought the "study guide" receive passing grades automatically. Those who declined face bias: the instructor tightens requirements and creates artificial obstacles during testing. Part of the group complains that principled stances complicate matters for everyone, demanding not to "air dirty laundry" and to adapt to group norms.',
      },
      options: [
        {
          id: 'A',
          badgeLabel: { uk: 'Варіант А', en: 'Option A' },
          label: {
            uk: 'Варіант А: «Зламатися заради конформізму»',
            en: 'Option A: "Break for Conformity"',
          },
          actionText: {
            uk: 'Піддатися тиску середовища, передати кошти та отримати залік на загальних умовах групи.',
            en: 'Yield to group pressure, pay the funds, and obtain the credit under the group’s informal terms.',
          },
          metricsDelta: { integrity: -40, peerTrust: 20, institutionalTrust: -30 },
          analysis: {
            uk: {
              violated:
                'Порушення ст. 42, ч. 1 ст. 17 Закону України «Про освіту» та ознаки порушень за ст. 1, 22 Закону України «Про запобігання корупції».',
              impact:
                'Усвідомлення внутрішнього компромісу з власними принципами, закріплення неформальної моделі поведінки та прогалини у знаннях.',
              tradeoff:
                'Короткочасне зняття тиску та схвалення частини групи ціною глибокої втрати доброчесності й фахової підготовки.',
              criminologicalForecast:
                'Поступки тиску середовища закріплюють готовність порушувати правила заради зручності. У подальшій роботі на посаді слідчого це підвищує ризик грубих процесуальних помилок і підриває довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'Violation of Arts. 42 and 17(1) of the Law of Ukraine "On Education" and indicators of violations under Arts. 1 and 22 of the Law of Ukraine "On Prevention of Corruption".',
              impact:
                'Internal compromise with personal principles, reinforced informal behavior, and knowledge gaps.',
              tradeoff:
                'Short-term relief and peer approval at the cost of integrity and professional competence.',
              criminologicalForecast:
                'Yielding to environmental pressure normalizes rule-breaking for convenience, heightening severe procedural error risks as an investigator and undermining trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-3',
        },
        {
          id: 'B',
          badgeLabel: { uk: 'Варіант Б', en: 'Option B' },
          label: {
            uk: 'Варіант Б: «Мовчазний опір»',
            en: 'Option B: "Silent Resistance"',
          },
          actionText: {
            uk: 'Ігнорувати тиск колективу, поглиблено вивчити матеріал і скласти предмет самостійно, попри упереджене ставлення.',
            en: 'Ignore peer pressure, study the material in depth, and pass the subject independently despite bias.',
          },
          metricsDelta: { integrity: 10, peerTrust: -5, institutionalTrust: 10 },
          analysis: {
            uk: {
              violated:
                'Порушень немає. Дотримано обов’язку сумлінного навчання без участі в неправомірних розрахунках.',
              impact:
                'Висока академічна стійкість і реальні знання, але ціною значного психологічного навантаження та напруження.',
              tradeoff:
                'Самостійне подолання труднощів без залучення інституційних механізмів захисту.',
              criminologicalForecast:
                'Збереження власних знань і відмова від компромісів підтримують базову професійну чесність, проте без інституційної фіксації системні ризики можуть зберігатися, впливаючи на довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'No violation. Fulfills conscientious study without participating in improper payments.',
              impact:
                'Strong academic resilience and genuine knowledge, though at a notable psychological cost.',
              tradeoff:
                'Overcoming obstacles alone without invoking formal institutional protection.',
              criminologicalForecast:
                'Maintaining personal competence and refusing compromises supports basic honesty, though unaddressed systemic risks may still affect trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-3',
        },
        {
          id: 'C',
          badgeLabel: { uk: 'Варіант В', en: 'Option C' },
          label: {
            uk: 'Варіант В: «Інституційний захист»',
            en: 'Option C: "Institutional Protection"',
          },
          actionText: {
            uk: 'Офіційно звернутися до адміністрації закладу або служби моніторингу із заявою про штучні перешкоди під час оцінювання та ознаки корупційного тиску.',
            en: 'Submit a formal report to institution leadership or the monitoring unit regarding artificial grading obstacles and signs of corrupt pressure.',
          },
          metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 30 },
          analysis: {
            uk: {
              violated:
                'Порушень немає. Застосовано законні процедури захисту прав здобувача освіти та протидії неправомірному тиску.',
              impact:
                'Соціальна криза та ризик ізоляції всередині колективу («нелояльний» серед частини однокурсників), але переведення проблеми у правову площину.',
              tradeoff:
                'Ризик ізоляції та конфронтації з прихильниками неформальних правил заради захисту законності.',
              criminologicalForecast:
                'Використання законних механізмів реагування замість мовчазного пристосування зміцнює процесуальну дисципліну, знижує ризик помилок у майбутній роботі слідчого та підвищує довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'No violation. Uses lawful procedures to protect student rights and counter improper pressure.',
              impact:
                'Social friction or isolation among peers viewing the stance as disloyal, while shifting the issue into formal legal review.',
              tradeoff:
                'Risk of peer isolation and tension in exchange for upholding legality.',
              criminologicalForecast:
                'Using lawful channels instead of silent accommodation strengthens procedural discipline, reduces future investigative error risks, and increases trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-3',
        },
      ],
    },
    'step-3': {
      id: 'step-3',
      stepNumber: 3,
      title: {
        uk: 'ЕТАП 3: «ВІДКЛАДЕНІ НАСЛІДКИ» (ЗОВНІШНІЙ КОНТРОЛЬ ТА ПЕРЕВІРКА)',
        en: 'STAGE 3: "DELAYED CONSEQUENCES" (EXTERNAL OVERSIGHT AND INQUIRY)',
      },
      situation: {
        uk: 'Через певний час у закладі розпочинається службова або зовнішня перевірка через скарги на порушення академічної доброчесності та фінансові зловживання на окремих кафедрах. Під час виїмки документації та аналізу цифрових носіїв викладача виявляються списки осіб, які перераховували кошти за «посібники». Під час опитування комісія внутрішнього контролю ставить умову: або дати формальні пояснення, що ніяких порушень не було, або зіткнутися з проблемами щодо власної академічної довідки та подальшого проходження служби/навчання.',
        en: 'Later, an official or external audit begins due to complaints of academic integrity breaches and financial abuses across departments. Reviewing records and digital devices uncovers lists of individuals who transferred money for "guides." During questioning, the internal review panel presents a choice: give formal statements that no violations occurred, or face complications regarding academic transcripts and future service or study.',
      },
      options: [
        {
          id: 'A',
          badgeLabel: { uk: 'Варіант А', en: 'Option A' },
          label: {
            uk: 'Варіант А: «Прикрити систему»',
            en: 'Option A: "Cover Up for the System"',
          },
          actionText: {
            uk: 'Надати неправдиві свідчення комісії про те, що жодних неправомірних вимог не висувалося, заради уникнення особистих проблем.',
            en: 'Give false statements to the review panel that no improper demands were made in order to avoid personal trouble.',
          },
          metricsDelta: { integrity: -30, peerTrust: 10, institutionalTrust: -35 },
          analysis: {
            uk: {
              violated:
                'Порушення вимог щодо достовірності та повноти пояснень/свідчень під час перевірки та ризик співучасті у приховуванні правопорушення.',
              impact:
                'Кар’єрний ризик, потрапляння в залежність від компромату та втрата довіри під час подальшої перевірки фактів.',
              tradeoff:
                'Уявний спокій у момент опитування ціною залежності від прихованих фактів і підриву власної репутації.',
              criminologicalForecast:
                'Надання неправдивих пояснень задля уникнення відповідальності формує стійкий паттерн приховування фактів. У подальшій роботі на посаді слідчого це безпосередньо веде до грубих процесуальних помилок і підриває довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'Breach of truthfulness and completeness duties during inquiry and risk of complicity in concealing misconduct.',
              impact:
                'Career risk, vulnerability to leverage/compromat, and loss of trust once facts are verified.',
              tradeoff:
                'Apparent immediate relief at the cost of dependency on hidden facts and damaged credibility.',
              criminologicalForecast:
                'Giving false statements to avoid accountability establishes a habit of concealing facts, leading directly to severe procedural errors as an investigator and undermining trust in state authorities and justice.',
            },
          },
          nextStageId: null,
        },
        {
          id: 'B',
          badgeLabel: { uk: 'Варіант Б', en: 'Option B' },
          label: {
            uk: 'Варіант Б: «Повна правда»',
            en: 'Option B: "Full Truth"',
          },
          actionText: {
            uk: 'Надати вичерпні та правдиві свідчення контролюючій комісії щодо всіх обставин правопорушення, тиску та попередніх етапів.',
            en: 'Provide complete and truthful statements to the oversight panel covering all facts of the violation, pressure, and prior stages.',
          },
          metricsDelta: { integrity: 35, peerTrust: -10, institutionalTrust: 30 },
          analysis: {
            uk: {
              violated:
                'Порушень немає. Дотримано обов’язку правдивої та повної комунікації під час перевірки.',
              impact:
                'Висока інституційна відповідність закону, але можлива гостра криза у взаєминах із тими, хто підтримував неформальні практики.',
              tradeoff:
                'Конфлікт із частиною оточення, що трималося на неформальних домовленостях, заради повної правди.',
              criminologicalForecast:
                'Повна правдивість і послідовність під час перевірки зміцнюють процесуальну чесність, знижують ризик помилок у майбутній службі слідчого та підтримують довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'No violation. Upholds the duty of truthful and complete disclosure during review.',
              impact:
                'Strong legal alignment, with potential friction with those invested in informal practices.',
              tradeoff:
                'Friction with peers tied to informal arrangements in favor of full truth.',
              criminologicalForecast:
                'Full candor and consistency during inquiry strengthen procedural honesty, reduce future investigative errors, and support trust in state authorities and justice.',
            },
          },
          nextStageId: null,
        },
        {
          id: 'C',
          badgeLabel: { uk: 'Варіант В', en: 'Option C' },
          label: {
            uk: 'Варіант В: «Офіційний статус захисту»',
            en: 'Option C: "Official Protection Status"',
          },
          actionText: {
            uk: 'Звернутися до уповноваженого з антикорупційної діяльності закладу з офіційною заявою про тиск та отримати гарантії правового захисту відповідно до законодавства про захист викривачів.',
            en: 'File a formal report of pressure with the institution’s anti-corruption officer and obtain legal protection guarantees under whistleblower protection law.',
          },
          metricsDelta: { integrity: 40, peerTrust: -10, institutionalTrust: 35 },
          analysis: {
            uk: {
              violated:
                'Порушень немає. Реалізовано право на правовий захист викривача та законне врегулювання ситуації.',
              impact:
                'Максимальна правова захищеність і використання легальних механізмів державного/інституційного захисту.',
              tradeoff:
                'Потребує чіткого дотримання процедур і витримки, але забезпечує надійний правовий захист.',
              criminologicalForecast:
                'Опора на легальні механізми захисту та законність формує зрілу професійну позицію слідчого, знижує ризик процесуальних помилок і зміцнює довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'No violation. Exercises legal whistleblower protection and lawful resolution procedures.',
              impact:
                'Maximum legal protection by using formal institutional and statutory safeguards.',
              tradeoff:
                'Requires procedural care and composure while securing strong legal protection.',
              criminologicalForecast:
                'Relying on lawful protections builds mature investigative judgment, reduces procedural errors, and strengthens trust in state authorities and justice.',
            },
          },
          nextStageId: null,
        },
      ],
    },
  },
  'favor-for-friend': {
    'step-1': {
      id: 'step-1',
      stepNumber: 1,
      title: {
        uk: 'ЕТАП 1: «ВЕЧІРНЯ ПЕРЕВІРКА ТА ТОВАРИСЬКА СОЛІДАРНІСТЬ»',
        en: 'STAGE 1: "EVENING ROLL CALL AND PEER SOLIDARITY"',
      },
      situation: {
        uk: 'Ви — курсант старшого курсу, командир взводу. За кілька хвилин до вечірньої перевірки ви помічаєте, що двоє курсантів із вашого взводу самовільно залишили розташування, і просять прикрити їх перед перевіркою, адже «так буває з кожним». Черговий офіцер уже починає обхід.',
        en: 'You are a senior cadet acting as platoon commander. Minutes before evening roll call, you notice two cadets from your platoon left the premises without authorization and ask to be covered during inspection since "it can happen to anyone." The duty officer is already starting rounds.',
      },
      options: [
        {
          id: 'A',
          badgeLabel: { uk: 'Варіант А', en: 'Option A' },
          label: {
            uk: 'Варіант А: «Приховати відсутність»',
            en: 'Option A: "Conceal the Absence"',
          },
          actionText: {
            uk: 'Доповісти черговому офіцеру недостовірну інформацію, ніби курсанти перебувають у медичному підрозділі або на господарчому завданні.',
            en: 'Give the duty officer inaccurate information that the cadets are in the medical unit or on a task.',
          },
          metricsDelta: { integrity: -25, peerTrust: 25, institutionalTrust: -25 },
          analysis: {
            uk: {
              violated:
                'Ст. 11 та ст. 16 Дисциплінарного статуту Національної поліції України (обов’язок дотримуватися службової дисципліни та надавати достовірні доповіді); вимоги щодо достовірності облікової документації.',
              impact:
                'У разі перевірки обліку виникає ризик службового розслідування, дисциплінарної відповідальності та втрати довіри керівництва.',
              tradeoff:
                'Тимчасова підтримка знайомих ціною порушення достовірності службової доповіді.',
              criminologicalForecast:
                'Виправдання неправдивих відомостей товариською солідарністю формує ризиковану звичку підміняти факти зручністю. У майбутній службі слідчого це підвищує ризик процесуальних помилок і підриває довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'Arts. 11 and 16 of the Disciplinary Statute of the National Police of Ukraine (duty to maintain service discipline and provide accurate reports); accuracy requirements for service records.',
              impact:
                'If records are audited, it creates grounds for internal review, disciplinary liability, and loss of command trust.',
              tradeoff:
                'Temporary peer support at the expense of accurate official reporting.',
              criminologicalForecast:
                'Justifying inaccurate facts through peer solidarity reinforces a habit of prioritizing convenience over accuracy, increasing future procedural error risks as an investigator and eroding trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-2',
        },
        {
          id: 'B',
          badgeLabel: { uk: 'Варіант Б', en: 'Option B' },
          label: {
            uk: 'Варіант Б: «Обмежитися нейтральною відповіддю»',
            en: 'Option B: "Give a Neutral Answer"',
          },
          actionText: {
            uk: 'Не вигадувати неправдивих причин, але й не розкривати деталі самостійно до прямого уточнення.',
            en: 'Avoid inventing false excuses while withholding details until directly asked.',
          },
          metricsDelta: { integrity: -5, peerTrust: 5, institutionalTrust: -10 },
          analysis: {
            uk: {
              violated:
                'Неповна доповідь може не відповідати вимогам чіткого та достовірного інформування під час перевірки.',
              impact:
                'Ухильність створює додаткові запитання під час перевірки та не знімає дисциплінарних ризиків.',
              tradeoff:
                'Намагання уникнути гострого конфлікту ціною неповноти службової комунікації.',
              criminologicalForecast:
                'Ухильність у службовій комунікації знижує прозорість і точність рішень, що в майбутній роботі слідчого підвищує ризик процесуальних помилок і шкодить довірі до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'Incomplete reporting may fall short of clear and accurate briefing standards during inspection.',
              impact:
                'Evasiveness prompts further scrutiny during review and leaves disciplinary risks open.',
              tradeoff:
                'Trying to avoid sharp conflict at the cost of incomplete official communication.',
              criminologicalForecast:
                'Evasiveness in official communication lowers clarity and accuracy, raising procedural error risks in future investigative work and harming trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-2',
        },
        {
          id: 'C',
          badgeLabel: { uk: 'Варіант В', en: 'Option C' },
          label: {
            uk: 'Варіант В: «Достовірна доповідь за статутом»',
            en: 'Option C: "Truthful Statutory Report"',
          },
          actionText: {
            uk: 'Чесно доповісти черговому офіцеру про виявлену відсутність і вжиті заходи щодо з’ясування обставин.',
            en: 'Honestly report the discovered absence to the duty officer along with steps taken to clarify the situation.',
          },
          metricsDelta: { integrity: 30, peerTrust: -15, institutionalTrust: 25 },
          analysis: {
            uk: {
              violated:
                'Порушень немає. Дотримано вимог ст. 11, 16 Дисциплінарного статуту Національної поліції України.',
              impact:
                'Об’єктивна фіксація фактів і законне реагування; можливе тимчасове невдоволення з боку порушників.',
              tradeoff:
                'Тимчасове напруження у спілкуванні з окремими знайомими заради дотримання статуту.',
              criminologicalForecast:
                'Дотримання вимог правдивої доповіді формує стійкі професійні стандарти, знижує ризик процесуальних помилок у майбутній діяльності слідчого та зміцнює довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'No violation. Complies with Arts. 11 and 16 of the Disciplinary Statute of the National Police of Ukraine.',
              impact:
                'Objective recording of facts and lawful handling; temporary dissatisfaction from rule-breakers is possible.',
              tradeoff:
                'Temporary friction with acquaintances in exchange for upholding statutory duty.',
              criminologicalForecast:
                'Truthful reporting builds durable professional standards, lowers future procedural error risks as an investigator, and strengthens trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-2',
        },
      ],
    },
    'step-2': {
      id: 'step-2',
      stepNumber: 2,
      title: {
        uk: 'ЕТАП 2: «ПИСЬМОВІ ПОЯСНЕННЯ ТА ТИСК ОТОЧЕННЯ»',
        en: 'STAGE 2: "WRITTEN STATEMENTS AND PEER PRESSURE"',
      },
      situation: {
        uk: 'За фактом події призначено перевірку. Частина учасників пропонує узгодити «зручну» версію у письмових поясненнях, щоб уникнути суворих наслідків для всіх.',
        en: 'An inquiry is opened into the incident. Some participants suggest aligning on a "convenient" version in written statements to avoid strict consequences for everyone.',
      },
      options: [
        {
          id: 'A',
          badgeLabel: { uk: 'Варіант А', en: 'Option A' },
          label: {
            uk: 'Варіант А: «Підлаштувати хронологію»',
            en: 'Option A: "Adjust the Timeline"',
          },
          actionText: {
            uk: 'Вказати у поясненні неточний час або обставини, щоб «згладити» ситуацію.',
            en: 'State an inaccurate time or circumstance in the statement to "smooth over" the situation.',
          },
          metricsDelta: { integrity: -25, peerTrust: 15, institutionalTrust: -25 },
          analysis: {
            uk: {
              violated:
                'Порушення вимог достовірності, повноти та об’єктивності письмових пояснень.',
              impact:
                'Невідповідність фактам підриває довіру до пояснень і створює ризик дисциплінарної відповідальності.',
              tradeoff:
                'Спроба зменшити наслідки за рахунок правдивості службових матеріалів.',
              criminologicalForecast:
                'Підлаштування фактів у письмових поясненнях формує небезпечну звичку викривляти матеріали, що у роботі слідчого підвищує ризик процесуальних помилок і підриває довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'Breach of accuracy, completeness, and objectivity standards for written statements.',
              impact:
                'Factual discrepancies undermine credibility and create disciplinary liability.',
              tradeoff:
                'Attempting to soften outcomes at the cost of accurate official records.',
              criminologicalForecast:
                'Adjusting facts in written statements normalizes record distortion, raising procedural error risks as an investigator and eroding trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-3',
        },
        {
          id: 'B',
          badgeLabel: { uk: 'Варіант Б', en: 'Option B' },
          label: {
            uk: 'Варіант Б: «Надати лише загальні формулювання»',
            en: 'Option B: "Give Only General Statements"',
          },
          actionText: {
            uk: 'Обмежитися загальними фразами без конкретних дат і деталей, щоб не загострювати відносини.',
            en: 'Stick to general phrases without specific times or details to avoid straining relations.',
          },
          metricsDelta: { integrity: -10, peerTrust: 5, institutionalTrust: -15 },
          analysis: {
            uk: {
              violated:
                'Недостатня конкретність пояснень може ускладнювати повне та об’єктивне з’ясування обставин.',
              impact:
                'Потреба у додаткових уточненнях і ризик неповноти матеріалів перевірки.',
              tradeoff:
                'Обережність у стосунках ціною меншої точності пояснень.',
              criminologicalForecast:
                'Неконкретність при фіксації фактів послаблює доказову та службову точність, що у діяльності слідчого підвищує ризик процесуальних помилок і впливає на довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'Lack of specificity in statements can hinder full and objective fact-finding.',
              impact:
                'Requires follow-up clarifications and risks incomplete review records.',
              tradeoff:
                'Interpersonal caution at the expense of precision in statements.',
              criminologicalForecast:
                'Vagueness when recording facts weakens evidentiary and official precision, increasing procedural error risks as an investigator and affecting trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-3',
        },
        {
          id: 'C',
          badgeLabel: { uk: 'Варіант В', en: 'Option C' },
          label: {
            uk: 'Варіант В: «Точна фіксація реальних фактів»',
            en: 'Option C: "Accurate Recording of Actual Facts"',
          },
          actionText: {
            uk: 'Викласти у письмовому поясненні реальну хронологію та всі відомі обставини без викривлень.',
            en: 'Present the true timeline and all known facts in the written statement without distortion.',
          },
          metricsDelta: { integrity: 25, peerTrust: -10, institutionalTrust: 25 },
          analysis: {
            uk: {
              violated:
                'Порушень немає. Дотримано стандарту достовірності та повноти службових пояснень.',
              impact:
                'Достовірна документальна база та підтвердження доброчесної позиції.',
              tradeoff:
                'Можливе незадоволення тих, хто розраховував на узгодження неточних фактів.',
              criminologicalForecast:
                'Точна фіксація фактів формує навичку коректної процесуальної роботи з документами, знижує ризик помилок і зміцнює довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'No violation. Adheres to accuracy and completeness standards for official statements.',
              impact:
                'Reliable documentation and confirmation of an ethical stance.',
              tradeoff:
                'Potential displeasure from those expecting aligned inaccuracies.',
              criminologicalForecast:
                'Accurate fact recording builds disciplined procedural handling of documents, lowers error risks, and strengthens trust in state authorities and justice.',
            },
          },
          nextStageId: 'step-3',
        },
      ],
    },
    'step-3': {
      id: 'step-3',
      stepNumber: 3,
      title: {
        uk: 'ЕТАП 3: «ВИСНОВКИ ТА ПРОФІЛАКТИКА В КОЛЕКТИВІ»',
        en: 'STAGE 3: "CONCLUSIONS AND COLLECTIVE PREVENTION"',
      },
      situation: {
        uk: 'Перевірку завершено, і потрібно визначити, яким буде підхід до дисципліни та взаємної підтримки в підрозділі надалі.',
        en: 'The inquiry concludes, and you must define the ongoing approach to discipline and mutual support in the unit.',
      },
      options: [
        {
          id: 'A',
          badgeLabel: { uk: 'Варіант А', en: 'Option A' },
          label: {
            uk: 'Варіант А: «Залишити все як є»',
            en: 'Option A: "Leave Things As They Are"',
          },
          actionText: {
            uk: 'Не впроваджувати жодних змін чи правил профілактики порушень.',
            en: 'Introduce no changes or preventive rules against violations.',
          },
          metricsDelta: { integrity: -15, peerTrust: 10, institutionalTrust: -15 },
          analysis: {
            uk: {
              violated:
                'Не реалізовано превентивний підхід до запобігання дисциплінарним порушенням.',
              impact:
                'Зберігається висока ймовірність повторення подібних ситуацій.',
              tradeoff:
                'Відсутність змін зараз ціною збереження ризиків у майбутньому.',
              criminologicalForecast:
                'Відсутність профілактики підвищує ризик повторних порушень і процесуальних помилок та послаблює довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'Fails to apply a preventive approach to avoiding disciplinary violations.',
              impact:
                'High likelihood of similar incidents recurring.',
              tradeoff:
                'No immediate change at the cost of ongoing future risks.',
              criminologicalForecast:
                'Lack of prevention raises repeat violation and procedural error risks, weakening trust in state authorities and justice.',
            },
          },
          nextStageId: null,
        },
        {
          id: 'B',
          badgeLabel: { uk: 'Варіант Б', en: 'Option B' },
          label: {
            uk: 'Варіант Б: «Разове нагадування без правил»',
            en: 'Option B: "One-Time Reminder Without Rules"',
          },
          actionText: {
            uk: 'Обмежитися короткою розмовою без системних заходів і чіткого порядку дій.',
            en: 'Limit response to a brief talk without systemic measures or clear procedures.',
          },
          metricsDelta: { integrity: 5, peerTrust: 5, institutionalTrust: 5 },
          analysis: {
            uk: {
              violated:
                'Часткова увага до проблеми без закріплення сталих профілактичних механізмів.',
              impact:
                'Короткочасний ефект без довгострокового зниження ризиків.',
              tradeoff:
                'Мінімальні зусилля на впровадження правил при обмеженому ефекті.',
              criminologicalForecast:
                'Непослідовна профілактика залишає простір для помилок і неточностей, що впливає на якість майбутньої роботи та довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'Partial attention to the issue without lasting preventive mechanisms.',
              impact:
                'Short-term effect without sustained risk reduction.',
              tradeoff:
                'Minimal rule-building effort with limited lasting impact.',
              criminologicalForecast:
                'Inconsistent prevention leaves room for errors and inaccuracies, affecting future work and trust in state authorities and justice.',
            },
          },
          nextStageId: null,
        },
        {
          id: 'C',
          badgeLabel: { uk: 'Варіант В', en: 'Option C' },
          label: {
            uk: 'Варіант В: «Системна профілактика та взаємна відповідальність»',
            en: 'Option C: "Systemic Prevention and Mutual Accountability"',
          },
          actionText: {
            uk: 'Запровадити чіткі правила взаємного інформування, своєчасної допомоги та дотримання статутних вимог.',
            en: 'Establish clear rules for timely communication, constructive help, and compliance with statutory duties.',
          },
          metricsDelta: { integrity: 25, peerTrust: 15, institutionalTrust: 25 },
          analysis: {
            uk: {
              violated:
                'Порушень немає. Реалізовано системний превентивний підхід.',
              impact:
                'Зміцнення здорової культури в колективі та зниження ризику повторних порушень.',
              tradeoff:
                'Потребує постійної дисципліни, але формує надійне та відповідальне середовище.',
              criminologicalForecast:
                'Системна профілактика знижує ризик помилок у майбутній службі слідчого та зміцнює довіру до органів державної влади та органів правосуддя.',
            },
            en: {
              violated:
                'No violation. Reflects a systemic preventive approach.',
              impact:
                'Strengthens healthy group culture and reduces repeat violations.',
              tradeoff:
                'Requires ongoing discipline while building a reliable environment.',
              criminologicalForecast:
                'Systemic prevention lowers future investigative error risks and strengthens trust in state authorities and justice.',
            },
          },
          nextStageId: null,
        },
      ],
    },
  },
};

export function ScenarioPlayPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useAppLanguage();
  const lang: 'uk' | 'en' = language === 'en' ? 'en' : 'uk';

  const scenarioId =
    id === 'favor-for-friend' ? 'favor-for-friend' : 'supervisor-pressure';
  const scenarioData = findScenario(scenarioId);
  const stages = PLAY_STAGES[scenarioId];

  const [currentStageId, setCurrentStageId] = useState('step-1');
  const [isCompleted, setIsCompleted] = useState(false);
  const [fontSizeMode, setFontSizeMode] = useState<FontSizeMode>('medium');
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [history, setHistory] = useState<
    { title: string; option: PlayOption }[]
  >([]);

  useEffect(() => {
    setCurrentStageId('step-1');
    setIsCompleted(false);
    setMetrics(INITIAL_METRICS);
    setHistory([]);
  }, [scenarioId]);

  const stage = stages[currentStageId] || stages['step-1'];

  const handleSelectAndAdvance = (option: PlayOption) => {
    setMetrics((prev) => ({
      integrity: Math.min(
        100,
        Math.max(0, prev.integrity + option.metricsDelta.integrity)
      ),
      peerTrust: Math.min(
        100,
        Math.max(0, prev.peerTrust + option.metricsDelta.peerTrust)
      ),
      institutionalTrust: Math.min(
        100,
        Math.max(
          0,
          prev.institutionalTrust + option.metricsDelta.institutionalTrust
        )
      ),
    }));

    setHistory((prev) => [
      ...prev,
      { title: stage.title[lang], option },
    ]);

    if (option.nextStageId && stages[option.nextStageId]) {
      setCurrentStageId(option.nextStageId);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStageId('step-1');
    setIsCompleted(false);
    setMetrics(INITIAL_METRICS);
    setHistory([]);
  };

  const fontSizeClasses =
    fontSizeMode === 'small'
      ? 'text-xs sm:text-sm leading-[1.58]'
      : fontSizeMode === 'large'
        ? 'text-base sm:text-lg leading-[1.7]'
        : 'text-sm sm:text-base leading-[1.64]';

  const renderFontSizeSwitcher = () => (
    <div className="inline-flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-xl">
      <Type className="w-4 h-4 text-slate-300 ml-1" />
      <button
        type="button"
        onClick={() => setFontSizeMode('small')}
        title={lang === 'en' ? 'Small font' : 'Малий шрифт'}
        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
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
        title={lang === 'en' ? 'Medium font' : 'Середній шрифт'}
        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
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
        title={lang === 'en' ? 'Large font' : 'Великий шрифт'}
        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
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
      <div
        lang={lang}
        className={`max-w-4xl mx-auto px-4 py-8 space-y-6 ${fontSizeClasses}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/scenarios/${scenarioId}`}
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />{' '}
            {lang === 'en'
              ? 'Back to scenario overview'
              : 'Повернутися до опису сценарію'}
          </Link>
          {renderFontSizeSwitcher()}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 text-teal-300">
            <Award className="w-8 h-8 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {lang === 'en' ? 'Summary of Completion' : 'Підсумок проходження'}
              </h1>
              <p className="text-sm text-slate-300">{scenarioData?.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-300">
                {lang === 'en' ? 'Integrity' : 'Доброчесність'}
              </div>
              <div className="text-2xl font-bold text-teal-300">
                {metrics.integrity}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-300">
                {lang === 'en' ? 'Peer Trust' : 'Довіра колективу'}
              </div>
              <div className="text-2xl font-bold text-sky-300">
                {metrics.peerTrust}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-300">
                {lang === 'en' ? 'Institutional Trust' : 'Інституційна довіра'}
              </div>
              <div className="text-2xl font-bold text-amber-300">
                {metrics.institutionalTrust}%
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {history.map((item, idx) => {
              const itemAnalysis = item.option.analysis[lang];
              const deltaVal = item.option.metricsDelta.integrity;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-teal-300">
                    <span>{item.title}</span>
                    <span>
                      {lang === 'en' ? 'INTEGRITY' : 'ДОБРОЧЕСНІСТЬ'}:{' '}
                      {deltaVal > 0 ? `+${deltaVal}%` : `${deltaVal}%`}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {lang === 'en' ? 'Selected' : 'Обрано'}:{' '}
                    {item.option.label[lang]}
                  </div>

                  <div className="space-y-2.5 text-slate-100">
                    <p>
                      <Landmark className="w-4 h-4 inline mr-1.5 text-rose-400" />
                      <strong className="text-rose-300">
                        {lang === 'en'
                          ? 'Legal Acts / Assessment:'
                          : 'Нормативно-правові акти / оцінка:'}
                      </strong>{' '}
                      {itemAnalysis.violated}
                    </p>
                    <p>
                      <Lightbulb className="w-4 h-4 inline mr-1.5 text-amber-400" />
                      <strong className="text-amber-300">
                        {lang === 'en' ? 'Impact:' : 'На що це вплине:'}
                      </strong>{' '}
                      {itemAnalysis.impact}
                    </p>
                    <p>
                      <Sparkles className="w-4 h-4 inline mr-1.5 text-emerald-400" />
                      <strong className="text-emerald-300">
                        {lang === 'en'
                          ? 'Tradeoff / Cost of Choice:'
                          : 'Компроміс / ціна вибору:'}
                      </strong>{' '}
                      {itemAnalysis.tradeoff}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-sky-500/35 text-sky-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sky-300">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span>
                        {lang === 'en'
                          ? 'Criminological Forecast of Further Consequences:'
                          : 'Кримінологічний прогноз подальших наслідків:'}
                      </span>
                    </div>
                    <p>{itemAnalysis.criminologicalForecast}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />{' '}
              {lang === 'en' ? 'Replay scenario' : 'Пройти сценарій знову'}
            </button>
            <Link
              to="/scenarios"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              {lang === 'en' ? 'Back to scenarios' : 'Повернутись до сценаріїв'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      lang={lang}
      className={`max-w-4xl mx-auto px-4 py-8 space-y-6 ${fontSizeClasses}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/scenarios/${scenarioId}`}
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />{' '}
          {lang === 'en'
            ? 'Back to scenario overview'
            : 'До опису сценарію'}
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {renderFontSizeSwitcher()}
          <Link
            to={`/scenarios/${scenarioId}/group`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-950/85 border border-amber-500/35 px-3 py-1.5 rounded-full"
          >
            <Users className="w-3.5 h-3.5" />{' '}
            {lang === 'en' ? 'Group mode' : 'Груповий режим'}
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>
              {lang === 'en'
                ? `Step ${stage.stepNumber} of 3`
                : `Крок ${stage.stepNumber} з 3`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {stage.title[lang]}
          </h1>
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/85 border border-slate-800 text-slate-100 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-300">
              {lang === 'en' ? 'Case Narrative' : 'Фабула'}
            </div>
            <p>{stage.situation[lang]}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-300">
              {lang === 'en' ? 'Integrity' : 'Доброчесність'}
            </div>
            <div className="text-xl font-bold text-teal-300">
              {metrics.integrity}%
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-300">
              {lang === 'en' ? 'Peer Trust' : 'Довіра колективу'}
            </div>
            <div className="text-xl font-bold text-sky-300">
              {metrics.peerTrust}%
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-300">
              {lang === 'en' ? 'Institutional Trust' : 'Інституційна довіра'}
            </div>
            <div className="text-xl font-bold text-amber-300">
              {metrics.institutionalTrust}%
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {stage.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectAndAdvance(option)}
              className="w-full text-left p-5 rounded-2xl border border-slate-800 bg-slate-900/75 hover:border-teal-400 hover:bg-teal-950/25 transition-all cursor-pointer space-y-1.5"
            >
              <div className="font-bold text-teal-300">
                {option.label[lang]}
              </div>
              <div className="text-slate-100">{option.actionText[lang]}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleRestart}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />{' '}
            {lang === 'en' ? 'Restart' : 'Почати заново'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScenarioPlayPage;