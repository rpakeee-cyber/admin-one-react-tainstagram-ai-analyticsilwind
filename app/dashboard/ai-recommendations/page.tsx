import {
  mdiBullseyeArrow,
  mdiCreationOutline,
  mdiRobotOutline,
  mdiTrendingUp,
} from "@mdi/js";
import type { Metadata } from "next";
import CardBox from "../../_components/CardBox";
import Icon from "../../_components/Icon";
import SectionMain from "../../_components/Section/Main";
import { getPageTitle } from "../../_lib/config";
import { aiInsights } from "../../../src/data/demoData";
import AIInsightCard from "../_components/Analytics/AIInsightCard";
import PageIntro from "../_components/Analytics/PageIntro";

export const metadata: Metadata = {
  title: getPageTitle("AI-рекомендации"),
};

export default function AIRecommendationsPage() {
  return (
    <SectionMain>
      <PageIntro
        eyebrow="AI Copilot · Demo"
        title="AI-рекомендации"
        description="Гипотезы сформированы на демонстрационных метриках. Реальная модель и генерация контента пока не подключены."
      />

      <div className="mb-6">
        <AIInsightCard insight={aiInsights[0]} featured />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            icon: mdiTrendingUp,
            label: "Потенциал роста",
            value: "+24%",
            copy: "при внедрении 3 главных рекомендаций",
          },
          {
            icon: mdiBullseyeArrow,
            label: "Главный фокус",
            value: "Hook",
            copy: "первая секунда сильнее всего влияет на результат",
          },
          {
            icon: mdiCreationOutline,
            label: "Следующая тема",
            value: "Обложки",
            copy: "логичное продолжение лучшей серии",
          },
        ].map((item) => (
          <CardBox key={item.label}>
            <Icon path={item.icon} size="26" className="text-fuchsia-600" w="" h="" />
            <p className="mt-4 text-sm text-gray-400">{item.label}</p>
            <p className="mt-1 text-2xl font-bold">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">{item.copy}</p>
          </CardBox>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Icon path={mdiRobotOutline} size="24" className="text-fuchsia-600" w="" h="" />
        <h2 className="text-xl font-bold">Все рекомендации</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {aiInsights.slice(1).map((insight) => (
          <AIInsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </SectionMain>
  );
}
