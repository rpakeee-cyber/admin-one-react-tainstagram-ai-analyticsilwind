"use client";

import {
  mdiAccountMultiplePlusOutline,
  mdiChartTimelineVariant,
  mdiEyeOutline,
  mdiMovieOpenOutline,
} from "@mdi/js";
import Button from "../_components/Button";
import CardBox from "../_components/CardBox";
import SectionMain from "../_components/Section/Main";
import { useReels } from "../../src/hooks/useReels";
import type { Metric } from "../../src/types";
import {
  calculateAverageEngagement,
  calculateAverageViews,
  calculateReelScore,
  formatNumber,
  generateDashboardInsight,
  getBestReel,
  getReelTotals,
  getTopTopicByAverageViews,
  getWorstReel,
} from "../../src/utils/analytics";
import AIInsightCard from "./_components/Analytics/AIInsightCard";
import MetricCard from "./_components/Analytics/MetricCard";
import PageIntro from "./_components/Analytics/PageIntro";
import PerformanceChart from "./_components/Analytics/PerformanceChart";
import ReelCard from "./_components/Analytics/ReelCard";
import ReelsTable from "./_components/Analytics/ReelsTable";
import EmptyReelsState from "./_components/Reels/EmptyReelsState";

const metricIcons = [
  mdiMovieOpenOutline,
  mdiEyeOutline,
  mdiChartTimelineVariant,
  mdiAccountMultiplePlusOutline,
];

const metricAccents = [
  "from-fuchsia-500 to-pink-500",
  "from-violet-500 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-amber-400 to-orange-500",
];

export default function DashboardPage() {
  const { reels, isReady } = useReels();

  if (!isReady) {
    return (
      <SectionMain>
        <div className="h-80 animate-pulse rounded-3xl bg-white dark:bg-slate-900/70" />
      </SectionMain>
    );
  }

  const totals = getReelTotals(reels);
  const bestReel = getBestReel(reels);
  const worstReel = getWorstReel(reels);
  const topTopic = getTopTopicByAverageViews(reels);
  const insight = generateDashboardInsight(reels);
  const metrics: Metric[] = [
    {
      id: "reels",
      label: "Всего роликов",
      value: reels.length,
      change: 0,
      format: "number",
      direction: "neutral",
    },
    {
      id: "views",
      label: "Средние просмотры",
      value: calculateAverageViews(reels),
      change: 0,
      format: "number",
      direction: "neutral",
    },
    {
      id: "engagement",
      label: "Средний engagement",
      value: calculateAverageEngagement(reels),
      change: 0,
      format: "percent",
      direction: "neutral",
    },
    {
      id: "followers",
      label: "Новые подписчики",
      value: totals.newFollowers,
      change: 0,
      format: "number",
      direction: "neutral",
    },
  ];

  return (
    <SectionMain>
      <PageIntro
        eyebrow="Локальная аналитика"
        title="Instagram AI Analytics"
        description="Dashboard пересчитывается по Reels, сохранённым в этом браузере."
        actions={
          <Button href="/dashboard/add-reel" label="Добавить Reel" color="contrast" roundedFull />
        }
      />

      {reels.length === 0 ? (
        <EmptyReelsState />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
            {metrics.map((metric, index) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                icon={metricIcons[index]}
                accent={metricAccents[index]}
              />
            ))}
          </div>

          <div className="mb-6">
            <AIInsightCard insight={insight} featured />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_1fr]">
            <CardBox>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Динамика просмотров
                </h2>
                <p className="mt-1 text-sm text-gray-400">Ролики расположены по дате публикации</p>
              </div>
              <PerformanceChart reels={reels} />
            </CardBox>

            <div className="grid gap-6">
              <CardBox>
                <p className="text-sm font-medium text-gray-400">Топ-тема</p>
                <h3 className="mt-2 text-2xl font-bold">{topTopic ?? "Нет данных"}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
                  Лидирует по средним просмотрам, а не только по одному удачному ролику.
                </p>
              </CardBox>
              <CardBox>
                <p className="text-sm font-medium text-gray-400">Лучший Reel</p>
                <h3 className="mt-2 line-clamp-2 text-lg font-bold">{bestReel?.title}</h3>
                <p className="mt-2 text-sm text-emerald-600">
                  Score {bestReel ? calculateReelScore(bestReel, reels).toFixed(1) : "—"}
                </p>
              </CardBox>
              <CardBox>
                <p className="text-sm font-medium text-gray-400">Точка роста</p>
                <h3 className="mt-2 line-clamp-2 text-lg font-bold">{worstReel?.title}</h3>
                <p className="mt-2 text-sm text-rose-500">
                  Score {worstReel ? calculateReelScore(worstReel, reels).toFixed(1) : "—"}
                </p>
              </CardBox>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Свежие Reels</h2>
              <p className="mt-1 text-sm text-gray-400">
                Всего просмотров: {formatNumber(totals.views)}
              </p>
            </div>
            <Button
              href="/dashboard/reels"
              label="Все ролики"
              color="whiteDark"
              roundedFull
              small
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 xl:hidden">
            {reels.slice(0, 3).map((reel) => (
              <ReelCard key={reel.id} reel={reel} allReels={reels} compact />
            ))}
          </div>

          <CardBox className="hidden xl:flex" hasTable>
            <ReelsTable reels={reels.slice(0, 5)} allReels={reels} />
          </CardBox>
        </>
      )}
    </SectionMain>
  );
}
