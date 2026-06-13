"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChange } from "../services/authService";
import { getReels, REELS_CHANGED_EVENT } from "../services/reelsDataProvider";
import type { Reel } from "../types";

export const useReels = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setReels(await getReels());
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Не удалось загрузить Reels.",
      );
    } finally {
      setIsReady(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      void refresh();
    };

    void refresh();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(REELS_CHANGED_EVENT, handleStorageChange);
    const unsubscribeAuth = onAuthStateChange(() => {
      void refresh();
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(REELS_CHANGED_EVENT, handleStorageChange);
      unsubscribeAuth();
    };
  }, [refresh]);

  return { reels, isReady, isLoading, error, refresh };
};
