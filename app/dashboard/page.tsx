"use client";

import {
  mdiAccountMultiplePlusOutline,
  mdiAlertCircleOutline,
  mdiCalendarStar,
  mdiChartTimelineVariant,
  mdiLightbulbOnOutline,
  mdiEyeOutline,
  mdiMovieOpenOutline,
} from "@mdi/js";
import Button from "../_components/Button";
import CardBox from "../_components/CardBox";
import Icon from "../_components/Icon";
import SectionMain from "../_components/Section/Main";
import { useReels } from "../../src/hooks/useReels";
import { generateDashboardOverview } from "../../src/services/aiRecommendationEngine";
import type { Metric } from "../../src/types";
import {
  calculateAverageEngagement,
  calculateAverageViews,
  calculateReelScore,
  formatNumber,
  getBestReel,
  getReelTotals,
  getWorstReel,
} from "../../src/utils/analytics";
import AIInsightCard from "./_components/Analytics/AIInsightCard";
import DataConfidenceNotice from "./_components/Analytics/DataConfidenceNotice";
import MetricCard from "./_components/Analytics/MetricCard";
import PageIntro from "./_components/Analytics/PageIntro";
import PerformanceChart from "./_components/Analytics/PerformanceChart";
import RecommendationBadge from "./_components/Analytics/RecommendationBadge";
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
  const overview = generateDashboardOverview(reels);
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

      <DataConfidenceNotice reelsCount={reels.length} />

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
            <AIInsightCard insight={overview.insight} featured />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <CardBox>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-fuchsia-600 uppercase">
                    Контент-сигналы
                  </p>
                  <h2 className="mt-1 text-lg font-bold">Топ-3 темы</h2>
                </div>
                <RecommendationBadge tone="repeat" />
              </div>
              <div className="mt-5 space-y-3">
                {overview.topTopics.map((topic, index) => (
                  <div
                    key={topic.topic}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-slate-800/70"
                  >
                    <div className="min-w-0">
                      <p className="font-bold">
                        {index + 1}. {topic.topic}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatNumber(topic.averageViews)} просмотров · ER{" "}
                        {topic.averageEngagementRate.toFixed(1)}%
                      </p>
                    </div>
                    <RecommendationBadge tone={topic.status} />
                  </div>
                ))}
              </div>
            </CardBox>

            <CardBox>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-violet-600 uppercase">
                    Подача
                  </p>
                  <h2 className="mt-1 text-lg font-bold">Топ-3 формата</h2>
                </div>
                <RecommendationBadge tone="test" />
              </div>
              <div className="mt-5 space-y-3">
                {overview.topFormats.map((format, index) => (
                  <div
                    key={format.format}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-slate-800/70"
                  >
                    <div className="min-w-0">
                      <p className="font-bold">
                        {index + 1}. {format.format}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {format.averageScore.toFixed(1)} score ·{" "}
                        {format.averageFollowerConversion.toFixed(2)}% в подписку
                      </p>
                    </div>
                    <RecommendationBadge tone={format.status} />
                  </div>
                ))}
              </div>
            </CardBox>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                icon: mdiCalendarStar,
                label: "Лучший день публикации",
                value: overview.bestPostingDay,
                className: "text-violet-600 bg-violet-50 dark:bg-violet-500/10",
              },
              {
                icon: mdiAlertCircleOutline,
                label: "Главный риск",
                value: overview.mainRisk,
                className: "text-rose-600 bg-rose-50 dark:bg-rose-500/10",
              },
              {
                icon: mdiLightbulbOnOutline,
                label: "Следующий лучший шаг",
                value: overview.nextStep,
                className: "text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10",
              },
            ].map((item) => (
              <CardBox key={item.label}>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.className}`}
                >
                  <Icon path={item.icon} size="22" w="" h="" />
                </div>
                <p className="mt-4 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-6 font-semibold">{item.value}</p>
              </CardBox>
            ))}
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
