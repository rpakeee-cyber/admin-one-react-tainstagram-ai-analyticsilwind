"use client";

import {
  mdiArrowLeft,
  mdiBookmarkOutline,
  mdiChartLine,
  mdiCommentOutline,
  mdiEyeOutline,
  mdiHeartOutline,
  mdiLinkVariant,
  mdiPencilOutline,
  mdiShareVariantOutline,
  mdiTrashCanOutline,
} from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import Icon from "../../../_components/Icon";
import SectionMain from "../../../_components/Section/Main";
import { useReels } from "../../../../src/hooks/useReels";
import { generateReelInsight } from "../../../../src/services/aiRecommendationEngine";
import { deleteReel, setReelsNotice } from "../../../../src/services/reelsStorage";
import type { Reel } from "../../../../src/types";
import {
  calculateCommentRate,
  calculateEngagementRate,
  calculateFollowerConversion,
  calculateReelScore,
  calculateSaveRate,
  calculateShareRate,
  formatDate,
  formatNumber,
} from "../../../../src/utils/analytics";
import PageIntro from "../../_components/Analytics/PageIntro";
import RecommendationBadge from "../../_components/Analytics/RecommendationBadge";
import DeleteReelModal from "../../_components/Reels/DeleteReelModal";

const metricIcons = [
  mdiEyeOutline,
  mdiHeartOutline,
  mdiCommentOutline,
  mdiBookmarkOutline,
  mdiShareVariantOutline,
  mdiChartLine,
];

