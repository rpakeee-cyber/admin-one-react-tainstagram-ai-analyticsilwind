import { mdiPlus } from "@mdi/js";
import type { Metadata } from "next";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import SectionMain from "../../_components/Section/Main";
import { getPageTitle } from "../../_lib/config";
import { reels } from "../../../src/data/demoData";
import { calculateAverageScore, getReelTotals, getTopTopic } from "../../../src/utils/analytics";
import PageIntro from "../_components/Analytics/PageIntro";
import ReelCard from "../_components/Analytics/ReelCard";
import ReelsTable from "../_components/Analytics/ReelsTable";

export const metadata: Metadata = {
  title: getPageTitle("Reels"),
};

export default function ReelsPage() {
  const totals = getReelTotals(reels);

  return (
    <SectionMain>
      <PageIntro
        eyebrow="Библиотека контента"
        title="Reels"
        description="Сравнивайте темы, вовлечённость, рост аудитории и общую оценку каждого ролика."
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

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/70">
          <p className="text-xs text-gray-400">Всего просмотров</p>
          <p className="mt-1 text-lg font-bold">{new Intl.NumberFormat("ru-RU").format(totals.views)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/70">
          <p className="text-xs text-gray-400">Топ-тема</p>
          <p className="mt-1 text-lg font-bold">{getTopTopic(reels)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/70">
          <p className="text-xs text-gray-400">Средняя оценка</p>
          <p className="mt-1 text-lg font-bold">{calculateAverageScore(reels).toFixed(1)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>

      <div className="mt-8 hidden lg:block">
        <h2 className="mb-4 text-xl font-bold">Сравнение показателей</h2>
        <CardBox hasTable>
          <ReelsTable reels={reels} />
        </CardBox>
      </div>
    </SectionMain>
  );
}
