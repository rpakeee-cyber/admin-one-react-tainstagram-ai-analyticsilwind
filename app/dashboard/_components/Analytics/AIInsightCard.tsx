import { mdiArrowRight, mdiLightbulbOnOutline } from "@mdi/js";
import Icon from "../../../_components/Icon";
import type { AIInsight } from "../../../../src/types";

type Props = {
  insight: AIInsight;
  featured?: boolean;
};

const priorityLabel: Record<AIInsight["priority"], string> = {
  high: "Высокий приоритет",
  medium: "Средний приоритет",
  low: "Идея",
};

export default function AIInsightCard({ insight, featured = false }: Props) {
  if (featured) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 p-6 text-white shadow-xl shadow-fuchsia-500/15 sm:p-8">
        <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-indigo-300/20 blur-2xl" />
        <div className="relative">
          <div className="mb-5 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <Icon path={mdiLightbulbOnOutline} size="16" w="" h="" />
              AI Insight недели
            </span>
            <span className="text-xs font-medium text-white/70">Demo analysis</span>
          </div>
          <h2 className="max-w-2xl text-2xl font-bold sm:text-3xl">{insight.title}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-white/80">{insight.summary}</p>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-black/10 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium">{insight.recommendation}</p>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold">
              {insight.impact}
              <Icon path={mdiArrowRight} size="18" w="" h="" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
          <Icon path={mdiLightbulbOnOutline} size="20" w="" h="" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white">{insight.title}</h3>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-gray-500 uppercase dark:bg-slate-800 dark:text-slate-400">
              {priorityLabel[insight.priority]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">{insight.summary}</p>
          <p className="mt-4 text-sm font-medium text-gray-800 dark:text-slate-200">
            {insight.recommendation}
          </p>
          <p className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Потенциал: {insight.impact}
          </p>
        </div>
      </div>
    </div>
  );
}
