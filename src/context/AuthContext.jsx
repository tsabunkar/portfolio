import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";
const SESSION_KEY = "admin_jwt";

function decodePayload(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function isExpired(payload) {
  return !payload || !payload.exp || payload.exp * 1000 < Date.now();
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const payload = decodePayload(stored);
    if (isExpired(payload)) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return stored;
  });

  const payload = useMemo(() => (token ? decodePayload(token) : null), [token]);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem(SESSION_KEY, token);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [token]);

  const login = useCallback(async (username, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Login failed");
    }
    const data = await res.json();
    setToken(data.token);
    return data.token;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const authedFetch = useCallback(
    async (path, options = {}) => {
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        setToken(null);
        throw new Error("Session expired");
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed: ${res.status}`);
      }
      return res.json();
    },
    [token],
  );

  const value = useMemo(
    () => ({ token, payload, isAuthenticated: !!token, login, logout, authedFetch }),
    [token, payload, login, logout, authedFetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
