import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyAttribute = (theme: Theme): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
};

export interface ThemeProviderProps {
  /** Initial theme. Defaults to `light`. */
  defaultTheme?: Theme;
  children: React.ReactNode;
}

/**
 * Optional programmatic theme control: sets `data-theme` on <html> and exposes
 * it via useTheme(). Theming itself is pure CSS variables, so this adds
 * negligible JS and is entirely optional - apps can set `data-theme` in their
 * own HTML and never import this.
 */
export function ThemeProvider({defaultTheme = 'light', children}: ThemeProviderProps): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  useEffect(() => {
    applyAttribute(theme);
  }, [theme]);
  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggle = useCallback(() => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark')), []);
  return <ThemeContext.Provider value={{theme, setTheme, toggle}}>{children}</ThemeContext.Provider>;
}

/** Read and control the current theme. Requires a ThemeProvider ancestor. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. For attribute-only theming, set data-theme on <html> and skip the hook.',
    );
  }
  return ctx;
}
