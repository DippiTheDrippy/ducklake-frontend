import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import type { ThemeContextType } from "./ThemeContext";
import { ThemeContext } from "./ThemeContext";
import { darkTheme, lightTheme } from "../styles";

const STORAGE_KEY = "isDark";

function getSystemPrefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function getStoredThemePreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === "true") return true;
    if (stored === "false") return false;

    return getSystemPrefersDark();
  } catch {
    return getSystemPrefersDark();
  }
}

function storeThemePreference(isDark: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(isDark));
  } catch {
    // Ignore storage failures, for example private browsing restrictions.
  }
}

export function ThemeProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(getStoredThemePreference());
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !(prev ?? false);
      storeThemePreference(next);
      return next;
    });
  }, []);

  const theme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  const value = useMemo<ThemeContextType>(
    () => ({
      isDark: Boolean(isDark),
      theme,
      toggleTheme,
    }),
    [isDark, theme, toggleTheme],
  );

  if (isDark === null) return null;

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}