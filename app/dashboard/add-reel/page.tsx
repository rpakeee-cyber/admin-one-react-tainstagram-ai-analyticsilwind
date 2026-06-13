"use client";

import { useRouter } from "next/navigation";
import SectionMain from "../../_components/Section/Main";
import { addReel, setReelsNotice } from "../../../src/services/reelsStorage";
import type { ReelInput } from "../../../src/types";
import PageIntro from "../_components/Analytics/PageIntro";
import ReelForm from "../_components/Reels/ReelForm";

export default function AddReelPage() {
  const router = useRouter();

  const handleSubmit = (values: ReelInput) => {
    addReel(values);
    setReelsNotice("Reel сохранён. Данные доступны после перезагрузки страницы.");
    router.push("/dashboard/reels");
  };

  return (
    <SectionMain>
      <PageIntro
        eyebrow="Ручной ввод"
        title="Добавить Reel"
        description="Заполните основные данные и метрики. Всё сохранится только в localStorage этого браузера."
      />
      <ReelForm submitLabel="Сохранить Reel" onSubmit={handleSubmit} />
    </SectionMain>
  );
}
