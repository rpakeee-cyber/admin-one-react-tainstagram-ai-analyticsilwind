import type {
  AIInsight,
  ContentGoal,
  ContentIdea,
  ContentPlanStatus,
  DashboardRecommendation,
  Reel,
  ReelFormat,
  ReelInsight,
  ReelTopic,
  WeeklyPlanItem,
  WeeklyRecommendations,
} from "../types";
import {
  analyzeTopics,
  calculateAverageEngagement,
  calculateAverageFollowerConversion,
  calculateAverageViews,
  calculateEngagementRate,
  calculateFollowerConversion,
  calculateReelScore,
  calculateSaveRate,
  getContentDirection,
} from "../utils/analytics";

type IdeaTemplate = {
  title: string;
  topic: ReelTopic;
  format: ReelFormat;
  goal: ContentGoal;
};

const universalIdeas: IdeaTemplate[] = [
  {
    title: "Один день из жизни: работа, цели и дисциплина",
    topic: "Работа",
    format: "Day in Life",
    goal: "Личный бренд",
  },
  {
    title: "Почему я снова возвращаю спорт в свою жизнь",
    topic: "Спорт",
    format: "Storytelling",
    goal: "Доверие",
  },
  {
    title: "Как я совмещаю работу, блог и личные цели",
    topic: "Влог",
    format: "Vlog",
    goal: "Личный бренд",
  },
  {
    title: "Что я понял после упаковки заказов весь день",
    topic: "Kaspi",
    format: "Day in Life",
    goal: "Доверие",
  },
  {
    title: "Маленький город, большие цели: мой путь",
    topic: "Личная мысль",
    format: "Storytelling",
    goal: "Личный бренд",
  },
  {
    title: "Три ошибки, которые тормозят продажи на Kaspi",
    topic: "Kaspi",
    format: "Before/After",
    goal: "Полезность",
  },
  {
    title: "Что дисциплина даёт, когда мотивации уже нет",
    topic: "Спорт",
    format: "POV",
    goal: "Подписки",
  },
  {
    title: "Одна личная мысль, которая изменила мой рабочий день",
    topic: "Личная мысль",
    format: "Talking Head",
    goal: "Доверие",
  },
  {
    title: "Как вера помогает не потерять направление",
    topic: "Церковь",
    format: "Storytelling",
    goal: "Доверие",
  },
  {
    title: "Чему служение учит меня в обычной жизни",
    topic: "Церковь",
    format: "Vlog",
    goal: "Личный бренд",
  },
  {
    title: "Мой честный план на следующие 30 дней",
    topic: "Влог",
    format: "Talking Head",
    goal: "Подписки",
  },
  {
    title: "Как превратить обычный рабочий процесс в полезный Reel",
    topic: "Обучение",
    format: "Tutorial",
    goal: "Полезность",
  },
];

const universalWeek: IdeaTemplate[] = [
  universalIdeas[0],
  universalIdeas[1],
  universalIdeas[4],
  universalIdeas[5],
  universalIdeas[2],
  universalIdeas[8],
  {
    title: "Итоги недели: что получилось и что я меняю дальше",
    topic: "Влог",
    format: "Talking Head",
    goal: "Доверие",
  },
];

const topicContext: Record<ReelTopic, string> = {
  Работа: "обычный рабочий день",
  Спорт: "дисциплина в спорте",
  Влог: "повседневная жизнь",
  Бизнес: "путь в бизнесе",
  Kaspi: "работа с Kaspi и заказами",
  Церковь: "вера и служение",
  "Личная мысль": "личный путь и цели",
  Обучение: "практический навык",
  Тренд: "популярный формат",
  Другое: "этот личный опыт",
};

const formatContext: Record<ReelFormat, string> = {
  "Talking Head": "Скажи это прямо в камеру",
  Vlog: "Покажи это через живые кадры дня",
  POV: "Начни с действия от первого лица",
  Storytelling: "Начни с конфликта и веди к выводу",
  Tutorial: "Сразу пообещай понятный результат",
  Trend: "Свяжи тренд с личным опытом",
  "Before/After": "Сначала покажи контраст до и после",
  "Day in Life": "Открой ролик самым напряжённым моментом дня",
  Motivation: "Начни с честного признания",
  Other: "Начни с одного конкретного наблюдения",
};

const unique = <T>(values: T[]) => Array.from(new Set(values));

