import type { Reel } from "../types";

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);

export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    ...options,
  }).format(new Date(`${value}T12:00:00`));

export const calculateEngagementRate = (reel: Reel) => {
  if (!reel.views) {
    return 0;
  }

  return ((reel.likes + reel.comments + reel.saves + reel.shares) / reel.views) * 100;
};

export const getReelTotals = (items: Reel[]) =>
  items.reduce(
    (totals, reel) => ({
      views: totals.views + reel.views,
      likes: totals.likes + reel.likes,
      comments: totals.comments + reel.comments,
      saves: totals.saves + reel.saves,
      shares: totals.shares + reel.shares,
      newFollowers: totals.newFollowers + reel.newFollowers,
    }),
    {
      views: 0,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      newFollowers: 0,
    },
  );

export const calculateAverageScore = (items: Reel[]) =>
  items.length
    ? items.reduce((total, reel) => total + reel.score, 0) / items.length
    : 0;

export const getTopTopic = (items: Reel[]) => {
  const topics = items.reduce<Record<string, { count: number; views: number }>>((result, reel) => {
    const current = result[reel.topic] ?? { count: 0, views: 0 };
    result[reel.topic] = {
      count: current.count + 1,
      views: current.views + reel.views,
    };
    return result;
  }, {});

  return Object.entries(topics).sort(([, a], [, b]) => b.views - a.views)[0]?.[0] ?? "Нет данных";
};
