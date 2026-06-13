import Button from "../../../_components/Button";

type Props = {
  reelsCount: number;
};

export default function DataConfidenceNotice({ reelsCount }: Props) {
  if (reelsCount >= 5) {
    return (
      <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
        Рекомендации основаны на твоих сохранённых Reels.
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
      <p>
        {reelsCount === 0
          ? "Пока нет сохранённых Reels. Показываем универсальные идеи для личного бренда."
          : reelsCount < 3
            ? "Пока данных мало. Рекомендации предварительные — добавь хотя бы 3–5 Reels для точности."
            : "Уже видны первые закономерности. Добавь ещё Reels, чтобы довести выборку минимум до пяти."}
      </p>
      <Button
        href="/dashboard/add-reel"
        label={reelsCount === 0 ? "Добавить Reel" : "Добавить данные"}
        color="contrast"
        roundedFull
        small
      />
    </div>
  );
}