const getDataMessage = (count: number) => {
  if (count === 0) {
    return "Добавь первый Reel, чтобы советы начали учитывать твои результаты.";
  }

  if (count < 3) {
    return "Пока данных мало. Рекомендации предварительные, но уже подходят для первых тестов.";
  }

  if (count < 5) {
    return "Добавь хотя бы 3–5 Reels, чтобы сравнение тем и форматов стало точнее.";
  }

  return "Рекомендации основаны на твоих сохранённых Reels.";
};

const getNextMonday = () => {
  const date = new Date();
  const currentDay = date.getDay();
  const daysUntilMonday = currentDay === 0 ? 1 : 8 - currentDay;
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysUntilMonday);
  return date;
};

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const generateHookSuggestions = (topic: ReelTopic, format: ReelFormat) => {
  const context = topicContext[topic].toLowerCase();
  const formatLead = formatContext[format];

  return [
    `Я думал, что ${context} ничем меня не удивит, пока не понял одну вещь…`,
    `Вот почему большинство людей бросают тему «${topic.toLowerCase()}» на середине…`,
    `Я решил проверить, что будет, если неделю по-другому относиться к теме «${topic.toLowerCase()}»…`,
    `Мне 18, и я не хочу жить на автопилоте — особенно когда речь про ${context}.`,
    `${formatLead}: никто не говорит об этом, но именно это меняет результат.`,
  ];
};

export const generateContentIdeas = (reels: Reel[]): ContentIdea[] => {
  const direction = getContentDirection(reels);
  const preferredTopics = unique([
    ...direction.topTopics.map((item) => item.topic),
    "Работа" as ReelTopic,
    "Личная мысль" as ReelTopic,
    "Спорт" as ReelTopic,
    "Kaspi" as ReelTopic,
  ]);
  const preferredFormats = unique([
    ...direction.topFormats.map((item) => item.format),
    "Day in Life" as ReelFormat,
    "Storytelling" as ReelFormat,
    "Talking Head" as ReelFormat,
  ]);
  const orderedTemplates = [...universalIdeas].sort((a, b) => {
    const getTopicRank = (topic: ReelTopic) => {
      const index = preferredTopics.indexOf(topic);
      return index === -1 ? preferredTopics.length : index;
    };
    const topicDifference = getTopicRank(a.topic) - getTopicRank(b.topic);
    return topicDifference || universalIdeas.indexOf(a) - universalIdeas.indexOf(b);
  });

  return orderedTemplates.slice(0, 10).map((template, index) => {
    const shouldUsePreferredFormat = index < preferredFormats.length && index % 2 === 0;
    const format = shouldUsePreferredFormat
      ? preferredFormats[index % preferredFormats.length]
      : template.format;
    const isStrongTopic = direction.topTopics.some((item) => item.topic === template.topic);
    const isStrongFormat = direction.topFormats.some((item) => item.format === format);

    return {
      id: `idea-${index + 1}`,
      title: template.title,
      topic: template.topic,
      format,
      hook: generateHookSuggestions(template.topic, format)[index % 5],
      goal: template.goal,
      reason:
        isStrongTopic || isStrongFormat
          ? "Идея продолжает один из сильных сигналов в сохранённых Reels."
          : "Идея расширяет личный бренд и добавляет новый угол для теста.",
    };
  });
};

export const generateDashboardInsight = (reels: Reel[]): AIInsight => {
  const direction = getContentDirection(reels);
  const topTopic = direction.summary.topTopic ?? "Работа";
  const topFormat = direction.summary.topFormat ?? "Day in Life";
  const bestDay = direction.summary.bestDay;

  if (!reels.length) {
    return {
      id: "dashboard-empty",
      title: "Начни с одного честного Reel",
      summary: "Пока нет данных для сравнения, поэтому лучший старт — показать реальный процесс.",
      recommendation: "Сними короткий Day in Life про работу, цели или дисциплину.",
      impact: "Первый ориентир для личной аналитики",
      priority: "medium",
      category: "topic",
    };
  }

  if (direction.summary.primaryRisk === "missing-hooks") {
    return {
      id: "dashboard-hooks",
      title: "Сильный hook сейчас важнее нового формата",
      summary: "Ролики с заполненной первой фразой показывают более устойчивый результат.",
      recommendation: `Следующий Reel про «${topTopic}» начни с конфликта или конкретного обещания.`,
      impact: "Больше удержания в первые секунды",
      priority: "high",
      category: "hook",
    };
  }

  if (direction.summary.primaryRisk === "low-follower-conversion") {
    return {
      id: "dashboard-conversion",
      title: "Охват нужно переводить в подписку",
      summary: "Зрители смотрят ролики, но не всегда понимают, зачем следить за продолжением.",
      recommendation: `Сними ${topFormat} про «${topTopic}» и пообещай продолжение уже в первой половине.`,
      impact: "Рост конверсии зрителей в подписчиков",
      priority: "high",
      category: "hook",
    };
  }

  return {
    id: "dashboard-direction",
    title: `Лучше всего сейчас работает тема «${topTopic}»`,
    summary: `Сильный формат — ${topFormat}${bestDay ? `, лучший день по текущим данным — ${bestDay.toLowerCase()}` : ""}.`,
    recommendation: "Сделай продолжение до 25–35 секунд и усили первые две секунды.",
    impact: "Более предсказуемый рост просмотров",
    priority: "high",
    category: "topic",
  };
};

