import { reelFormats, reelTopics, type Reel, type ReelFormat, type ReelInput, type ReelTopic } from "../types";
import { requireSupabaseClient } from "./supabaseClient";

type SupabaseReelRow = {
  id: string;
  title: string;
  publish_date: string;
  topic: string | null;
  format: string | null;
  views: number | null;
  reach: number | null;
  likes: number | null;
  comments: number | null;
  saves: number | null;
  shares: number | null;
  new_followers: number | null;
  duration_seconds: number | null;
  retention_rate: number | string | null;
  hook: string | null;
  link: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const asNumber = (value: number | string | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const asTopic = (value: string | null): ReelTopic =>
  reelTopics.includes(value as ReelTopic) ? (value as ReelTopic) : "Другое";

const asFormat = (value: string | null): ReelFormat =>
  reelFormats.includes(value as ReelFormat) ? (value as ReelFormat) : "Other";

const mapRowToReel = (row: SupabaseReelRow): Reel => ({
  id: row.id,
  title: row.title,
  publishDate: row.publish_date,
  topic: asTopic(row.topic),
  format: asFormat(row.format),
  views: asNumber(row.views),
  reach: asNumber(row.reach),
  likes: asNumber(row.likes),
  comments: asNumber(row.comments),
  saves: asNumber(row.saves),
  shares: asNumber(row.shares),
  newFollowers: asNumber(row.new_followers),
  durationSeconds: asNumber(row.duration_seconds),
  retentionRate: asNumber(row.retention_rate),
  hook: row.hook ?? "",
  link: row.link ?? "",
  notes: row.notes ?? "",
  createdAt: row.created_at ?? new Date().toISOString(),
  updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
});

const mapInputToRow = (input: ReelInput) => ({
  title: input.title,
  publish_date: input.publishDate,
  topic: input.topic,
  format: input.format,
  views: input.views,
  reach: input.reach,
  likes: input.likes,
  comments: input.comments,
  saves: input.saves,
  shares: input.shares,
  new_followers: input.newFollowers,
  duration_seconds: input.durationSeconds,
  retention_rate: input.retentionRate,
  hook: input.hook,
  link: input.link,
  notes: input.notes,
});

const mapUpdatesToRow = (updates: Partial<ReelInput>) => {
  const row: Record<string, string | number> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) row.title = updates.title;
  if (updates.publishDate !== undefined) row.publish_date = updates.publishDate;
  if (updates.topic !== undefined) row.topic = updates.topic;
  if (updates.format !== undefined) row.format = updates.format;
  if (updates.views !== undefined) row.views = updates.views;
  if (updates.reach !== undefined) row.reach = updates.reach;
  if (updates.likes !== undefined) row.likes = updates.likes;
  if (updates.comments !== undefined) row.comments = updates.comments;
  if (updates.saves !== undefined) row.saves = updates.saves;
  if (updates.shares !== undefined) row.shares = updates.shares;
  if (updates.newFollowers !== undefined) row.new_followers = updates.newFollowers;
  if (updates.durationSeconds !== undefined) row.duration_seconds = updates.durationSeconds;
  if (updates.retentionRate !== undefined) row.retention_rate = updates.retentionRate;
  if (updates.hook !== undefined) row.hook = updates.hook;
  if (updates.link !== undefined) row.link = updates.link;
  if (updates.notes !== undefined) row.notes = updates.notes;

  return row;
};

const createStorageError = (action: string, error: unknown) => {
  const detail =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : error instanceof Error
        ? error.message
        : "неизвестная ошибка";

  return new Error(`Не удалось ${action} в Supabase: ${detail}`);
};

export const getReelsFromSupabase = async (): Promise<Reel[]> => {
  try {
    const { data, error } = await requireSupabaseClient()
      .from("reels")
      .select("*")
      .order("publish_date", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as SupabaseReelRow[]).map(mapRowToReel);
  } catch (error) {
    throw createStorageError("загрузить Reels", error);
  }
};

export const addReelToSupabase = async (reel: ReelInput): Promise<Reel> => {
  try {
    const { data, error } = await requireSupabaseClient()
      .from("reels")
      .insert(mapInputToRow(reel))
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToReel(data as SupabaseReelRow);
  } catch (error) {
    throw createStorageError("сохранить Reel", error);
  }
};

export const updateReelInSupabase = async (
  id: string,
  updates: Partial<ReelInput>,
): Promise<Reel | null> => {
  try {
    const { data, error } = await requireSupabaseClient()
      .from("reels")
      .update(mapUpdatesToRow(updates))
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToReel(data as SupabaseReelRow) : null;
  } catch (error) {
    throw createStorageError("обновить Reel", error);
  }
};

export const deleteReelFromSupabase = async (id: string): Promise<boolean> => {
  try {
    const { data, error } = await requireSupabaseClient()
      .from("reels")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    return Boolean(data);
  } catch (error) {
    throw createStorageError("удалить Reel", error);
  }
};

export const getReelByIdFromSupabase = async (id: string): Promise<Reel | null> => {
  try {
    const { data, error } = await requireSupabaseClient()
      .from("reels")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToReel(data as SupabaseReelRow) : null;
  } catch (error) {
    throw createStorageError("загрузить Reel", error);
  }
};
