"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

const AuthContext = createContext(null);

function readStoredAuth() {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    return { token, user };
  } catch (_err) {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(() => readStoredAuth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setAuth(readStoredAuth());
    setAuthReady(true);
  }, []);

  const persist = useCallback((nextToken, nextUser) => {
    if (typeof window === "undefined") return;
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const clearErrorSoon = useCallback(() => {
    if (error) {
      setTimeout(() => setError(""), 2000);
    }
  }, [error]);

  useEffect(() => {
    clearErrorSoon();
  }, [clearErrorSoon]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token: t, user: u } = res.data?.data || {};
      if (!t || !u) throw new Error("Invalid login response");
      setAuth({ token: t, user: u });
      persist(t, u);
      return { token: t, user: u };
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Login failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const signup = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/signup", { email, password });
      const { token: t, user: u } = res.data?.data || {};
      if (!t || !u) throw new Error("Invalid signup response");
      setAuth({ token: t, user: u });
      persist(t, u);
      return { token: t, user: u };
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Signup failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const logout = useCallback(() => {
    setAuth({ token: null, user: null });
    persist(null, null);
  }, [persist]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      authReady,
      isAuthenticated: !!token,
      login,
      signup,
      logout,
      setError,
    }),
    [authReady, error, loading, login, logout, setError, signup, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
