import type {
  AnalysisStatus,
  ContentDirection,
  ContentDirectionSignal,
  ContentGoal,
  FormatAnalysis,
  HookAnalysis,
  HookPerformanceGroup,
  PostingDayAnalysis,
  PostingDaysAnalysis,
  Reel,
  ReelFormat,
  ReelRankingMetric,
  ReelTopic,
  TopicAnalysis,
  WeakReelRankingMetric,
} from "../types";

const dayNames = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const finite = (value: number) => (Number.isFinite(value) ? value : 0);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(finite(value), min), max);

const safeRate = (value: number, denominator: number) =>
  denominator > 0 ? (Math.max(finite(value), 0) / denominator) * 100 : 0;

const average = (values: number[]) =>
  values.length
    ? finite(values.reduce((total, value) => total + finite(value), 0) / values.length)
    : 0;

const sum = (values: number[]) => values.reduce((total, value) => total + finite(value), 0);

const scoreAgainstAverage = (value: number, averageValue: number) => {
  if (averageValue <= 0) {
    return value > 0 ? 0.65 : 0;
  }

  return clamp(value / (averageValue * 1.5), 0, 1);
};

const getRelativeStatus = (
  composite: number,
  sampleCount: number,
  totalReels: number,
): AnalysisStatus => {
  if (sampleCount === 0 || totalReels < 3) {
    return "medium";
  }

  if (composite >= 1.08) {
    return "strong";
  }

  if (composite <= 0.82) {
    return "weak";
  }

  return "medium";
};

const relativeRatio = (value: number, baseline: number) => {
  if (baseline <= 0) {
    return value > 0 ? 1 : 0;
  }

  return clamp(value / baseline, 0, 2);
};

const parsePublishDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getDataLevel = (reels: Reel[]): ContentDirection["summary"]["dataLevel"] => {
  if (reels.length === 0) {
    return "empty";
  }

  return reels.length < 3 ? "low" : "personalized";
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    notation: Math.abs(finite(value)) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(finite(value));

export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) => {
  const date = parsePublishDate(value);

  if (!date) {
    return "Дата не указана";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
};

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

  const totalWeight = sum(weightedParts.map((part) => part.weight));
  const weightedScore =
    totalWeight > 0 ? sum(weightedParts.map((part) => part.value * part.weight)) / totalWeight : 0;

  return Math.round(clamp(1 + weightedScore * 9, 1, 10) * 10) / 10;
};

