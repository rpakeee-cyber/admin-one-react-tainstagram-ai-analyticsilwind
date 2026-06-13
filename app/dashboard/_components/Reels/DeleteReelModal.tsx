"use client";

import CardBoxModal from "../../../_components/CardBox/Modal";
import type { Reel } from "../../../../src/types";

type Props = {
  reel: Reel | null;
  onCancel: () => void;
  onConfirm: (reel: Reel) => void;
};

export default function DeleteReelModal({ reel, onCancel, onConfirm }: Props) {
  return (
    <CardBoxModal
      title="Удалить Reel"
      buttonColor="danger"
      buttonLabel="Удалить"
      cancelLabel="Отмена"
      isActive={Boolean(reel)}
      onCancel={onCancel}
      onConfirm={() => reel && onConfirm(reel)}
    >
      <p className="text-gray-700 dark:text-slate-200">Точно удалить этот ролик?</p>
      <p className="text-sm text-gray-500 dark:text-slate-400">{reel?.title}</p>
    </CardBoxModal>
  );
}