export const generateDashboardOverview = (reels: Reel[]): DashboardRecommendation => {
  const direction = getContentDirection(reels);
  const topTopic = direction.summary.topTopic ?? "Работа";
  const topFormat = direction.summary.topFormat ?? "Day in Life";
  const bestPostingDay = direction.summary.bestDay ?? "Данных пока мало";
  const riskMessages: Record<typeof direction.summary.primaryRisk, string> = {
    "limited-data": "Пока мало Reels для уверенного сравнения.",
    "missing-hooks": "Часть слабых роликов выходит без ясного hook.",
    "low-engagement": "Просмотры пока не превращаются в реакции и сохранения.",
    "low-follower-conversion": "Охват не всегда приводит новых подписчиков.",
    none: "Главный риск — повторять сильную тему без нового угла.",
  };

  return {
    insight: generateDashboardInsight(reels),
    topTopics: direction.topTopics.slice(0, 3),
    topFormats: direction.topFormats.slice(0, 3),
    bestPostingDay,
    mainRisk: riskMessages[direction.summary.primaryRisk],
    nextStep: `Сними ${topFormat} про «${topTopic}»: короткий Reel до 25–35 секунд с сильным hook в первые две секунды.`,
    dataLevel: direction.summary.dataLevel,
  };
};

export const generateReelInsight = (reel: Reel, allReels: Reel[]): ReelInsight => {
  const comparison = allReels.length ? allReels : [reel];
  const topics = analyzeTopics(comparison);
  const topic = topics.find((item) => item.topic === reel.topic);
  const score = calculateReelScore(reel, comparison);
  const engagement = calculateEngagementRate(reel);
  const conversion = calculateFollowerConversion(reel);
  const averageViews = calculateAverageViews(comparison);
  const averageEngagement = calculateAverageEngagement(comparison);
  const averageConversion = calculateAverageFollowerConversion(comparison);
  const saveRate = calculateSaveRate(reel);
  const ideas = generateContentIdeas(comparison);
  const continuation = ideas.find((idea) => idea.topic === reel.topic) ??
    ideas[0] ?? {
      title: `Продолжение темы «${reel.topic}»`,
    };

  const strength =
    saveRate >= 3
      ? `Ролик хочется сохранить: save rate ${saveRate.toFixed(1)}%.`
      : engagement >= averageEngagement
        ? `Вовлечённость ${engagement.toFixed(1)}% выше среднего уровня.`
        : reel.views >= averageViews
          ? "Ролик получил просмотры выше среднего."
          : "Ролик дал полезный сигнал для следующего контент-теста.";

  const weakness =
    reel.retentionRate > 0 && reel.retentionRate < 45
      ? `Удержание ${reel.retentionRate.toFixed(0)}%: середину стоит сделать короче.`
      : conversion < Math.max(averageConversion, 0.4)
        ? "Зрители не получили достаточно ясной причины подписаться."
        : engagement < averageEngagement
          ? "Не хватило повода сохранить, переслать или оставить комментарий."
          : "Слабая зона не критична, но первый кадр можно сделать конкретнее.";

  return {
    score,
    strength,
    weakness,
    whyWorked:
      reel.views >= averageViews
        ? `Тема «${reel.topic}» и формат ${reel.format} быстро объясняют, о чём ролик, а результат выше среднего по просмотрам.`
        : `Лучше всего сработали конкретный личный контекст и понятная тема «${reel.topic}».`,
    whyLowConversion:
      conversion < Math.max(averageConversion, 0.4)
        ? `Конверсия в подписку ${conversion.toFixed(2)}%. Добавь обещание следующей части или понятную причину следить за серией.`
        : `Конверсия ${conversion.toFixed(2)}% выглядит здоровой. Сохрани призыв к продолжению и не переноси его в самый конец.`,
    repeatTopic:
      topic?.status === "strong"
        ? `Повторить. Тема «${reel.topic}» входит в сильные направления.`
        : topic?.status === "weak"
          ? `Не повторять один в один. Оставь тему, но измени hook или формат.`
          : `Можно повторить как тест, если дать теме новый конфликт или результат.`,
    improveNext:
      reel.hook.trim().length === 0
        ? "Напиши hook до съёмки и покажи главный конфликт в первые две секунды."
        : reel.durationSeconds > 35
          ? "Сократи вступление и перенеси ключевой вывод ближе к середине."
          : "Сохрани темп, но добавь более ясный мост к следующему ролику.",
    hookSuggestions: generateHookSuggestions(reel.topic, reel.format).slice(0, 3),
    continuationIdea: continuation.title,
  };
};

