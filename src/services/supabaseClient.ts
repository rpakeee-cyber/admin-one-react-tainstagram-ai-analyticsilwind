import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export const supabaseConfig = {
  urlConfigured: Boolean(supabaseUrl),
  keyConfigured: Boolean(supabaseAnonKey),
  isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
};

export const supabaseClient = supabaseConfig.isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    })
  : null;

export const requireSupabaseClient = () => {
  if (!supabaseClient) {
    throw new Error(
      "Supabase не настроен. Добавьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return supabaseClient;
};

export type SupabaseConnectionResult = {
  ok: boolean;
  status: "connected" | "not-configured" | "error";
  message: string;
};

export const testSupabaseConnection = async (): Promise<SupabaseConnectionResult> => {
  if (!supabaseClient) {
    return {
      ok: false,
      status: "not-configured",
      message: "Supabase credentials не настроены.",
    };
  }

  try {
    const { error } = await supabaseClient.from("reels").select("id").limit(1);

    if (error) {
      return {
        ok: false,
        status: "error",
        message: `Supabase недоступен: ${error.message}`,
      };
    }

    return {
      ok: true,
      status: "connected",
      message: "Cloud storage is ready.",
    };
  } catch (error) {
    return {
      ok: false,
      status: "error",
      message:
        error instanceof Error
          ? `Supabase недоступен: ${error.message}`
          : "Supabase недоступен из-за неизвестной ошибки.",
    };
  }
};
