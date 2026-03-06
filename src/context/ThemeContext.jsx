/**
 * context/ThemeContext.jsx
 * Provides { dark, toggleTheme } via React context.
 * Initialises from localStorage, defaults to light.
 */

import { createContext, useCallback, useEffect, useState } from 'react';
import { applyTheme } from '@/theme';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem('portfolio-theme');
      return stored ? stored === 'dark' : false; // default: light
    } catch {
      return false;
    }
  });

  // Apply CSS vars whenever dark changes
  useEffect(() => {
    applyTheme(dark ? 'dark' : 'light');
    try {
      localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
    } catch { /* ignore */ }
  }, [dark]);

  const toggleTheme = useCallback(() => setDark((prev) => !prev), []);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
