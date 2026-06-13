"use client";

import {
  mdiBellOutline,
  mdiCloudSyncOutline,
  mdiContentSaveOutline,
  mdiDatabaseOutline,
  mdiInstagram,
  mdiShieldCheckOutline,
} from "@mdi/js";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import FormCheckRadio from "../../_components/FormField/CheckRadio";
import Icon from "../../_components/Icon";
import SectionMain from "../../_components/Section/Main";
import { getDataStorageConfig } from "../../../src/services/reelsDataProvider";
import {
  testSupabaseConnection,
  type SupabaseConnectionResult,
} from "../../../src/services/supabaseClient";
import PageIntro from "../_components/Analytics/PageIntro";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const storageConfig = getDataStorageConfig();
  const [connectionStatus, setConnectionStatus] = useState<
    SupabaseConnectionResult["status"] | "not-tested" | "testing"
  >(storageConfig.supabaseConfigured ? "not-tested" : "not-configured");
  const [connectionMessage, setConnectionMessage] = useState(
    storageConfig.supabaseConfigured
      ? "Supabase настроен. Нажмите кнопку, чтобы проверить таблицу reels."
      : "Supabase credentials не настроены.",
  );

  const testConnection = async () => {
    setConnectionStatus("testing");
    setConnectionMessage("Проверяем подключение и доступ к таблице reels...");
    const result = await testSupabaseConnection();
    setConnectionStatus(result.status);
    setConnectionMessage(result.message);
  };

  const connectionLabel = {
    connected: "Connected",
    "not-configured": "Not configured",
    "not-tested": "Not tested",
    testing: "Testing...",
    error: "Error",
  }[connectionStatus];

  return (
    <SectionMain>
      <PageIntro
        eyebrow="Workspace"
        title="Настройки"
        description="Параметры профиля, уведомлений и будущего подключения Instagram."
      />

      {saved && (
        <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          Настройки сохранены локально в demo-режиме.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <CardBox>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
              <Icon path={mdiInstagram} size="24" w="" h="" />
            </div>
            <div>
              <h2 className="font-bold">Профиль проекта</h2>
              <p className="text-sm text-gray-400">Основные данные dashboard</p>
            </div>
          </div>
          <Formik
            initialValues={{
              projectName: "ReelScope AI",
              instagramHandle: "@aliya.creates",
              goal: "Рост личного бренда и экспертной аудитории",
            }}
            onSubmit={(_, actions) => {
              setSaved(true);
              actions.setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormField label="Название проекта" labelFor="projectName">
                  {({ className }) => (
                    <Field id="projectName" name="projectName" className={className} />
                  )}
                </FormField>
                <FormField label="Instagram username" labelFor="instagramHandle">
                  {({ className }) => (
                    <Field id="instagramHandle" name="instagramHandle" className={className} />
                  )}
                </FormField>
                <FormField label="Главная цель" labelFor="goal">
                  {({ className }) => <Field id="goal" name="goal" className={className} />}
                </FormField>
                <div className="border-t border-gray-100 pt-5 text-right dark:border-slate-800">
                  <Button
                    type="submit"
                    label="Сохранить настройки"
                    icon={mdiContentSaveOutline}
                    color="contrast"
                    roundedFull
                    disabled={isSubmitting}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </CardBox>

        <div className="space-y-6">
          <CardBox>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                <Icon path={mdiCloudSyncOutline} size="23" w="" h="" />
              </div>
              <div>
                <h2 className="font-bold">Data Storage Mode</h2>
                <p className="text-sm text-gray-400">Local и Supabase configuration</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 text-sm dark:divide-slate-800">
              {[
                [
                  "Current mode",
                  storageConfig.effectiveMode === "supabase" ? "Supabase" : "Local",
                  storageConfig.effectiveMode === "supabase",
                ],
                [
                  "Supabase URL configured",
                  storageConfig.supabaseUrlConfigured ? "Yes" : "No",
                  storageConfig.supabaseUrlConfigured,
                ],
                [
                  "Supabase key configured",
                  storageConfig.supabaseKeyConfigured ? "Yes" : "No",
                  storageConfig.supabaseKeyConfigured,
                ],
                ["Connection status", connectionLabel, connectionStatus === "connected"],
                ["Fallback mode", "Local storage", true],
              ].map(([label, value, isPositive]) => (
                <div key={String(label)} className="flex items-start justify-between gap-4 py-3">
                  <span className="text-gray-500 dark:text-slate-400">{label}</span>
                  <span
                    className={`text-right font-semibold ${
                      isPositive
                        ? "text-emerald-600 dark:text-emerald-300"
                        : "text-gray-600 dark:text-slate-300"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div
              className={`mt-5 rounded-2xl p-4 text-sm leading-6 ${
                connectionStatus === "connected"
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
                  : connectionStatus === "error"
                    ? "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-200"
                    : "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200"
              }`}
            >
              <p>{connectionMessage}</p>
              {!storageConfig.supabaseConfigured && (
                <p className="mt-2">
                  Сейчас данные сохраняются только в браузере. Чтобы включить облачное хранение,
                  создай Supabase project, добавь env-переменные и таблицу reels.
                </p>
              )}
              {storageConfig.fallbackWarning && (
                <p className="mt-2 font-semibold">{storageConfig.fallbackWarning}</p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                label={connectionStatus === "testing" ? "Testing..." : "Test Supabase Connection"}
                color="contrast"
                roundedFull
                disabled={!storageConfig.supabaseConfigured || connectionStatus === "testing"}
                onClick={() => void testConnection()}
              />
              <Button
                label="Migration coming soon"
                icon={mdiDatabaseOutline}
                color="lightDark"
                roundedFull
                disabled
              />
            </div>
          </CardBox>

          <CardBox>
            <div className="mb-5 flex items-center gap-3">
              <Icon path={mdiBellOutline} size="23" className="text-fuchsia-600" w="" h="" />
              <h2 className="font-bold">Уведомления</h2>
            </div>
            <div className="space-y-4">
              <FormCheckRadio type="switch" label="Еженедельный отчёт">
                <input type="checkbox" defaultChecked />
              </FormCheckRadio>
              <FormCheckRadio type="switch" label="Новые AI-рекомендации">
                <input type="checkbox" defaultChecked />
              </FormCheckRadio>
              <FormCheckRadio type="switch" label="Напоминания контент-плана">
                <input type="checkbox" />
              </FormCheckRadio>
            </div>
          </CardBox>

          <CardBox>
            <div className="mb-4 flex items-center gap-3">
              <Icon path={mdiShieldCheckOutline} size="23" className="text-emerald-600" w="" h="" />
              <h2 className="font-bold">Подключение Instagram</h2>
            </div>
            <p className="text-sm leading-6 text-gray-500 dark:text-slate-400">
              Не подключено. На текущем этапе dashboard использует только demo data и не запрашивает
              доступ к аккаунту.
            </p>
            <Button
              label="Подключение появится позже"
              color="lightDark"
              className="mt-5 w-full"
              roundedFull
              disabled
            />
          </CardBox>
        </div>
      </div>
    </SectionMain>
  );
}
