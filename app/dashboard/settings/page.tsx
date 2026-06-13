"use client";

import {
  mdiBellOutline,
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
import PageIntro from "../_components/Analytics/PageIntro";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

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
                <Icon path={mdiDatabaseOutline} size="23" w="" h="" />
              </div>
              <div>
                <h2 className="font-bold">Data Storage Status</h2>
                <p className="text-sm text-gray-400">Текущий режим хранения данных</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 text-sm dark:divide-slate-800">
              {[
                ["Current mode", "Local browser storage", true],
                ["Data location", "Only this device/browser", true],
                ["Cloud sync", "Not connected yet", false],
                ["Instagram API", "Not connected yet", false],
                ["AI API", "Not connected yet", false],
              ].map(([label, value, isLocal]) => (
                <div key={String(label)} className="flex items-start justify-between gap-4 py-3">
                  <span className="text-gray-500 dark:text-slate-400">{label}</span>
                  <span
                    className={`text-right font-semibold ${
                      isLocal
                        ? "text-emerald-600 dark:text-emerald-300"
                        : "text-gray-600 dark:text-slate-300"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
              Сейчас данные хранятся только в браузере. Если открыть сайт на другом устройстве,
              данные не появятся. На следующем этапе будет подключена облачная база.
            </p>
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
