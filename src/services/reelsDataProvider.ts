import type { ReelInput } from "../types";
import {
  addReel as addLocalReel,
  deleteReel as deleteLocalReel,
  getReelById as getLocalReelById,
  getReels as getLocalReels,
  REELS_CHANGED_EVENT,
  updateReel as updateLocalReel,
} from "./reelsLocalStorage";
import {
  addReelToSupabase,
  deleteReelFromSupabase,
  getReelByIdFromSupabase,
  getReelsFromSupabase,
  updateReelInSupabase,
} from "./reelsSupabaseStorage";
import { supabaseConfig } from "./supabaseClient";

export type DataMode = "local" | "supabase";

const requestedMode: DataMode =
  process.env.NEXT_PUBLIC_DATA_MODE?.toLowerCase() === "supabase" ? "supabase" : "local";

const effectiveMode: DataMode =
  requestedMode === "supabase" && supabaseConfig.isConfigured ? "supabase" : "local";

let lastFallbackError =
  requestedMode === "supabase" && !supabaseConfig.isConfigured
    ? "Supabase mode запрошен, но URL или anon key не настроены. Используется localStorage."
    : "";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Неизвестная ошибка источника данных.";

const notifyDataChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(REELS_CHANGED_EVENT));
  }
};

const withFallback = async <T>(
  cloudAction: () => Promise<T>,
  localAction: () => T,
): Promise<T> => {
  if (effectiveMode === "local") {
    return localAction();
  }

  try {
    const result = await cloudAction();
    lastFallbackError = "";
    return result;
  } catch (error) {
    lastFallbackError = `${getErrorMessage(error)} Используется localStorage fallback.`;
    console.warn(lastFallbackError);
    return localAction();
  }
};

export const getDataStorageConfig = () => ({
  requestedMode,
  effectiveMode,
  supabaseUrlConfigured: supabaseConfig.urlConfigured,
  supabaseKeyConfigured: supabaseConfig.keyConfigured,
  supabaseConfigured: supabaseConfig.isConfigured,
  fallbackMode: "local" as const,
  fallbackWarning: lastFallbackError,
});

export const getDataProviderWarning = () => lastFallbackError;

export const getReels = () => withFallback(getReelsFromSupabase, getLocalReels);

export const addReel = async (reel: ReelInput) => {
  const result = await withFallback(
    () => addReelToSupabase(reel),
    () => addLocalReel(reel),
  );
  notifyDataChanged();
  return result;
};

export const updateReel = async (id: string, updates: Partial<ReelInput>) => {
  const result = await withFallback(
    () => updateReelInSupabase(id, updates),
    () => updateLocalReel(id, updates),
  );
  notifyDataChanged();
  return result;
};

export const deleteReel = async (id: string) => {
  const result = await withFallback(
    () => deleteReelFromSupabase(id),
    () => deleteLocalReel(id),
  );
  notifyDataChanged();
  return result;
};

export const getReelById = (id: string) =>
  withFallback(
    () => getReelByIdFromSupabase(id),
    () => getLocalReelById(id),
  );

export { REELS_CHANGED_EVENT };
