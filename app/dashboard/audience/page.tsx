import {
  mdiAccountGroupOutline,
  mdiAccountMultiplePlusOutline,
  mdiClockOutline,
  mdiMapMarkerOutline,
} from "@mdi/js";
import type { Metadata } from "next";
import CardBox from "../../_components/CardBox";
import Icon from "../../_components/Icon";
import SectionMain from "../../_components/Section/Main";
import { getPageTitle } from "../../_lib/config";
import { audienceData } from "../../../src/data/demoData";
import { formatNumber } from "../../../src/utils/analytics";
import PageIntro from "../_components/Analytics/PageIntro";

export const metadata: Metadata = {
  title: getPageTitle("Аудитория"),
};

const SegmentList = ({
  items,
  accent = "bg-fuchsia-500",
}: {
  items: { label: string; value: number }[];
  accent?: string;
}) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.label}>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">{item.label}</span>
          <span className="text-gray-400">{item.value}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
          <div className={`h-full rounded-full ${accent}`} style={{ width: `${item.value}%` }} />
        </div>
      </div>
    ))}
  </div>
);

export default function AudiencePage() {
  return (
    <SectionMain>
      <PageIntro
        eyebrow="Audience snapshot"
        title="Аудитория"
        description="Кто смотрит ваш контент, где живут подписчики и когда они активнее всего."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        {[
          {
            icon: mdiAccountGroupOutline,
            label: "Подписчики",
            value: formatNumber(audienceData.totalFollowers),
          },
          {
            icon: mdiAccountMultiplePlusOutline,
            label: "Рост за 30 дней",
            value: `+${audienceData.followerGrowth}%`,
          },
          { icon: mdiMapMarkerOutline, label: "Главный город", value: audienceData.topCities[0].label },
          { icon: mdiClockOutline, label: "Пик активности", value: "21:00" },
        ].map((item) => (
          <CardBox key={item.label}>
            <Icon path={item.icon} size="24" className="text-fuchsia-600" w="" h="" />
            <p className="mt-4 text-xs text-gray-400">{item.label}</p>
            <p className="mt-1 text-xl font-bold">{item.value}</p>
          </CardBox>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardBox>
          <h2 className="mb-5 text-lg font-bold">Возраст</h2>
          <SegmentList items={audienceData.ageGroups} />
        </CardBox>
        <CardBox>
          <h2 className="mb-5 text-lg font-bold">География</h2>
          <SegmentList items={audienceData.topCities} accent="bg-violet-500" />
        </CardBox>
        <CardBox>
          <h2 className="mb-5 text-lg font-bold">Пол</h2>
          <SegmentList items={audienceData.gender} accent="bg-pink-500" />
        </CardBox>
        <CardBox>
          <h2 className="mb-2 text-lg font-bold">Активность в течение дня</h2>
          <p className="mb-6 text-sm text-gray-400">Доля активной аудитории по времени</p>
          <div className="flex h-52 items-end justify-between gap-3">
            {audienceData.activeHours.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">{item.value}%</span>
                <div
                  className="w-full max-w-12 rounded-t-xl bg-linear-to-t from-violet-600 to-fuchsia-400"
                  style={{ height: `${item.value * 1.35}px` }}
                />
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        </CardBox>
      </div>
    </SectionMain>
  );
}
