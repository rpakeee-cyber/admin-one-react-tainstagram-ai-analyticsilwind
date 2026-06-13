import { mdiEyeOutline, mdiPencilOutline, mdiTrashCanOutline } from "@mdi/js";
import Button from "../../../_components/Button";
import type { Reel } from "../../../../src/types";
import {
  calculateEngagementRate,
  calculateFollowerConversion,
  calculateReelScore,
  formatDate,
  formatNumber,
} from "../../../../src/utils/analytics";

type Props = {
  reels: Reel[];
  allReels?: Reel[];
  showActions?: boolean;
  onDelete?: (reel: Reel) => void;
};

export default function ReelsTable({
  reels,
  allReels = reels,
  showActions = false,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1180px]">
        <thead>
          <tr>
            <th>Ролик</th>
            <th>Дата</th>
            <th>Формат</th>
            <th>Просмотры</th>
            <th>Реакции</th>
            <th>ER</th>
            <th>Конверсия</th>
            <th>Score</th>
            {showActions && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {reels.map((reel) => (
            <tr key={reel.id}>
              <td data-label="Ролик">
                <div className="max-w-64 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">{reel.title}</p>
                  <p className="text-xs text-gray-400">{reel.topic}</p>
                </div>
              </td>
              <td data-label="Дата" className="whitespace-nowrap">
                {formatDate(reel.publishDate, { year: undefined })}
              </td>
              <td data-label="Формат" className="whitespace-nowrap">
                {reel.format}
              </td>
              <td data-label="Просмотры" className="font-semibold">
                {formatNumber(reel.views)}
              </td>
              <td data-label="Реакции">
                <span className="whitespace-nowrap">
                  {formatNumber(reel.likes)} / {formatNumber(reel.comments)} /{" "}
                  {formatNumber(reel.saves)} / {formatNumber(reel.shares)}
                </span>
              </td>
              <td data-label="ER">{calculateEngagementRate(reel).toFixed(1)}%</td>
              <td data-label="Конверсия">
                <span className="whitespace-nowrap">
                  +{formatNumber(reel.newFollowers)} ·{" "}
                  {calculateFollowerConversion(reel).toFixed(2)}%
                </span>
              </td>
              <td data-label="Score">
                <span className="inline-flex min-w-12 justify-center rounded-lg bg-fuchsia-50 px-2 py-1 font-bold text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
                  {calculateReelScore(reel, allReels).toFixed(1)}
                </span>
              </td>
              {showActions && (
                <td data-label="Действия">
                  <div className="flex items-center gap-1">
                    <Button
                      href={`/dashboard/reels/${reel.id}`}
                      icon={mdiEyeOutline}
                      ariaLabel={`Подробнее: ${reel.title}`}
                      color="whiteDark"
                      small
                      roundedFull
                    />
                    <Button
                      href={`/dashboard/reels/${reel.id}/edit`}
                      icon={mdiPencilOutline}
                      ariaLabel={`Редактировать: ${reel.title}`}
                      color="whiteDark"
                      small
                      roundedFull
                    />
                    <Button
                      icon={mdiTrashCanOutline}
                      ariaLabel={`Удалить: ${reel.title}`}
                      color="danger"
                      outline
                      small
                      roundedFull
                      onClick={() => onDelete?.(reel)}
                    />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
