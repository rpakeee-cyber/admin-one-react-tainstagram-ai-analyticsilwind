"use client";

import { mdiCheckCircleOutline, mdiFilterVariant, mdiMagnify, mdiPlus } from "@mdi/js";
import { useEffect, useMemo, useState } from "react";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import Icon from "../../_components/Icon";
import SectionMain from "../../_components/Section/Main";
import { useReels } from "../../../src/hooks/useReels";
import { consumeReelsNotice, deleteReel } from "../../../src/services/reelsStorage";
import { reelFormats, reelTopics, type Reel } from "../../../src/types";
import {
  calculateAverageEngagement,
  calculateAverageScore,
  calculateEngagementRate,
  calculateReelScore,
  formatNumber,
  getReelTotals,
} from "../../../src/utils/analytics";
import PageIntro from "../_components/Analytics/PageIntro";
import ReelCard from "../_components/Analytics/ReelCard";
import ReelsTable from "../_components/Analytics/ReelsTable";
import DeleteReelModal from "../_components/Reels/DeleteReelModal";
import EmptyReelsState from "../_components/Reels/EmptyReelsState";

type SortValue = "newest" | "oldest" | "views" | "engagement" | "followers" | "score";

export default function ReelsPage() {
  const { reels, isReady } = useReels();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [format, setFormat] = useState("all");
  const [sort, setSort] = useState<SortValue>("newest");
  const [deleteTarget, setDeleteTarget] = useState<Reel | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const storedNotice = consumeReelsNotice();
    if (storedNotice) {
      setNotice(storedNotice);
    }
  }, []);

  const filteredReels = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");
    const result = reels.filter((reel) => {
      const matchesQuery =
        !normalizedQuery ||
        [reel.title, reel.notes, reel.hook].some((value) =>
          value.toLocaleLowerCase("ru-RU").includes(normalizedQuery),
        );
      const matchesTopic = topic === "all" || reel.topic === topic;
      const matchesFormat = format === "all" || reel.format === format;
      return matchesQuery && matchesTopic && matchesFormat;
    });

    return [...result].sort((a, b) => {
      if (sort === "oldest") {
        return a.publishDate.localeCompare(b.publishDate);
      }
      if (sort === "views") {
        return b.views - a.views;
      }
      if (sort === "engagement") {
        return calculateEngagementRate(b) - calculateEngagementRate(a);
      }
      if (sort === "followers") {
        return b.newFollowers - a.newFollowers;
      }
      if (sort === "score") {
        return calculateReelScore(b, reels) - calculateReelScore(a, reels);
      }
      return b.publishDate.localeCompare(a.publishDate);
    });
  }, [format, query, reels, sort, topic]);

  const totals = getReelTotals(reels);

  const handleDelete = (reel: Reel) => {
    deleteReel(reel.id);
    setDeleteTarget(null);
    setNotice(`Reel «${reel.title}» удалён.`);
  };

  return (
    <SectionMain>
      <DeleteReelModal
        reel={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <PageIntro
        eyebrow="Библиотека контента"
        title="Reels"
        description="Ищите, сравнивайте и управляйте роликами. До первого сохранения здесь показываются demo data."
        actions={
          <Button
            href="/dashboard/add-reel"
            label="Добавить Reel"
            icon={mdiPlus}
            color="contrast"
            roundedFull
          />
        }
      />

      {notice && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Icon path={mdiCheckCircleOutline} size="22" w="" h="" />
          <p className="font-medium">{notice}</p>
        </div>
      )}

      {!isReady ? (
        <div className="h-48 animate-pulse rounded-3xl bg-white dark:bg-slate-900/70" />
      ) : reels.length === 0 ? (
        <EmptyReelsState />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/70">
              <p className="text-xs text-gray-400">Просмотры</p>
              <p className="mt-1 text-lg font-bold">{formatNumber(totals.views)}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/70">
              <p className="text-xs text-gray-400">Средний ER</p>
              <p className="mt-1 text-lg font-bold">
                {calculateAverageEngagement(reels).toFixed(1)}%
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/70">
              <p className="text-xs text-gray-400">Средний score</p>
              <p className="mt-1 text-lg font-bold">{calculateAverageScore(reels).toFixed(1)}</p>
            </div>
          </div>

          <CardBox className="mb-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
              <label className="relative">
                <span className="sr-only">Поиск</span>
                <Icon
                  path={mdiMagnify}
                  size="20"
                  w=""
                  h=""
                  className="pointer-events-none absolute top-3.5 left-4 text-gray-400"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Название, заметки или hook"
                  className="h-12 w-full rounded-xl border-gray-200 pl-11 dark:border-slate-700 dark:bg-slate-800"
                />
              </label>
              <label className="relative">
                <span className="sr-only">Тема</span>
                <select
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="h-12 w-full rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="all">Все темы</option>
                  {reelTopics.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Формат</span>
                <select
                  value={format}
                  onChange={(event) => setFormat(event.target.value)}
                  className="h-12 w-full rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="all">Все форматы</option>
                  {reelFormats.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="relative">
                <span className="sr-only">Сортировка</span>
                <Icon
                  path={mdiFilterVariant}
                  size="18"
                  w=""
                  h=""
                  className="pointer-events-none absolute top-4 left-4 text-gray-400"
                />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortValue)}
                  className="h-12 w-full rounded-xl border-gray-200 pl-10 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="newest">Новые сначала</option>
                  <option value="oldest">Старые сначала</option>
                  <option value="views">Больше просмотров</option>
                  <option value="engagement">Больше engagement rate</option>
                  <option value="followers">Больше новых подписчиков</option>
                  <option value="score">Лучший score</option>
                </select>
              </label>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Найдено: {filteredReels.length} из {reels.length}
            </p>
          </CardBox>

          {filteredReels.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-gray-500 dark:bg-slate-900/70">
              По выбранным условиям ничего не найдено.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden">
                {filteredReels.map((reel) => (
                  <ReelCard
                    key={reel.id}
                    reel={reel}
                    allReels={reels}
                    showActions
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>

              <CardBox className="hidden lg:flex" hasTable>
                <ReelsTable
                  reels={filteredReels}
                  allReels={reels}
                  showActions
                  onDelete={setDeleteTarget}
                />
              </CardBox>
            </>
          )}
        </>
      )}
    </SectionMain>
  );
}
