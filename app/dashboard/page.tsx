import {
  mdiAccountMultiplePlusOutline,
  mdiChartTimelineVariant,
  mdiEyeOutline,
  mdiStarOutline,
} from "@mdi/js";
import type { Metadata } from "next";
import Button from "../_components/Button";
import CardBox from "../_components/CardBox";
import SectionMain from "../_components/Section/Main";
import { getPageTitle } from "../_lib/config";
import { aiInsights, dashboardMetrics, reels } from "../../src/data/demoData";
import AIInsightCard from "./_components/Analytics/AIInsightCard";
import MetricCard from "./_components/Analytics/MetricCard";
import PageIntro from "./_components/Analytics/PageIntro";
import PerformanceChart from "./_components/Analytics/PerformanceChart";
import ReelCard from "./_components/Analytics/ReelCard";
import ReelsTable from "./_components/Analytics/ReelsTable";

export const metadata: Metadata = {
  title: getPageTitle("Dashboard"),
};

const metricIcons = [
  mdiEyeOutline,
  mdiChartTimelineVariant,
  mdiAccountMultiplePlusOutline,
  mdiStarOutline,
];

const metricAccents = [
  "from-fuchsia-500 to-pink-500",
  "from-violet-500 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-amber-400 to-orange-500",
];

export default function DashboardPage() {
  return (
    <SectionMain>
      <PageIntro
        eyebrow="Обзор · 30 дней"
        title="Добрый вечер, Алия"
        description="Вот как растут ваши Reels. Все показатели пока собраны из демонстрационных данных."
        actions={
          <Button
            href="/dashboard/add-reel"
            label="Добавить Reel"
            color="contrast"
            roundedFull
          />
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            icon={metricIcons[index]}
            accent={metricAccents[index]}
          />
        ))}
      </div>

      <div className="mb-6">
        <AIInsightCard insight={aiInsights[0]} featured />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <CardBox>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Динамика просмотров
              </h2>
              <p className="mt-1 text-sm text-gray-400">Последние опубликованные Reels</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              +18,4%
            </span>
          </div>
          <PerformanceChart reels={reels} />
        </CardBox>

        <div className="grid gap-6">
          <CardBox>
            <p className="text-sm font-medium text-gray-400">Лучший формат</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">До / после</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
              В среднем на 64% больше сохранений и в 2,3 раза больше новых подписчиков.
            </p>
          </CardBox>
          <CardBox>
            <p className="text-sm font-medium text-gray-400">Лучшее время</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              Четверг, 19:30
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
              В это окно активны 82% наиболее вовлечённых подписчиков.
            </p>
          </CardBox>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Свежие Reels</h2>
          <p className="mt-1 text-sm text-gray-400">Последние результаты контента</p>
        </div>
        <Button href="/dashboard/reels" label="Все ролики" color="whiteDark" roundedFull small />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 xl:hidden">
        {reels.slice(0, 3).map((reel) => (
          <ReelCard key={reel.id} reel={reel} compact />
        ))}
      </div>

      <CardBox className="hidden xl:flex" hasTable>
        <ReelsTable reels={reels.slice(0, 5)} />
      </CardBox>
    </SectionMain>
  );
}