export const getReelTotals = (items: Reel[]) =>
  items.reduce(
    (totals, reel) => ({
      views: totals.views + finite(reel.views),
      reach: totals.reach + finite(reel.reach),
      likes: totals.likes + finite(reel.likes),
      comments: totals.comments + finite(reel.comments),
      saves: totals.saves + finite(reel.saves),
      shares: totals.shares + finite(reel.shares),
      newFollowers: totals.newFollowers + finite(reel.newFollowers),
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

export const calculateAverageFollowerConversion = (items: Reel[]) =>
  average(items.map(calculateFollowerConversion));

export const calculateAverageScore = (items: Reel[]) =>
  average(items.map((reel) => calculateReelScore(reel, items)));

const getRankingValue = (
  reel: Reel,
  metric: ReelRankingMetric | WeakReelRankingMetric,
  allReels: Reel[],
) => {
  switch (metric) {
    case "views":
      return finite(reel.views);
    case "engagementRate":
      return calculateEngagementRate(reel);
    case "saves":
      return finite(reel.saves);
    case "shares":
      return finite(reel.shares);
    case "newFollowers":
      return finite(reel.newFollowers);
    case "followerConversion":
      return calculateFollowerConversion(reel);
    case "score":
      return calculateReelScore(reel, allReels);
    default:
      return 0;
  }
};

export const getTopReels = (reels: Reel[], metric: ReelRankingMetric, limit = 3) =>
  [...reels]
    .sort(
      (a, b) =>
        getRankingValue(b, metric, reels) - getRankingValue(a, metric, reels) ||
        b.publishDate.localeCompare(a.publishDate),
    )
    .slice(0, Math.max(0, limit));

export const getWeakReels = (reels: Reel[], metric: WeakReelRankingMetric, limit = 3) =>
  [...reels]
    .sort(
      (a, b) =>
        getRankingValue(a, metric, reels) - getRankingValue(b, metric, reels) ||
        b.publishDate.localeCompare(a.publishDate),
    )
    .slice(0, Math.max(0, limit));

export const getBestReel = (items: Reel[]) => getTopReels(items, "score", 1)[0];

export const getWorstReel = (items: Reel[]) => getWeakReels(items, "score", 1)[0];

export const analyzeTopics = (reels: Reel[]): TopicAnalysis[] => {
  if (!reels.length) {
    return [];
  }

  const baselineViews = calculateAverageViews(reels);
  const baselineEngagement = calculateAverageEngagement(reels);
  const baselineScore = calculateAverageScore(reels);
  const grouped = reels.reduce<Partial<Record<ReelTopic, Reel[]>>>((result, reel) => {
    result[reel.topic] = [...(result[reel.topic] ?? []), reel];
    return result;
  }, {});

  return Object.entries(grouped)
    .map(([topic, topicReels]) => {
      const items = topicReels ?? [];
      const averageViews = calculateAverageViews(items);
      const averageEngagementRate = calculateAverageEngagement(items);
      const averageScore = average(items.map((reel) => calculateReelScore(reel, reels)));
      const composite =
        relativeRatio(averageViews, baselineViews) * 0.45 +
        relativeRatio(averageEngagementRate, baselineEngagement) * 0.3 +
        relativeRatio(averageScore, baselineScore) * 0.25;

      return {
        topic: topic as ReelTopic,
        count: items.length,
        averageViews,
        averageEngagementRate,
        averageSaves: average(items.map((reel) => reel.saves)),
        averageShares: average(items.map((reel) => reel.shares)),
        totalNewFollowers: sum(items.map((reel) => reel.newFollowers)),
        averageScore,
        status: getRelativeStatus(composite, items.length, reels.length),
      };
    })
    .sort(
      (a, b) =>
        b.averageScore - a.averageScore || b.averageViews - a.averageViews || b.count - a.count,
    );
};

export const analyzeFormats = (reels: Reel[]): FormatAnalysis[] => {
  if (!reels.length) {
    return [];
  }

  const baselineViews = calculateAverageViews(reels);
  const baselineEngagement = calculateAverageEngagement(reels);
  const baselineConversion = calculateAverageFollowerConversion(reels);
  const baselineScore = calculateAverageScore(reels);
  const grouped = reels.reduce<Partial<Record<ReelFormat, Reel[]>>>((result, reel) => {
    result[reel.format] = [...(result[reel.format] ?? []), reel];
    return result;
  }, {});

  return Object.entries(grouped)
    .map(([format, formatReels]) => {
      const items = formatReels ?? [];
      const averageViews = calculateAverageViews(items);
      const averageEngagementRate = calculateAverageEngagement(items);
      const averageFollowerConversion = calculateAverageFollowerConversion(items);
      const averageScore = average(items.map((reel) => calculateReelScore(reel, reels)));
      const composite =
        relativeRatio(averageViews, baselineViews) * 0.35 +
        relativeRatio(averageEngagementRate, baselineEngagement) * 0.25 +
        relativeRatio(averageFollowerConversion, baselineConversion) * 0.2 +
        relativeRatio(averageScore, baselineScore) * 0.2;

      return {
        format: format as ReelFormat,
        count: items.length,
        averageViews,
        averageEngagementRate,
        averageFollowerConversion,
        averageScore,
        status: getRelativeStatus(composite, items.length, reels.length),
      };
    })
    .sort(
      (a, b) =>
        b.averageScore - a.averageScore || b.averageViews - a.averageViews || b.count - a.count,
    );
};

const summarizeHookGroup = (reels: Reel[], allReels: Reel[]): HookPerformanceGroup => ({
  count: reels.length,
  averageViews: calculateAverageViews(reels),
  averageEngagementRate: calculateAverageEngagement(reels),
  averageScore: average(reels.map((reel) => calculateReelScore(reel, allReels))),
});

export const analyzeHooks = (reels: Reel[]): HookAnalysis => {
  const withHook = reels.filter((reel) => reel.hook.trim().length > 0);
  const withoutHook = reels.filter((reel) => reel.hook.trim().length === 0);
  const rankedHooks = getTopReels(withHook, "score", 5);
  const withHookSummary = summarizeHookGroup(withHook, reels);
  const withoutHookSummary = summarizeHookGroup(withoutHook, reels);

  return {
    withHook: withHookSummary,
    withoutHook: withoutHookSummary,
    topHooks: rankedHooks.map((reel) => ({
      reelId: reel.id,
      reelTitle: reel.title,
      hook: reel.hook.trim(),
      score: calculateReelScore(reel, reels),
    })),
    repeatHooks: Array.from(
      new Set(rankedHooks.map((reel) => reel.hook.trim()).filter(Boolean)),
    ).slice(0, 3),
    shouldPrioritizeHooks:
      withoutHook.length > 0 &&
      (withHook.length === 0 || withHookSummary.averageScore >= withoutHookSummary.averageScore),
  };
};

export const analyzePostingDays = (reels: Reel[]): PostingDaysAnalysis => {
  const grouped = reels.reduce<Record<number, Reel[]>>((result, reel) => {
    const date = parsePublishDate(reel.publishDate);

    if (!date) {
      return result;
    }

    const dayIndex = date.getDay();
    result[dayIndex] = [...(result[dayIndex] ?? []), reel];
    return result;
  }, {});

  const baselineViews = calculateAverageViews(reels);
  const baselineEngagement = calculateAverageEngagement(reels);
  const baselineScore = calculateAverageScore(reels);
  const days = Object.entries(grouped)
    .map(([dayIndexValue, dayReels]) => {
      const dayIndex = Number(dayIndexValue);
      const averageViews = calculateAverageViews(dayReels);
      const averageEngagementRate = calculateAverageEngagement(dayReels);
      const averageScore = average(dayReels.map((reel) => calculateReelScore(reel, reels)));
      const composite =
        relativeRatio(averageViews, baselineViews) * 0.5 +
        relativeRatio(averageEngagementRate, baselineEngagement) * 0.25 +
        relativeRatio(averageScore, baselineScore) * 0.25;

      return {
        dayIndex,
        dayName: dayNames[dayIndex],
        count: dayReels.length,
        averageViews,
        averageEngagementRate,
        averageFollowerConversion: calculateAverageFollowerConversion(dayReels),
        averageScore,
        status: getRelativeStatus(composite, dayReels.length, reels.length),
      } satisfies PostingDayAnalysis;
    })
    .sort(
      (a, b) =>
        b.averageViews - a.averageViews || b.averageScore - a.averageScore || b.count - a.count,
    );

  return {
    days,
    bestDay: days[0] ?? null,
    bestDays: days.slice(0, 3),
    weakDays: [...days].reverse().slice(0, Math.min(2, days.length)),
  };
};

export const getTopTopicByAverageViews = (items: Reel[]) =>
  [...analyzeTopics(items)].sort((a, b) => b.averageViews - a.averageViews)[0]?.topic ?? null;

const toSignal = (
  kind: ContentDirectionSignal["kind"],
  value: string,
  status: AnalysisStatus,
  score: number,
): ContentDirectionSignal => ({
  kind,
  value,
  status,
  score: finite(score),
});

const getPrimaryRisk = (
  reels: Reel[],
  hookAnalysis: HookAnalysis,
): ContentDirection["summary"]["primaryRisk"] => {
  if (reels.length < 3) {
    return "limited-data";
  }

  if (hookAnalysis.shouldPrioritizeHooks) {
    return "missing-hooks";
  }

  if (calculateAverageFollowerConversion(reels) < 0.4) {
    return "low-follower-conversion";
  }

  if (calculateAverageEngagement(reels) < 3) {
    return "low-engagement";
  }

  return "none";
};

export const getContentDirection = (reels: Reel[]): ContentDirection => {
  const topics = analyzeTopics(reels);
  const formats = analyzeFormats(reels);
  const postingDays = analyzePostingDays(reels);
  const hooks = analyzeHooks(reels);
  const topTopics = topics.filter((item) => item.status === "strong").slice(0, 3);
  const topFormats = formats.filter((item) => item.status === "strong").slice(0, 3);
  const resolvedTopTopics = topTopics.length ? topTopics : topics.slice(0, 3);
  const resolvedTopFormats = topFormats.length ? topFormats : formats.slice(0, 3);
  const weakTopics = topics.filter((item) => item.status === "weak").slice(0, 3);
  const weakFormats = formats.filter((item) => item.status === "weak").slice(0, 3);
  const fallbackTopic: ReelTopic = resolvedTopTopics[0]?.topic ?? "Работа";
  const fallbackFormat: ReelFormat = resolvedTopFormats[0]?.format ?? "Day in Life";
  const goals: ContentGoal[] = ["Охват", "Доверие", "Подписки"];

  return {
    topTopics: resolvedTopTopics,
    weakTopics,
    topFormats: resolvedTopFormats,
    weakFormats,
    bestPostingDays: postingDays.bestDays,
    repeatRecommendations: [
      ...resolvedTopTopics.map((item) =>
        toSignal("topic", item.topic, item.status, item.averageScore),
      ),
      ...resolvedTopFormats.map((item) =>
        toSignal("format", item.format, item.status, item.averageScore),
      ),
      ...postingDays.bestDays
        .slice(0, 1)
        .map((item) => toSignal("day", item.dayName, item.status, item.averageScore)),
    ],
    stopRecommendations: [
      ...weakTopics.map((item) => toSignal("topic", item.topic, item.status, item.averageScore)),
      ...weakFormats.map((item) => toSignal("format", item.format, item.status, item.averageScore)),
    ],
    nextIdeas: goals.map((goal, index) => ({
      topic:
        resolvedTopTopics[index % Math.max(resolvedTopTopics.length, 1)]?.topic ?? fallbackTopic,
      format:
        resolvedTopFormats[index % Math.max(resolvedTopFormats.length, 1)]?.format ??
        fallbackFormat,
      goal,
    })),
    hookSuggestions: hooks.repeatHooks,
    summary: {
      dataLevel: getDataLevel(reels),
      topTopic: resolvedTopTopics[0]?.topic ?? null,
      topFormat: resolvedTopFormats[0]?.format ?? null,
      bestDay: postingDays.bestDay?.dayName ?? null,
      primaryRisk: getPrimaryRisk(reels, hooks),
    },
  };
};
