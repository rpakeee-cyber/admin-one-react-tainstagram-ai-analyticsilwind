import Icon from "../../../_components/Icon";
import type { Metric } from "../../../../src/types";
import { formatNumber } from "../../../../src/utils/analytics";

type Props = {
  metric: Metric;
  icon: string;
  accent?: string;
};

const formatMetricValue = (metric: Metric) => {
  if (metric.format === "percent") {
    return `${metric.value.toFixed(1)}%`;
  }

  if (metric.format === "score") {
    return metric.value.toFixed(1);
  }

  return formatNumber(metric.value);
};

export default function MetricCard({
  metric,
  icon,
  accent = "from-fuchsia-500 to-violet-600",
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
      <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{metric.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {formatMetricValue(metric)}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${accent} text-white shadow-lg shadow-fuchsia-500/10`}
        >
          <Icon path={icon} size="22" w="" h="" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={`rounded-full px-2 py-1 font-semibold ${
            metric.direction === "down"
              ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
          }`}
        >
          {metric.change > 0 ? "+" : ""}
          {metric.change}%
        </span>
        <span className="text-gray-400 dark:text-slate-500">к прошлому периоду</span>
      </div>
    </div>
  );
}
