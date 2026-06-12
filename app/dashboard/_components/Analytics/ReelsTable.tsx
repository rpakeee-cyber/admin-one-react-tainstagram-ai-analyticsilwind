import type { Reel } from "../../../../src/types";
import {
  calculateEngagementRate,
  formatDate,
  formatNumber,
} from "../../../../src/utils/analytics";

type Props = {
  reels: Reel[];
};

export default function ReelsTable({ reels }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Ролик</th>
            <th>Дата</th>
            <th>Просмотры</th>
            <th>ER</th>
            <th>Подписчики</th>
            <th>Оценка</th>
          </tr>
        </thead>
        <tbody>
          {reels.map((reel) => (
            <tr key={reel.id}>
              <td data-label="Ролик">
                <div className="flex items-center gap-3 text-left">
                  <div className={`h-10 w-10 shrink-0 rounded-xl bg-linear-to-br ${reel.accent}`} />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{reel.title}</p>
                    <p className="text-xs text-gray-400">{reel.topic}</p>
                  </div>
                </div>
              </td>
              <td data-label="Дата" className="whitespace-nowrap">
                {formatDate(reel.publishedAt)}
              </td>
              <td data-label="Просмотры" className="font-semibold">
                {formatNumber(reel.views)}
              </td>
              <td data-label="ER">{calculateEngagementRate(reel).toFixed(1)}%</td>
              <td data-label="Подписчики">+{formatNumber(reel.newFollowers)}</td>
              <td data-label="Оценка">
                <span
                  className={`inline-flex min-w-10 justify-center rounded-lg px-2 py-1 font-bold ${
                    reel.score >= 90
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300"
                  }`}
                >
                  {reel.score}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