const getFormatsToTest = (reels: Reel[]) => {
  const formatCounts = reels.reduce<Partial<Record<ReelFormat, number>>>((result, reel) => {
    result[reel.format] = (result[reel.format] ?? 0) + 1;
    return result;
  }, {});
  const candidates: ReelFormat[] = ["Day in Life", "Storytelling", "POV", "Tutorial"];

  return candidates.sort((a, b) => (formatCounts[a] ?? 0) - (formatCounts[b] ?? 0)).slice(0, 3);
};

export const generateWeeklyRecommendations = (reels: Reel[]): WeeklyRecommendations => {
  const direction = getContentDirection(reels);
  const ideas = generateContentIdeas(reels);
  const weeklyIdeas =
    reels.length < 3
      ? universalWeek.map((template, index) => ({
          id: `fallback-week-${index + 1}`,
          ...template,
          hook: generateHookSuggestions(template.topic, template.format)[index % 5],
          reason: "Универсальный сюжет для развития личного бренда и сбора новых данных.",
        }))
      : ideas;
  const formatsToTest = getFormatsToTest(reels);
  const goals: ContentGoal[] = [
    "Охват",
    "Доверие",
    "Личный бренд",
    "Полезность",
    "Подписки",
    "Эксперимент",
    "Доверие",
  ];
  const statuses: ContentPlanStatus[] = [
    "ready",
    "script",
    "scheduled",
    "idea",
    "script",
    "idea",
    "scheduled",
  ];
  const startDate = getNextMonday();
  const schedule: WeeklyPlanItem[] = Array.from({ length: 7 }, (_, index) => {
    const idea = weeklyIdeas[index % weeklyIdeas.length];
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      id: `week-${index + 1}`,
      day: new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(date),
      date: toIsoDate(date),
      title: idea.title,
      topic: idea.topic,
      format: idea.format,
      hook: idea.hook,
      goal: goals[index],
      reason: idea.reason,
      status: statuses[index],
    };
  });
  const topTopicNames = direction.topTopics.map((item) => item.topic);
  const weakTopicNames = direction.weakTopics.map((item) => item.topic);
  const weakFormatNames = direction.weakFormats.map((item) => item.format);

  return {
    dataLevel: direction.summary.dataLevel,
    summary: getDataMessage(reels.length),
    whatToShoot: ideas.slice(0, 5).map((idea) => idea.title),
    repeatTopics: topTopicNames.length
      ? topTopicNames.map((topic) => `Повтори тему «${topic}» с новым личным углом.`)
      : ["Начни с работы, дисциплины и личного пути — эти темы раскрывают автора."],
    pauseItems: [...weakTopicNames, ...weakFormatNames].length
      ? [
          ...weakTopicNames.map((topic) => `Тема «${topic}»: поставь на паузу или смени подачу.`),
          ...weakFormatNames.map(
            (format) => `Формат ${format}: не повторяй без нового hook и более короткого монтажа.`,
          ),
        ].slice(0, 4)
      : ["Не ставь темы на паузу без серии из нескольких тестов — данных пока недостаточно."],
    formatsToTest: formatsToTest.map((format) => `Протестируй ${format} на одной из сильных тем.`),
    hooks: unique([
      ...direction.hookSuggestions,
      ...generateHookSuggestions(
        direction.summary.topTopic ?? "Работа",
        direction.summary.topFormat ?? "Day in Life",
      ),
    ]).slice(0, 5),
    schedule,
  };
};
