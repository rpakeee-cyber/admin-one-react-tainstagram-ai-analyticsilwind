import { demoReels } from "../data/demoData";
import type { Reel, ReelInput } from "../types";

const STORAGE_KEY = "reelscope.reels.v1";
const NOTICE_KEY = "reelscope.reels.notice";
export const REELS_CHANGED_EVENT = "reelscope:reels-changed";

type StoredReels = {
  version: 1;
  reels: Reel[];
};

const canUseStorage = () => typeof window !== "undefined";

const isReel = (value: unknown): value is Reel => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const reel = value as Partial<Reel>;
  return (
    typeof reel.id === "string" &&
    typeof reel.title === "string" &&
    typeof reel.publishDate === "string" &&
    typeof reel.topic === "string" &&
    typeof reel.format === "string" &&
    typeof reel.views === "number" &&
    typeof reel.createdAt === "string" &&
    typeof reel.updatedAt === "string"
  );
};

const readStoredReels = (): Reel[] | null => {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (rawValue === null) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as StoredReels;
    if (parsed?.version !== 1 || !Array.isArray(parsed.reels)) {
      return [];
    }

    return parsed.reels.filter(isReel);
  } catch {
    return [];
  }
};

const notifyReelsChanged = () => {
  if (canUseStorage()) {
    window.dispatchEvent(new Event(REELS_CHANGED_EVENT));
  }
};

export const getReels = () => {
  const storedReels = readStoredReels();
  return storedReels === null ? demoReels : storedReels;
};

export const getStoredReels = () => readStoredReels() ?? [];

export const saveReels = (reels: Reel[]) => {
  if (!canUseStorage()) {
    return reels;
  }

  const payload: StoredReels = {
    version: 1,
    reels,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  notifyReelsChanged();
  return reels;
};

export const addReel = (input: ReelInput) => {
  const now = new Date().toISOString();
  const reel: Reel = {
    ...input,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `reel-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  const storedReels = readStoredReels();

  saveReels([reel, ...(storedReels ?? [])]);
  return reel;
};

export const updateReel = (id: string, updates: Partial<ReelInput>) => {
  let updatedReel: Reel | null = null;
  const nextReels = getReels().map((reel) => {
    if (reel.id !== id) {
      return reel;
    }

    updatedReel = {
      ...reel,
      ...updates,
      id: reel.id,
      createdAt: reel.createdAt,
      updatedAt: new Date().toISOString(),
    };
    return updatedReel;
  });

  if (updatedReel) {
    saveReels(nextReels);
  }

  return updatedReel;
};

export const deleteReel = (id: string) => {
  const currentReels = getReels();
  const nextReels = currentReels.filter((reel) => reel.id !== id);

  if (nextReels.length === currentReels.length) {
    return false;
  }

  saveReels(nextReels);
  return true;
};

export const getReelById = (id: string) => getReels().find((reel) => reel.id === id) ?? null;

export const clearReels = () => saveReels([]);

export const setReelsNotice = (message: string) => {
  if (canUseStorage()) {
    window.localStorage.setItem(NOTICE_KEY, message);
  }
};

export const consumeReelsNotice = () => {
  if (!canUseStorage()) {
    return "";
  }

  const message = window.localStorage.getItem(NOTICE_KEY) ?? "";
  window.localStorage.removeItem(NOTICE_KEY);
  return message;
};
