import {
  mdiBookmarkOutline,
  mdiCommentOutline,
  mdiEyeOutline,
  mdiHeartOutline,
  mdiPlay,
  mdiShareVariantOutline,
} from "@mdi/js";
import Icon from "../../../_components/Icon";
import type { Reel } from "../../../../src/types";
import {
  calculateEngagementRate,
  formatDate,
  formatNumber,
} from "../../../../src/utils/analytics";

type Props = {
  reel: Reel;
  compact?: boolean;
};

export default function ReelCard({ reel, compact = false }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
      <div
        className={`relative flex ${compact ? "h-36" : "h-48"} items-center justify-center bg-linear-to-br ${reel.accent}`}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-xl">
          <Icon path={mdiPlay} size="24" w="" h="" />
        </div>
        <span className="absolute right-3 bottom-3 rounded-full bg-black/35 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
          {reel.duration} сек
        </span>
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-gray-800">
          {reel.topic}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 font-bold text-gray-900 dark:text-white">{reel.title}</h3>
            <p className="mt-1 text-xs text-gray-400">{formatDate(reel.publishedAt)}</p>
          </div>
          <span
            className={`shrink-0 rounded-xl px-2.5 py-1.5 text-sm font-bold ${
              reel.score >= 90
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300"
            }`}
          >
            {reel.score}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Icon path={mdiEyeOutline} size="15" w="" h="" />
            {formatNumber(reel.views)}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon path={mdiHeartOutline} size="15" w="" h="" />
            {formatNumber(reel.likes)}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon path={mdiCommentOutline} size="15" w="" h="" />
            {formatNumber(reel.comments)}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon path={mdiBookmarkOutline} size="15" w="" h="" />
            {formatNumber(reel.saves)}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon path={mdiShareVariantOutline} size="15" w="" h="" />
            {formatNumber(reel.shares)}
          </span>
          <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">
            ER {calculateEngagementRate(reel).toFixed(1)}%
          </span>
        </div>
      </div>
    </article>
  );
}
