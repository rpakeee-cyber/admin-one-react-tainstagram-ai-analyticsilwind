"use client";

import { useCallback, useEffect, useState } from "react";
import { getReels, REELS_CHANGED_EVENT } from "../services/reelsStorage";
import type { Reel } from "../types";

export const useReels = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(() => {
    setReels(getReels());
    setIsReady(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(REELS_CHANGED_EVENT, refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(REELS_CHANGED_EVENT, refresh);
    };
  }, [refresh]);

  return { reels, isReady, refresh };
};
