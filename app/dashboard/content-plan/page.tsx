import {
  mdiCalendarCheckOutline,
  mdiCheckCircleOutline,
  mdiClockOutline,
  mdiLightbulbOutline,
  mdiPlus,
  mdiScriptTextOutline,
} from "@mdi/js";
import type { Metadata } from "next";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import Icon from "../../_components/Icon";
import SectionMain from "../../_components/Section/Main";
import { getPageTitle } from "../../_lib/config";
import { contentPlan } from "../../../src/data/demoData";
import type { ContentPlanItem } from "../../../src/types";
import { formatDate } from "../../../src/utils/analytics";
import PageIntro from "../_components/Analytics/PageIntro";

export const metadata: Metadata = {
  title: getPageTitle("Контент-план"),
};

const statusConfig: Record<
  ContentPlanItem["status"],
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
  return (
    <SectionMain>
      <PageIntro
        eyebrow="План публикаций"
        title="Контент-план"
        description="Темы, форматы и цели будущих Reels в одном простом рабочем пространстве."
        actions={<Button label="Новая идея" icon={mdiPlus} color="contrast" roundedFull />}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["На этой неделе", "3"],
          ["Готово к съёмке", "1"],
          ["В работе", "2"],
          ["Идей в запасе", "14"],
        ].map(([label, value]) => (
          <CardBox key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </CardBox>
        ))}
      </div>

      <div className="space-y-4">
        {contentPlan.map((item) => {
          const status = statusConfig[item.status];
          return (
            <CardBox key={item.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {formatDate(item.date, { month: "short" }).split(" ")[1]}
                  </span>
                  <span className="text-xl font-black">{new Date(item.date).getDate()}</span>
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
                    {item.topic} · {item.format}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 md:justify-end">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400">Цель</p>
                    <p className="mt-1 text-sm font-semibold">{item.objective}</p>
                  </div>
                  <Icon path={mdiCalendarCheckOutline} size="24" className="text-gray-300" w="" h="" />
                </div>
              </div>
            </CardBox>
          );
        })}
      </div>
    </SectionMain>
  );
}
