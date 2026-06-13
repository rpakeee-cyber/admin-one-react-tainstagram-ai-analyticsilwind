"use client";

import { mdiContentSaveOutline, mdiRefresh } from "@mdi/js";
import { Field, Form, Formik, type FormikErrors } from "formik";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import FormField from "../../../_components/FormField";
import {
  reelFormats,
  reelTopics,
  type Reel,
  type ReelFormValues,
  type ReelInput,
} from "../../../../src/types";

type Props = {
  reel?: Reel;
  submitLabel: string;
  onSubmit: (values: ReelInput) => void | Promise<void>;
};

const toFormValues = (reel?: Reel): ReelFormValues => ({
  title: reel?.title ?? "",
  publishDate: reel?.publishDate ?? new Date().toISOString().slice(0, 10),
  topic: reel?.topic ?? "Работа",
  format: reel?.format ?? "Talking Head",
  views: reel ? String(reel.views) : "",
  reach: reel ? String(reel.reach) : "",
  likes: reel ? String(reel.likes) : "",
  comments: reel ? String(reel.comments) : "",
  saves: reel ? String(reel.saves) : "",
  shares: reel ? String(reel.shares) : "",
  newFollowers: reel ? String(reel.newFollowers) : "",
  durationSeconds: reel ? String(reel.durationSeconds) : "",
  retentionRate: reel ? String(reel.retentionRate) : "",
  hook: reel?.hook ?? "",
  link: reel?.link ?? "",
  notes: reel?.notes ?? "",
});

const toNumber = (value: string) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
};

const validate = (values: ReelFormValues) => {
  const errors: FormikErrors<ReelFormValues> = {};

  if (!values.title.trim()) {
    errors.title = "Укажите название ролика";
  }

  if (!values.publishDate) {
    errors.publishDate = "Укажите дату публикации";
  }

  const nonNegativeFields: Array<keyof ReelFormValues> = [
    "views",
    "reach",
    "likes",
    "comments",
    "saves",
    "shares",
    "newFollowers",
    "durationSeconds",
  ];

  nonNegativeFields.forEach((field) => {
    if (values[field] !== "" && Number(values[field]) < 0) {
      errors[field] = "Значение не может быть отрицательным";
    }
  });

  const retentionRate = Number(values.retentionRate || 0);
  if (!Number.isFinite(retentionRate) || retentionRate < 0 || retentionRate > 100) {
    errors.retentionRate = "Укажите значение от 0 до 100";
  }

  return errors;
};

const toReelInput = (values: ReelFormValues): ReelInput => ({
  title: values.title.trim(),
  publishDate: values.publishDate,
  topic: values.topic,
  format: values.format,
  views: toNumber(values.views),
  reach: toNumber(values.reach),
  likes: toNumber(values.likes),
  comments: toNumber(values.comments),
  saves: toNumber(values.saves),
  shares: toNumber(values.shares),
  newFollowers: toNumber(values.newFollowers),
  durationSeconds: toNumber(values.durationSeconds),
  retentionRate: Math.min(toNumber(values.retentionRate), 100),
  hook: values.hook.trim(),
  link: values.link.trim(),
  notes: values.notes.trim(),
});

const numericFields: Array<{
  name: keyof ReelFormValues;
  label: string;
  help?: string;
  max?: number;
}> = [
  { name: "views", label: "Просмотры" },
  { name: "reach", label: "Охват", help: "Если оставить 0, engagement считается от просмотров" },
  { name: "likes", label: "Лайки" },
  { name: "comments", label: "Комментарии" },
  { name: "saves", label: "Сохранения" },
  { name: "shares", label: "Репосты" },
  { name: "newFollowers", label: "Новые подписчики" },
  { name: "durationSeconds", label: "Длительность, сек." },
  { name: "retentionRate", label: "Удержание, %", max: 100 },
];

