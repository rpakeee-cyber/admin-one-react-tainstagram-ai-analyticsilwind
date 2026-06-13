import { mdiMovieOpenPlusOutline } from "@mdi/js";
import Button from "../../../_components/Button";
import Icon from "../../../_components/Icon";

export default function EmptyReelsState() {
  return (
    <div className="rounded-3xl border border-dashed border-fuchsia-200 bg-white px-6 py-14 text-center shadow-sm dark:border-fuchsia-500/30 dark:bg-slate-900/70">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
        <Icon path={mdiMovieOpenPlusOutline} size="32" w="" h="" />
      </div>
      <h2 className="mt-5 text-xl font-bold">Пока нет добавленных Reels</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-slate-400">
        Добавьте первый ролик, чтобы увидеть аналитику.
      </p>
      <Button
        href="/dashboard/add-reel"
        label="Добавить первый Reel"
        color="contrast"
        roundedFull
        className="mt-6"
      />
    </div>
  );
}
