import type { AIInsight, Reel, ReelInsight, ReelTopic } from "../types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

const safeRate = (value: number, denominator: number) =>
  denominator > 0 ? (Math.max(value, 0) / denominator) * 100 : 0;

const average = (values: number[]) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;

const scoreAgainstAverage = (value: number, averageValue: number) => {
  if (averageValue <= 0) {
    return value > 0 ? 0.65 : 0;
  }

  return clamp(value / (averageValue * 1.5), 0, 1);
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    notation: Math.abs(value) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);

export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(`${value}T12:00:00`));

export const calculateEngagementRate = (reel: Reel) => {
  const denominator = reel.reach > 0 ? reel.reach : reel.views;
  return safeRate(reel.likes + reel.comments + reel.saves + reel.shares, denominator);
};

export const calculateFollowerConversion = (reel: Reel) => safeRate(reel.newFollowers, reel.views);

export const calculateSaveRate = (reel: Reel) => safeRate(reel.saves, reel.views);

export const calculateShareRate = (reel: Reel) => safeRate(reel.shares, reel.views);

export const calculateCommentRate = (reel: Reel) => safeRate(reel.comments, reel.views);

export const calculateReelScore = (reel: Reel, allReels: Reel[]) => {
  const comparison = allReels.length ? allReels : [reel];
  const viewScore = scoreAgainstAverage(reel.views, average(comparison.map((item) => item.views)));
  const engagementScore = scoreAgainstAverage(
    calculateEngagementRate(reel),
    average(comparison.map(calculateEngagementRate)),
  );
  const saveScore = scoreAgainstAverage(
    calculateSaveRate(reel),
    average(comparison.map(calculateSaveRate)),
  );
  const shareScore = scoreAgainstAverage(
    calculateShareRate(reel),
    average(comparison.map(calculateShareRate)),
  );
  const followerScore = scoreAgainstAverage(
    calculateFollowerConversion(reel),
    average(comparison.map(calculateFollowerConversion)),
  );

  const weightedParts = [
    { value: viewScore, weight: 0.3 },
    { value: engagementScore, weight: 0.25 },
    { value: saveScore, weight: 0.12 },
    { value: shareScore, weight: 0.1 },
    { value: followerScore, weight: 0.15 },
  ];

  if (reel.retentionRate > 0) {
    weightedParts.push({ value: clamp(reel.retentionRate / 100, 0, 1), weight: 0.08 });
  }

  const totalWeight = weightedParts.reduce((total, part) => total + part.weight, 0);
  const weightedScore =
    totalWeight > 0
      ? weightedParts.reduce((total, part) => total + part.value * part.weight, 0) / totalWeight
      : 0;

  return Math.round(clamp(1 + weightedScore * 9, 1, 10) * 10) / 10;
};

export const getReelTotals = (items: Reel[]) =>
  items.reduce(
    (totals, reel) => ({
      views: totals.views + reel.views,
      reach: totals.reach + reel.reach,
      likes: totals.likes + reel.likes,
      comments: totals.comments + reel.comments,
      saves: totals.saves + reel.saves,
      shares: totals.shares + reel.shares,
      newFollowers: totals.newFollowers + reel.newFollowers,
    }),
    {
      views: 0,
      reach: 0,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      newFollowers: 0,
    },
  );

export const calculateAverageViews = (items: Reel[]) => average(items.map((reel) => reel.views));

export const calculateAverageEngagement = (items: Reel[]) =>
  average(items.map(calculateEngagementRate));

export const calculateAverageScore = (items: Reel[]) =>
  average(items.map((reel) => calculateReelScore(reel, items)));

export const getBestReel = (items: Reel[]) =>
  [...items].sort((a, b) => calculateReelScore(b, items) - calculateReelScore(a, items))[0];

export const getWorstReel = (items: Reel[]) =>
  [...items].sort((a, b) => calculateReelScore(a, items) - calculateReelScore(b, items))[0];

export const getTopTopicByAverageViews = (items: Reel[]) => {
  const topics = items.reduce<Record<string, { views: number; count: number }>>((result, reel) => {
    const current = result[reel.topic] ?? { views: 0, count: 0 };
    result[reel.topic] = {
      views: current.views + reel.views,
      count: current.count + 1,
    };
    return result;
  }, {});

  return (
    (Object.entries(topics).sort(
      ([, a], [, b]) => b.views / b.count - a.views / a.count,
    )[0]?.[0] as ReelTopic | undefined) ?? null
  );
};