export default function ReelForm({ reel, submitLabel, onSubmit }: Props) {
  return (
    <Formik
      initialValues={toFormValues(reel)}
      enableReinitialize
      validate={validate}
      onSubmit={async (values, actions) => {
        await onSubmit(toReelInput(values));
        actions.setSubmitting(false);
      }}
    >
      {({ errors, touched, isSubmitting, resetForm }) => (
        <Form className="space-y-6">
          <CardBox>
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-600 uppercase">
                Блок 1
              </p>
              <h2 className="mt-1 text-xl font-bold">Основное</h2>
            </div>
            <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField
                  label="Название ролика"
                  labelFor="title"
                  error={touched.title ? errors.title : undefined}
                >
                  {({ className }) => (
                    <Field
                      id="title"
                      name="title"
                      placeholder="Например: Один рабочий день без прикрас"
                      className={className}
                    />
                  )}
                </FormField>
              </div>
              <FormField
                label="Дата публикации"
                labelFor="publishDate"
                error={touched.publishDate ? errors.publishDate : undefined}
              >
                {({ className }) => (
                  <Field type="date" id="publishDate" name="publishDate" className={className} />
                )}
              </FormField>
              <FormField label="Тема" labelFor="topic">
                {({ className }) => (
                  <Field as="select" id="topic" name="topic" className={className}>
                    {reelTopics.map((topic) => (
                      <option key={topic}>{topic}</option>
                    ))}
                  </Field>
                )}
              </FormField>
              <FormField label="Формат" labelFor="format">
                {({ className }) => (
                  <Field as="select" id="format" name="format" className={className}>
                    {reelFormats.map((format) => (
                      <option key={format}>{format}</option>
                    ))}
                  </Field>
                )}
              </FormField>
              <FormField label="Ссылка на Reel" labelFor="link" help="Поле необязательное">
                {({ className }) => (
                  <Field
                    type="url"
                    id="link"
                    name="link"
                    placeholder="https://instagram.com/reel/..."
                    className={className}
                  />
                )}
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Hook" labelFor="hook" help="Первая фраза или главный тезис">
                  {({ className }) => (
                    <Field
                      id="hook"
                      name="hook"
                      placeholder="Что зритель слышит или видит в первые секунды?"
                      className={className}
                    />
                  )}
                </FormField>
              </div>
            </div>
          </CardBox>

          <CardBox>
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-violet-600 uppercase">
                Блок 2
              </p>
              <h2 className="mt-1 text-xl font-bold">Метрики</h2>
            </div>
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
              {numericFields.map((field) => (
                <FormField
                  key={field.name}
                  label={field.label}
                  labelFor={field.name}
                  help={field.help}
                  error={touched[field.name] ? errors[field.name] : undefined}
                >
                  {({ className }) => (
                    <Field
                      type="number"
                      min="0"
                      max={field.max}
                      step={field.name === "retentionRate" ? "0.1" : "1"}
                      id={field.name}
                      name={field.name}
                      placeholder="0"
                      className={className}
                    />
                  )}
                </FormField>
              ))}
            </div>
          </CardBox>

          <CardBox>
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-cyan-600 uppercase">
                Блок 3
              </p>
              <h2 className="mt-1 text-xl font-bold">Заметки</h2>
            </div>
            <FormField
              label="Наблюдения по ролику"
              labelFor="notes"
              help="Что сработало, что стоит проверить в следующем Reel"
              hasTextareaHeight
            >
              {({ className }) => (
                <Field
                  as="textarea"
                  id="notes"
                  name="notes"
                  placeholder="Например: зрители активно отвечали на вопрос в конце..."
                  className={`${className} min-h-32 resize-y`}
                />
              )}
            </FormField>
          </CardBox>

          <div className="sticky bottom-20 z-20 flex flex-col-reverse gap-3 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur sm:static sm:flex-row sm:justify-end sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none lg:bottom-4 dark:border-slate-700 dark:bg-slate-900/95 sm:dark:bg-transparent">
            <Button
              label="Очистить форму"
              icon={mdiRefresh}
              color="whiteDark"
              roundedFull
              className="w-full sm:w-auto"
              onClick={() => resetForm()}
            />
            <Button
              type="submit"
              label={isSubmitting ? "Сохранение..." : submitLabel}
              icon={mdiContentSaveOutline}
              color="contrast"
              roundedFull
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
