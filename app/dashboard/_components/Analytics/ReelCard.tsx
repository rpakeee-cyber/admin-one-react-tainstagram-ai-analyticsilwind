import {
  mdiBookmarkOutline,
  mdiCommentOutline,
  mdiEyeOutline,
  mdiHeartOutline,
  mdiPencilOutline,
  mdiShareVariantOutline,
  mdiTrashCanOutline,
} from "@mdi/js";
import Button from "../../../_components/Button";
import Icon from "../../../_components/Icon";
import type { Reel } from "../../../../src/types";
import {
  calculateEngagementRate,
  calculateFollowerConversion,
  calculateReelScore,
  formatDate,
  formatNumber,
} from "../../../../src/utils/analytics";

type Props = {
  reel: Reel;
  allReels: Reel[];
  compact?: boolean;
  showActions?: boolean;
  onDelete?: (reel: Reel) => void;
};

const accents = [
  "from-fuchsia-500 via-pink-500 to-orange-400",
  "from-violet-600 via-indigo-500 to-cyan-400",
  "from-sky-500 via-blue-500 to-indigo-600",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-rose-500 via-red-500 to-amber-400",
];

const getAccent = (reel: Reel) =>
  accents[
    Math.abs(reel.id.split("").reduce((total, char) => total + char.charCodeAt(0), 0)) %
      accents.length
  ];

export default function ReelCard({
  reel,
  allReels,
  compact = false,
  showActions = false,
  onDelete,
}: Props) {
  const score = calculateReelScore(reel, allReels);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
      <div
        className={`relative flex ${compact ? "h-28" : "h-36"} items-end bg-linear-to-br ${getAccent(reel)} p-4`}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/55 to-black/5" />
        <div className="relative">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-gray-800">
            {reel.topic}
          </span>
          <p className="mt-2 text-xs font-medium text-white/80">
            {reel.format} · {reel.durationSeconds || "—"} сек.
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 font-bold text-gray-900 dark:text-white">{reel.title}</h3>
            <p className="mt-1 text-xs text-gray-400">{formatDate(reel.publishDate)}</p>
          </div>
          <span className="shrink-0 rounded-xl bg-fuchsia-50 px-2.5 py-1.5 text-sm font-bold text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
            {score.toFixed(1)}
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
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-slate-800">
          <span className="text-gray-400">Подписки</span>
          <span className="font-semibold text-emerald-600">
            +{formatNumber(reel.newFollowers)} · {calculateFollowerConversion(reel).toFixed(2)}%
          </span>
        </div>
        {showActions && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button
              href={`/dashboard/reels/${reel.id}`}
              label="Подробнее"
              color="contrast"
              small
              roundedFull
            />
            <Button
              href={`/dashboard/reels/${reel.id}/edit`}
              icon={mdiPencilOutline}
              ariaLabel={`Редактировать ${reel.title}`}
              color="whiteDark"
              small
              roundedFull
            />
            <Button
              icon={mdiTrashCanOutline}
              ariaLabel={`Удалить ${reel.title}`}
              color="danger"
              outline
              small
              roundedFull
              onClick={() => onDelete?.(reel)}
            />
          </div>
        )}
      </div>
    </article>
  );
}
