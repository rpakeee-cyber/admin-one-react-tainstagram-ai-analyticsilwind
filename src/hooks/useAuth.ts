"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type AuthSession,
  type AuthUser,
  getSession,
  onAuthStateChange,
  signInWithEmail as sendMagicLink,
  signInWithGoogle as startGoogleSignIn,
  signOut as endSession,
} from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    void getSession()
      .then((currentSession) => {
        if (!isMounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      })
      .catch((sessionError) => {
        if (!isMounted) return;
        setError(
          sessionError instanceof Error ? sessionError.message : "Не удалось проверить сессию.",
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    const unsubscribe = onAuthStateChange((_, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
      setError("");
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError("");
    try {
      await sendMagicLink(email);
    } catch (signInError) {
      const message =
        signInError instanceof Error ? signInError.message : "Не удалось отправить ссылку.";
      setError(message);
      throw signInError;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await startGoogleSignIn();
    } catch (signInError) {
      const message =
        signInError instanceof Error ? signInError.message : "Не удалось войти через Google.";
      setError(message);
      throw signInError;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await endSession();
      setSession(null);
      setUser(null);
    } catch (signOutError) {
      const message = signOutError instanceof Error ? signOutError.message : "Не удалось выйти.";
      setError(message);
      throw signOutError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: Boolean(user),
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };
};