import { supabaseClient, supabaseConfig } from "./supabaseClient";

export const AUTH_REQUIRED_MESSAGE = "Чтобы использовать облачное хранилище, войдите в аккаунт.";

export type AuthUser = {
  id: string;
  email?: string;
};

export type AuthSession = {
  user: AuthUser;
  access_token?: string;
  refresh_token?: string;
};

export type AuthChangeEvent = string;

export class AuthRequiredError extends Error {
  constructor(message = AUTH_REQUIRED_MESSAGE) {
    super(message);
    this.name = "AuthRequiredError";
  }
}

export const isAuthRequiredError = (error: unknown): error is AuthRequiredError =>
  error instanceof AuthRequiredError;

export const getSession = async (): Promise<AuthSession | null> => {
  if (!supabaseClient) {
    return null;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    throw new Error(`Не удалось получить сессию: ${error.message}`);
  }

  return data.session;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  if (!supabaseClient) {
    return null;
  }

  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    if (
      error.name === "AuthSessionMissingError" ||
      String(error.message).toLowerCase().includes("auth session missing")
    ) {
      return null;
    }
    throw new Error(`Не удалось получить пользователя: ${error.message}`);
  }

  return data.user;
};

export const requireCurrentUser = async (): Promise<AuthUser> => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthRequiredError();
  }
  return user;
};

export const signInWithEmail = async (email: string) => {
  if (!supabaseClient || !supabaseConfig.isConfigured) {
    throw new Error("Supabase не настроен. Добавьте URL и anon key в .env.local.");
  }

  const emailRedirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined;
  const { data, error } = await supabaseClient.auth.signInWithOtp({
    email: email.trim(),
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    throw new Error(`Не удалось отправить ссылку: ${error.message}`);
  }

  return data;
};

export const signOut = async () => {
  if (!supabaseClient) {
    return;
  }

  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    throw new Error(`Не удалось выйти: ${error.message}`);
  }
};

export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: AuthSession | null) => void,
) => {
  if (!supabaseClient) {
    callback("INITIAL_SESSION", null);
    return () => undefined;
  }

  const { data } = supabaseClient.auth.onAuthStateChange(callback);
  return () => data.subscription.unsubscribe();
};
