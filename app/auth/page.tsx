"use client";

import { mdiCheckCircleOutline, mdiEmailOutline, mdiGoogle, mdiInstagram } from "@mdi/js";
import { Field, Form, Formik, type FormikErrors } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../_components/Button";
import CardBox from "../_components/CardBox";
import FormField from "../_components/FormField";
import Icon from "../_components/Icon";
import SectionFullScreen from "../_components/Section/FullScreen";
import { useAuth } from "../../src/hooks/useAuth";
import { supabaseConfig } from "../../src/services/supabaseClient";

type AuthFormValues = {
  email: string;
};

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, loading, error, signInWithEmail, signInWithGoogle } = useAuth();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const validate = (values: AuthFormValues) => {
    const errors: FormikErrors<AuthFormValues> = {};
    if (!values.email.trim()) {
      errors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Проверьте формат email";
    }
    return errors;
  };

  return (
    <SectionFullScreen bg="purplePink">
      <CardBox className="w-11/12 shadow-2xl sm:w-9/12 md:w-7/12 lg:w-5/12 xl:w-4/12">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-violet-600 text-white">
            <Icon path={mdiInstagram} size="28" w="" h="" />
          </div>
          <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-fuchsia-600 uppercase">
            ReelScope AI
          </p>
          <h1 className="mt-2 text-2xl font-bold">Вход в аккаунт</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
            Войдите через Google или получите magic link на почту. Пароль не нужен.
          </p>
        </div>

        {success ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-center text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
            <Icon path={mdiCheckCircleOutline} size="28" w="" h="" className="mx-auto" />
            <p className="mt-3 font-bold">Проверьте почту</p>
            <p className="mt-1 text-sm">Откройте magic link, чтобы завершить вход.</p>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <Button
                label={loading ? "Подключаем..." : "Continue with Google"}
                icon={mdiGoogle}
                color="whiteDark"
                roundedFull
                className="w-full"
                disabled={loading || !supabaseConfig.isConfigured}
                onClick={() => void signInWithGoogle().catch(() => undefined)}
              />
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800" />
              <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                or continue with email
              </span>
              <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800" />
            </div>

            <Formik<AuthFormValues>
              initialValues={{ email: "" }}
              validate={validate}
              onSubmit={async (values, actions) => {
                try {
                  await signInWithEmail(values.email);
                  setSuccess(true);
                } catch {
                  setSuccess(false);
                } finally {
                  actions.setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <FormField
                    label="Email"
                    labelFor="email"
                    error={touched.email ? errors.email : undefined}
                    help="На этот адрес придёт одноразовая ссылка"
                  >
                    {({ className }) => (
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={className}
                      />
                    )}
                  </FormField>

                  {error && (
                    <div className="mb-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
                      {error}
                    </div>
                  )}

                  {!supabaseConfig.isConfigured && (
                    <div className="mb-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
                      Supabase не настроен. Google и email login недоступны, но Local mode
                      продолжает работать без входа.
                    </div>
                  )}

                  <Button
                    type="submit"
                    label={isSubmitting || loading ? "Отправляем..." : "Войти по email"}
                    icon={mdiEmailOutline}
                    color="contrast"
                    roundedFull
                    className="w-full"
                    disabled={isSubmitting || loading || !supabaseConfig.isConfigured}
                  />
                </Form>
              )}
            </Formik>
          </>
        )}

        <div className="mt-6 border-t border-gray-100 pt-5 text-center dark:border-slate-800">
          <Button href="/dashboard" label="Вернуться в Dashboard" color="whiteDark" roundedFull />
        </div>
      </CardBox>
    </SectionFullScreen>
  );
}