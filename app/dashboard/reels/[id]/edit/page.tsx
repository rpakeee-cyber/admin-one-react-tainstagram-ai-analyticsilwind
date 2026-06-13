"use client";

import { mdiArrowLeft } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../../../../_components/Button";
import SectionMain from "../../../../_components/Section/Main";
import { useReels } from "../../../../../src/hooks/useReels";
import { setReelsNotice, updateReel } from "../../../../../src/services/reelsStorage";
import type { ReelInput } from "../../../../../src/types";
import PageIntro from "../../../_components/Analytics/PageIntro";
import ReelForm from "../../../_components/Reels/ReelForm";

export default function EditReelPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { reels, isReady } = useReels();
  const [error, setError] = useState("");
  const reel = reels.find((item) => item.id === params.id);

  if (!isReady) {
    return (
      <SectionMain>
        <div className="h-80 animate-pulse rounded-3xl bg-white dark:bg-slate-900/70" />
      </SectionMain>
    );
  }

  if (!reel) {
    return (
      <SectionMain>
        <div className="rounded-3xl bg-white p-10 text-center dark:bg-slate-900/70">
          <h1 className="text-2xl font-bold">Reel не найден</h1>
          <Button
            href="/dashboard/reels"
            label="Назад к Reels"
            icon={mdiArrowLeft}
            color="contrast"
            roundedFull
            className="mt-6"
          />
        </div>
      </SectionMain>
    );
  }

  const handleSubmit = async (values: ReelInput) => {
    setError("");
    try {
      const updatedReel = await updateReel(reel.id, values);
      if (!updatedReel) {
        setError("Reel не найден в текущем источнике данных.");
        return;
      }
      setReelsNotice(`Изменения в Reel «${values.title}» сохранены.`);
      router.push("/dashboard/reels");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось обновить Reel.");
    }
  };

  return (
    <SectionMain>
      <PageIntro
        eyebrow="Редактирование"
        title={reel.title}
        description="Изменения сохранятся в текущем источнике данных, а updatedAt обновится автоматически."
        actions={
          <Button
            href={`/dashboard/reels/${reel.id}`}
            label="К деталям"
            icon={mdiArrowLeft}
            color="whiteDark"
            roundedFull
          />
        }
      />
      {error && (
        <div className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}
      <ReelForm reel={reel} submitLabel="Сохранить изменения" onSubmit={handleSubmit} />
    </SectionMain>
  );
}
