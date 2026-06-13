"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SectionMain from "../../_components/Section/Main";
import { addReel, setReelsNotice } from "../../../src/services/reelsStorage";
import type { ReelInput } from "../../../src/types";
import PageIntro from "../_components/Analytics/PageIntro";
import ReelForm from "../_components/Reels/ReelForm";

export default function AddReelPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (values: ReelInput) => {
    setError("");
    try {
      await addReel(values);
      setReelsNotice("Reel сохранён. Данные доступны после перезагрузки страницы.");
      router.push("/dashboard/reels");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить Reel.");
    }
  };

  return (
    <SectionMain>
      <PageIntro
        eyebrow="Ручной ввод"
        title="Добавить Reel"
        description="Заполните основные данные и метрики. Источник хранения определяется текущим data mode."
      />
      {error && (
        <div className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}
      <ReelForm submitLabel="Сохранить Reel" onSubmit={handleSubmit} />
    </SectionMain>
  );
}
