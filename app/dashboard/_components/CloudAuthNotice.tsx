"use client";

import { mdiCloudLockOutline, mdiLoginVariant } from "@mdi/js";
import Button from "../../_components/Button";
import Icon from "../../_components/Icon";
import { useAuth } from "../../../src/hooks/useAuth";
import { getDataStorageConfig } from "../../../src/services/reelsDataProvider";

export default function CloudAuthNotice() {
  const { isAuthenticated, loading } = useAuth();
  const storageConfig = getDataStorageConfig();

  if (
    loading ||
    storageConfig.requestedMode !== "supabase" ||
    !storageConfig.supabaseConfigured ||
    isAuthenticated
  ) {
    return null;
  }

  return (
    <div className="mx-auto mt-4 flex max-w-6xl flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/20 dark:bg-amber-500/10">
      <div className="flex items-start gap-3 text-amber-900 dark:text-amber-100">
        <Icon path={mdiCloudLockOutline} size="23" w="" h="" className="mt-0.5 shrink-0" />
        <div>
          <p className="font-bold">Чтобы сохранять данные в облаке, войдите в аккаунт.</p>
          <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-200/80">
            Локальные Reels останутся в этом браузере и не будут удалены.
          </p>
        </div>
      </div>
      <Button
        href="/auth"
        label="Войти"
        icon={mdiLoginVariant}
        color="contrast"
        roundedFull
        className="w-full sm:w-auto"
      />
    </div>
  );
}
