/**
 * context/ThemeContext.jsx
 * Provides { dark, toggleTheme } via React context.
 * Initialises from localStorage, defaults to light.
 */

import { createContext, useCallback, useEffect, useState } from "react";
import { applyTheme } from "@/theme";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("portfolio-theme");
      return stored ? stored === "dark" : false;
    } catch {
      return false;
    }
  });

  const [zenMode, setZenMode] = useState(() => {
    try {
      const stored = localStorage.getItem("portfolio-zen-mode");
      return stored === "true";
    } catch {
      return false;
    }
  });

  // Apply CSS vars whenever dark changes
  useEffect(() => {
    applyTheme(dark ? "dark" : "light");
    try {
      localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark]);

  // Persist zenMode
  useEffect(() => {
    try {
      localStorage.setItem("portfolio-zen-mode", zenMode ? "true" : "false");
    } catch {
      /* ignore */
    }
  }, [zenMode]);

  const toggleTheme = useCallback(() => setDark((prev) => !prev), []);
  const toggleZenMode = useCallback(() => setZenMode((prev) => !prev), []);

  return (
    <ThemeContext.Provider
      value={{ dark, toggleTheme, zenMode, toggleZenMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
