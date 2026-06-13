"use client";

import {
  mdiCalendarCheckOutline,
  mdiCheckCircleOutline,
  mdiClockOutline,
  mdiLightbulbOutline,
  mdiScriptTextOutline,
} from "@mdi/js";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import Icon from "../../_components/Icon";
import SectionMain from "../../_components/Section/Main";
import { useReels } from "../../../src/hooks/useReels";
import { generateWeeklyRecommendations } from "../../../src/services/aiRecommendationEngine";
import type { WeeklyPlanItem } from "../../../src/types";
import { formatDate } from "../../../src/utils/analytics";
import DataConfidenceNotice from "../_components/Analytics/DataConfidenceNotice";
import PageIntro from "../_components/Analytics/PageIntro";

const statusConfig: Record<
  WeeklyPlanItem["status"],
  { label: string; icon: string; className: string }
> = {
  idea: {
    label: "Идея",
    icon: mdiLightbulbOutline,
    className: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  },
  script: {
    label: "Сценарий",
    icon: mdiScriptTextOutline,
    className: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  },
  ready: {
    label: "Готово",
    icon: mdiCheckCircleOutline,
    className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  scheduled: {
    label: "Запланировано",
    icon: mdiClockOutline,
    className: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
  },
};

export default function ContentPlanPage() {
  const { reels, isReady } = useReels();

  if (!isReady) {
    return (
      <SectionMain>
        <div className="h-80 animate-pulse rounded-3xl bg-white dark:bg-slate-900/70" />
      </SectionMain>
    );
  }

  const weekly = generateWeeklyRecommendations(reels);
  const readyCount = weekly.schedule.filter((item) => item.status === "ready").length;
  const activeCount = weekly.schedule.filter((item) =>
    ["script", "scheduled"].includes(item.status),
  ).length;
  const uniqueGoals = new Set(weekly.schedule.map((item) => item.goal)).size;

  return (
    <SectionMain>
      <PageIntro
        eyebrow="Персональная неделя"
        title="Контент-план"
        description="План на семь дней пересчитывается по текущим темам, форматам и целям сохранённых Reels."
        actions={
          <Button
            href="/dashboard/ai-recommendations"
            label="Открыть рекомендации"
            color="contrast"
            roundedFull
          />
        }
      />

      <DataConfidenceNotice reelsCount={reels.length} />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Дней в плане", weekly.schedule.length],
          ["Готово к съёмке", readyCount],
          ["В работе", activeCount],
          ["Контент-целей", uniqueGoals],
        ].map(([label, value]) => (
          <CardBox key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </CardBox>
        ))}
      </div>

      <CardBox className="mb-6">
        <p className="text-xs font-bold tracking-[0.14em] text-fuchsia-600 uppercase">
          Направление недели
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{weekly.summary}</p>
      </CardBox>

      <div className="space-y-4">
        {weekly.schedule.map((item) => {
          const status = statusConfig[item.status];

          return (
            <CardBox key={item.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800">
                  <span className="text-[10px] font-bold text-fuchsia-600 uppercase">
                    {item.day}
                  </span>
                  <span className="mt-1 text-lg font-black">
                    {new Date(`${item.date}T12:00:00`).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
                    >
                      <Icon path={status.icon} size="13" w="" h="" />
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                    {formatDate(item.date)} · {item.topic} · {item.format}
                  </p>
                  <div className="mt-4 rounded-2xl bg-violet-50 p-4 dark:bg-violet-500/10">
                    <p className="text-xs font-bold tracking-wide text-violet-700 uppercase dark:text-violet-300">
                      Hook
                    </p>
                    <p className="mt-2 text-sm leading-6">{item.hook}</p>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-gray-400">{item.reason}</p>
                </div>
                <div className="flex items-center justify-between gap-4 xl:w-44 xl:justify-end">
                  <div className="text-left xl:text-right">
                    <p className="text-xs text-gray-400">Цель</p>
                    <p className="mt-1 text-sm font-semibold">{item.goal}</p>
                  </div>
                  <Icon
                    path={mdiCalendarCheckOutline}
                    size="24"
                    className="text-gray-300"
                    w=""
                    h=""
                  />
                </div>
              </div>
            </CardBox>
          );
        })}
      </div>
    </SectionMain>
  );
}