export const getReelInsight = (reel: Reel, allReels: Reel[]): ReelInsight => {
  const averageViews = calculateAverageViews(allReels);
  const engagement = calculateEngagementRate(reel);
  const averageEngagement = calculateAverageEngagement(allReels);
  const saveRate = calculateSaveRate(reel);
  const followerConversion = calculateFollowerConversion(reel);
  const topTopic = getTopTopicByAverageViews(allReels);

  const strength =
    saveRate >= 3
      ? `Полезность: save rate ${saveRate.toFixed(1)}% показывает, что ролик хочется сохранить.`
      : engagement >= averageEngagement
        ? `Вовлечённость ${engagement.toFixed(1)}% выше среднего по вашим Reels.`
        : reel.views >= averageViews
          ? "Ролик хорошо набирает просмотры относительно остальных публикаций."
          : "Ролик даёт полезную точку сравнения для следующих экспериментов.";

  const weakness =
    reel.retentionRate > 0 && reel.retentionRate < 45
      ? `Удержание ${reel.retentionRate.toFixed(0)}%: вероятно, середину ролика стоит сократить.`
      : reel.views > averageViews && followerConversion < 0.4
        ? "Охват хороший, но ролик слабо переводит зрителей в подписку."
        : engagement < averageEngagement
          ? "Вовлечённость ниже среднего: аудитории не хватает повода ответить или сохранить."
          : "Явной слабой зоны нет, но следующий тест стоит сфокусировать на первых секундах.";

  return {
    strength,
    weakness,
    repeatTopic:
      reel.topic === topTopic
        ? `Да. Тема «${reel.topic}» лидирует по средним просмотрам.`
        : `Тему можно повторить с новым углом, но текущий лидер — «${topTopic ?? reel.topic}».`,
    nextStep:
      reel.hook.trim().length < 35
        ? "Сделайте hook конкретнее: добавьте результат, цифру или понятный конфликт."
        : followerConversion < 0.4
          ? "Добавьте ранний и ясный призыв подписаться ради продолжения темы."
          : "Сохраните структуру и протестируйте более короткую версию с тем же обещанием.",
  };
};

export const generateDashboardInsight = (items: Reel[]): AIInsight => {
  if (!items.length) {
    return {
      id: "local-empty",
      title: "Добавьте первый Reel",
      summary: "Локальная аналитика появится после сохранения хотя бы одного ролика.",
      recommendation: "Начните с ручного ввода основных метрик.",
      impact: "Первый ориентир для роста",
      priority: "medium",
      category: "topic",
    };
  }

  const topTopic = getTopTopicByAverageViews(items) ?? items[0].topic;
  const averageSaveRate = average(items.map(calculateSaveRate));
  const averageViews = calculateAverageViews(items);
  const averageFollowers = average(items.map(calculateFollowerConversion));
  const strongestEngagement = [...items].sort(
    (a, b) => calculateEngagementRate(b) - calculateEngagementRate(a),
  )[0];

  if (averageSaveRate >= 3) {
    return {
      id: "local-saves",
      title: "Полезный контент работает",
      summary: `Средний save rate составляет ${averageSaveRate.toFixed(1)}%. Аудитория возвращается к вашим материалам.`,
      recommendation: `Развивайте тему «${topTopic}» в формате серий и чек-листов.`,
      impact: "Больше сохранений и повторных просмотров",
      priority: "high",
      category: "format",
    };
  }

  if (averageViews >= 50000 && averageFollowers < 0.4) {
    return {
      id: "local-conversion",
      title: "Охват есть, подписок можно получать больше",
      summary: "Ролики находят зрителей, но не всегда объясняют, зачем оставаться с автором.",
      recommendation:
        "Добавляйте в первую половину ролика обещание следующего полезного материала.",
      impact: "Рост конверсии в подписку",
      priority: "high",
      category: "hook",
    };
  }

  if (
    strongestEngagement &&
    strongestEngagement.views < averageViews &&
    calculateEngagementRate(strongestEngagement) > calculateAverageEngagement(items)
  ) {
    return {
      id: "local-hook",
      title: "Сильной теме нужен лучший hook",
      summary: `Ролик «${strongestEngagement.title}» хорошо вовлекает тех, кто его увидел, но получает мало просмотров.`,
      recommendation: "Перезапустите тему с более конкретной первой фразой и коротким вступлением.",
      impact: "Потенциал дополнительного охвата",
      priority: "medium",
      category: "hook",
    };
  }

  return {
    id: "local-topic",
    title: `Развивайте тему «${topTopic}»`,
    summary: "Она лидирует по средним просмотрам среди сохранённых роликов.",
    recommendation: "Сделайте серию из двух-трёх роликов с разными hook и форматами.",
    impact: "Более предсказуемый рост просмотров",
    priority: "high",
    category: "topic",
  };
};