export default function ReelDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { reels, isReady } = useReels();
  const [deleteTarget, setDeleteTarget] = useState<Reel | null>(null);
  const reel = reels.find((item) => item.id === params.id);

  if (!isReady) {
    return (
      <SectionMain>
        <div className="h-80 animate-pulse rounded-3xl bg-white dark:bg-slate-900/70" />
      </SectionMain>
    );
  }

  if (!reel) {
    return (
      <SectionMain>
        <div className="rounded-3xl bg-white p-10 text-center dark:bg-slate-900/70">
          <h1 className="text-2xl font-bold">Reel не найден</h1>
          <Button
            href="/dashboard/reels"
            label="Назад к Reels"
            icon={mdiArrowLeft}
            color="contrast"
            roundedFull
            className="mt-6"
          />
        </div>
      </SectionMain>
    );
  }

  const score = calculateReelScore(reel, reels);
  const insight = generateReelInsight(reel, reels);
  const metrics = [
    ["Просмотры", formatNumber(reel.views)],
    ["Лайки", formatNumber(reel.likes)],
    ["Комментарии", `${formatNumber(reel.comments)} · ${calculateCommentRate(reel).toFixed(2)}%`],
    ["Сохранения", `${formatNumber(reel.saves)} · ${calculateSaveRate(reel).toFixed(2)}%`],
    ["Репосты", `${formatNumber(reel.shares)} · ${calculateShareRate(reel).toFixed(2)}%`],
    ["Новые подписчики", `+${formatNumber(reel.newFollowers)}`],
  ];

  const handleDelete = () => {
    deleteReel(reel.id);
    setReelsNotice(`Reel «${reel.title}» удалён.`);
    router.push("/dashboard/reels");
  };

  return (
    <SectionMain>
      <DeleteReelModal
        reel={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <PageIntro
        eyebrow={`${reel.topic} · ${reel.format}`}
        title={reel.title}
        description={`Опубликован ${formatDate(reel.publishDate)} · обновлён ${new Intl.DateTimeFormat("ru-RU").format(new Date(reel.updatedAt))}`}
        actions={
          <>
            <Button
              href="/dashboard/reels"
              icon={mdiArrowLeft}
              ariaLabel="Назад к Reels"
              color="whiteDark"
              roundedFull
            />
            <Button
              href={`/dashboard/reels/${reel.id}/edit`}
              label="Редактировать"
              icon={mdiPencilOutline}
              color="contrast"
              roundedFull
            />
            <Button
              icon={mdiTrashCanOutline}
              ariaLabel={`Удалить ${reel.title}`}
              color="danger"
              outline
              roundedFull
              onClick={() => setDeleteTarget(reel)}
            />
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <CardBox>
          <p className="text-sm text-gray-400">Score</p>
          <p className="mt-2 text-3xl font-bold text-fuchsia-600">{score.toFixed(1)}</p>
          <p className="mt-1 text-xs text-gray-400">из 10</p>
        </CardBox>
        <CardBox>
          <p className="text-sm text-gray-400">Engagement rate</p>
          <p className="mt-2 text-3xl font-bold">{calculateEngagementRate(reel).toFixed(1)}%</p>
          <p className="mt-1 text-xs text-gray-400">от охвата или просмотров</p>
        </CardBox>
        <CardBox>
          <p className="text-sm text-gray-400">Follower conversion</p>
          <p className="mt-2 text-3xl font-bold">{calculateFollowerConversion(reel).toFixed(2)}%</p>
          <p className="mt-1 text-xs text-gray-400">подписки / просмотры</p>
        </CardBox>
        <CardBox>
          <p className="text-sm text-gray-400">Удержание</p>
          <p className="mt-2 text-3xl font-bold">{reel.retentionRate || 0}%</p>
          <p className="mt-1 text-xs text-gray-400">{reel.durationSeconds || 0} секунд</p>
        </CardBox>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {metrics.map(([label, value], index) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/70"
          >
            <Icon path={metricIcons[index]} size="19" w="" h="" className="text-fuchsia-600" />
            <p className="mt-3 text-xs text-gray-400">{label}</p>
            <p className="mt-1 font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <CardBox>
            <h2 className="text-lg font-bold">Содержание Reel</h2>
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Hook</p>
                <p className="mt-2 leading-7">{reel.hook || "Не указан"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  Заметки
                </p>
                <p className="mt-2 leading-7 whitespace-pre-wrap">
                  {reel.notes || "Заметок пока нет"}
                </p>
              </div>
              {reel.link && (
                <a
                  href={reel.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-fuchsia-600"
                >
                  <Icon path={mdiLinkVariant} size="19" w="" h="" />
                  Открыть Reel в Instagram
                </a>
              )}
            </div>
          </CardBox>
          <CardBox>
            <h2 className="text-lg font-bold">Исходные данные</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-400">Охват</dt>
                <dd className="mt-1 font-semibold">{formatNumber(reel.reach || reel.views)}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Создано</dt>
                <dd className="mt-1 font-semibold">
                  {new Intl.DateTimeFormat("ru-RU").format(new Date(reel.createdAt))}
                </dd>
              </div>
            </dl>
          </CardBox>
        </div>

        <CardBox>
          <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-600 uppercase">
            AI-разбор ролика
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Что можно вынести из ролика</h2>
            <RecommendationBadge
              tone={insight.score >= 7 ? "strong" : insight.score < 5 ? "weak" : "medium"}
              label={`Score ${insight.score.toFixed(1)}`}
            />
          </div>
          <div className="mt-6 space-y-4">
            {[
              ["Сильная сторона", insight.strength, "bg-emerald-50 dark:bg-emerald-500/10"],
              ["Слабая сторона", insight.weakness, "bg-rose-50 dark:bg-rose-500/10"],
              ["Почему сработало", insight.whyWorked, "bg-blue-50 dark:bg-blue-500/10"],
              [
                "Конверсия в подписку",
                insight.whyLowConversion,
                "bg-amber-50 dark:bg-amber-500/10",
              ],
              ["Повторять тему?", insight.repeatTopic, "bg-violet-50 dark:bg-violet-500/10"],
              ["Что улучшить", insight.improveNext, "bg-cyan-50 dark:bg-cyan-500/10"],
            ].map(([label, value, className]) => (
              <div key={label} className={`rounded-2xl p-4 ${className}`}>
                <p className="text-xs font-bold tracking-wide uppercase">{label}</p>
                <p className="mt-2 text-sm leading-6">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
              Три варианта hook
            </p>
            <div className="mt-3 space-y-3">
              {insight.hookSuggestions.map((hook, index) => (
                <div
                  key={hook}
                  className="flex gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-slate-800/70"
                >
                  <span className="font-black text-fuchsia-600">{index + 1}</span>
                  <p className="text-sm leading-6">{hook}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 p-5 text-white">
            <p className="text-xs font-bold tracking-wide text-white/70 uppercase">
              Идея продолжения
            </p>
            <p className="mt-2 font-bold">{insight.continuationIdea}</p>
          </div>
        </CardBox>
      </div>
    </SectionMain>
  );
}
