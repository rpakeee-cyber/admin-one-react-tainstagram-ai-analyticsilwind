"use client";

import {
  mdiArrowRight,
  mdiFlaskOutline,
  mdiFormatQuoteOpen,
  mdiLightbulbOnOutline,
  mdiPauseCircleOutline,
  mdiRepeat,
} from "@mdi/js";
import CardBox from "../../_components/CardBox";
import Icon from "../../_components/Icon";
import SectionMain from "../../_components/Section/Main";
import { useReels } from "../../../src/hooks/useReels";
import {
  generateContentIdeas,
  generateDashboardInsight,
  generateWeeklyRecommendations,
} from "../../../src/services/aiRecommendationEngine";
import {
  analyzeFormats,
  analyzeHooks,
  analyzeTopics,
  formatNumber,
} from "../../../src/utils/analytics";
import AIInsightCard from "../_components/Analytics/AIInsightCard";
import DataConfidenceNotice from "../_components/Analytics/DataConfidenceNotice";
import PageIntro from "../_components/Analytics/PageIntro";
import RecommendationBadge from "../_components/Analytics/RecommendationBadge";

export default function AIRecommendationsPage() {
  const { reels, isReady } = useReels();

  if (!isReady) {
    return (
      <SectionMain>
        <div className="h-80 animate-pulse rounded-3xl bg-white dark:bg-slate-900/70" />
      </SectionMain>
    );
  }

  const insight = generateDashboardInsight(reels);
  const ideas = generateContentIdeas(reels);
  const weekly = generateWeeklyRecommendations(reels);
  const topics = analyzeTopics(reels);
  const formats = analyzeFormats(reels);
  const hooks = analyzeHooks(reels);
  const repeatTopics = topics.filter((item) => item.status !== "weak").slice(0, 3);
  const repeatFormats = formats.filter((item) => item.status !== "weak").slice(0, 3);
  const pauseTopics = topics.filter((item) => item.status === "weak").slice(0, 3);
  const pauseFormats = formats.filter((item) => item.status === "weak").slice(0, 3);

  return (
    <SectionMain>
      <PageIntro
        eyebrow="Локальный smart engine"
        title="AI-рекомендации"
        description="Практические идеи строятся по темам, форматам, hook, вовлечённости и конверсии твоих сохранённых Reels."
      />

      <DataConfidenceNotice reelsCount={reels.length} />

      <div className="mb-8">
        <AIInsightCard insight={insight} featured />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Icon path={mdiLightbulbOnOutline} size="24" className="text-fuchsia-600" w="" h="" />
        <div>
          <h2 className="text-xl font-bold">Что снять дальше</h2>
          <p className="text-sm text-gray-400">10 идей с готовым углом и первой фразой</p>
        </div>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {ideas.map((idea, index) => (
          <CardBox key={idea.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-[0.14em] text-fuchsia-600 uppercase">
                  Идея {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-bold">{idea.title}</h3>
              </div>
              <RecommendationBadge tone={index < 3 ? "repeat" : "test"} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
              <span className="rounded-full bg-gray-100 px-3 py-1.5 dark:bg-slate-800">
                {idea.topic}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1.5 dark:bg-slate-800">
                {idea.format}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1.5 dark:bg-slate-800">
                Цель: {idea.goal}
              </span>
            </div>
            <div className="mt-4 rounded-2xl bg-violet-50 p-4 dark:bg-violet-500/10">
              <p className="text-xs font-bold tracking-wide text-violet-700 uppercase dark:text-violet-300">
                Hook
              </p>
              <p className="mt-2 text-sm leading-6">{idea.hook}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-slate-400">
              {idea.reason}
            </p>
          </CardBox>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CardBox>
          <div className="flex items-center gap-3">
            <Icon path={mdiRepeat} size="24" className="text-emerald-600" w="" h="" />
            <div>
              <h2 className="text-lg font-bold">Что повторить</h2>
              <p className="text-sm text-gray-400">Сильные темы и форматы</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[...repeatTopics, ...repeatFormats].map((item) => {
              const isTopic = "topic" in item;
              const label = isTopic ? item.topic : item.format;
              const detail = isTopic
                ? `${formatNumber(item.averageViews)} просмотров · ER ${item.averageEngagementRate.toFixed(1)}%`
                : `Score ${item.averageScore.toFixed(1)} · ${item.averageFollowerConversion.toFixed(2)}% в подписку`;

              return (
                <div
                  key={`${isTopic ? "topic" : "format"}-${label}`}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-slate-800/70"
                >
                  <div>
                    <p className="font-bold">{label}</p>
                    <p className="mt-1 text-xs text-gray-400">{detail}</p>
                  </div>
                  <RecommendationBadge tone="repeat" />
                </div>
              );
            })}
            {repeatTopics.length + repeatFormats.length === 0 && (
              <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-slate-800/70">
                Добавь несколько Reels, чтобы выделить повторяемые направления.
              </p>
            )}
          </div>
        </CardBox>

        <CardBox>
          <div className="flex items-center gap-3">
            <Icon path={mdiPauseCircleOutline} size="24" className="text-amber-600" w="" h="" />
            <div>
              <h2 className="text-lg font-bold">Что поставить на паузу</h2>
              <p className="text-sm text-gray-400">Только сигналы с заметно слабым результатом</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[...pauseTopics, ...pauseFormats].map((item, index) => {
              const isTopic = "topic" in item;
              const label = isTopic ? item.topic : item.format;

              return (
                <div
                  key={`${isTopic ? "topic" : "format"}-${label}`}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-500/10"
                >
                  <div>
                    <p className="font-bold">{label}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                      {weekly.pauseItems[index]}
                    </p>
                  </div>
                  <RecommendationBadge tone="pause" />
                </div>
              );
            })}
            {pauseTopics.length + pauseFormats.length === 0 && (
              <p className="rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-500 dark:bg-slate-800/70">
                {weekly.pauseItems[0]}
              </p>
            )}
          </div>
        </CardBox>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CardBox>
          <div className="flex items-center gap-3">
            <Icon path={mdiFormatQuoteOpen} size="24" className="text-violet-600" w="" h="" />
            <h2 className="text-lg font-bold">Hooks для следующей недели</h2>
          </div>
          <div className="mt-5 space-y-3">
            {weekly.hooks.map((hook, index) => (
              <div
                key={hook}
                className="flex gap-3 rounded-2xl bg-violet-50 p-4 dark:bg-violet-500/10"
              >
                <span className="font-black text-violet-600">{index + 1}</span>
                <p className="text-sm leading-6">{hook}</p>
              </div>
            ))}
          </div>
          {hooks.topHooks.length > 0 && (
            <p className="mt-4 text-xs text-gray-400">
              Лучший сохранённый hook: «{hooks.topHooks[0].hook}»
            </p>
          )}
        </CardBox>

        <CardBox>
          <div className="flex items-center gap-3">
            <Icon path={mdiFlaskOutline} size="24" className="text-cyan-600" w="" h="" />
            <h2 className="text-lg font-bold">Форматы для теста</h2>
          </div>
          <div className="mt-5 space-y-3">
            {weekly.formatsToTest.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-cyan-50 p-4 dark:bg-cyan-500/10"
              >
                <Icon path={mdiArrowRight} size="18" className="text-cyan-600" w="" h="" />
                <p className="text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </CardBox>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">План на 7 дней</h2>
        <p className="mt-1 text-sm text-gray-400">{weekly.summary}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {weekly.schedule.map((item) => (
          <CardBox key={item.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-wide text-fuchsia-600 uppercase">
                {item.day}
              </p>
              <RecommendationBadge tone="test" label={item.goal} />
            </div>
            <h3 className="mt-3 font-bold">{item.title}</h3>
            <p className="mt-2 text-xs text-gray-400">
              {item.topic} · {item.format}
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-slate-300">{item.hook}</p>
          </CardBox>
        ))}
      </div>
    </SectionMain>
  );
}
