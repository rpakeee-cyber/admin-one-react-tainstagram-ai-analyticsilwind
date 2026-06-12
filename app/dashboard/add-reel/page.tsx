"use client";

import { mdiCheckCircleOutline, mdiLinkVariant, mdiUploadOutline } from "@mdi/js";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import Icon from "../../_components/Icon";
import SectionMain from "../../_components/Section/Main";
import PageIntro from "../_components/Analytics/PageIntro";

type ReelForm = {
  title: string;
  topic: string;
  publishedAt: string;
  views: string;
  likes: string;
  comments: string;
  saves: string;
  shares: string;
  newFollowers: string;
};

const initialValues: ReelForm = {
  title: "",
  topic: "Контент",
  publishedAt: "2026-06-12",
  views: "",
  likes: "",
  comments: "",
  saves: "",
  shares: "",
  newFollowers: "",
};

export default function AddReelPage() {
  const [saved, setSaved] = useState(false);

  return (
    <SectionMain>
      <PageIntro
        eyebrow="Demo input"
        title="Добавить Reel"
        description="Внесите метрики вручную. На следующем этапе их можно будет получать через Instagram API."
      />

      {saved && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Icon path={mdiCheckCircleOutline} size="22" w="" h="" />
          <div>
            <p className="font-bold">Demo Reel сохранён</p>
            <p className="text-sm opacity-80">Данные не отправлялись на сервер.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <CardBox>
          <Formik
            initialValues={initialValues}
            onSubmit={(_, actions) => {
              setSaved(true);
              actions.setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <FormField label="Название ролика" labelFor="title">
                      {({ className }) => (
                        <Field
                          id="title"
                          name="title"
                          placeholder="Например: 3 ошибки в обложках Reels"
                          className={className}
                          required
                        />
                      )}
                    </FormField>
                  </div>
                  <FormField label="Тема" labelFor="topic">
                    {({ className }) => (
                      <Field as="select" id="topic" name="topic" className={className}>
                        <option>Контент</option>
                        <option>Личный бренд</option>
                        <option>Продажи</option>
                        <option>Разбор</option>
                        <option>Закулисье</option>
                      </Field>
                    )}
                  </FormField>
                  <FormField label="Дата публикации" labelFor="publishedAt">
                    {({ className }) => (
                      <Field
                        type="date"
                        id="publishedAt"
                        name="publishedAt"
                        className={className}
                      />
                    )}
                  </FormField>
                  {[
                    ["views", "Просмотры"],
                    ["likes", "Лайки"],
                    ["comments", "Комментарии"],
                    ["saves", "Сохранения"],
                    ["shares", "Репосты"],
                    ["newFollowers", "Новые подписчики"],
                  ].map(([name, label]) => (
                    <FormField key={name} label={label} labelFor={name}>
                      {({ className }) => (
                        <Field
                          type="number"
                          min="0"
                          id={name}
                          name={name}
                          placeholder="0"
                          className={className}
                        />
                      )}
                    </FormField>
                  ))}
                </div>
                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
                  <Button href="/dashboard/reels" label="Отмена" color="whiteDark" roundedFull />
                  <Button
                    type="submit"
                    label={isSubmitting ? "Сохранение..." : "Сохранить Reel"}
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
              <Icon path={mdiLinkVariant} size="24" w="" h="" />
            </div>
            <h3 className="mt-4 text-lg font-bold">Ссылка на Instagram</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
              Импорт по ссылке появится после подключения Instagram API.
            </p>
          </CardBox>
          <CardBox>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              <Icon path={mdiUploadOutline} size="24" w="" h="" />
            </div>
            <h3 className="mt-4 text-lg font-bold">CSV-импорт</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
              Массовая загрузка метрик запланирована для следующего технического этапа.
            </p>
          </CardBox>
        </div>
      </div>
    </SectionMain>
  );
}
