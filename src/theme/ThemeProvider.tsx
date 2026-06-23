/**
 * ThemeProvider — React Context za temu (§10 arhitekture).
 *
 * Logika izbora moda:
 *   override ('light' | 'dark')  →  koristi njega
 *   override === null             →  prati sistemsku temu (useColorScheme)
 *
 * `override` se u Fazi 1 čuva u memoriji + (kad DB sloj postoji) u
 * `user_settings.theme_override`. Provider prima opcioni `initialOverride`
 * i `onOverrideChange` callback tako da perzistencija ostane van teme.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import { themes, type ThemeColors, type ThemeMode } from './tokens';

export type ThemeOverride = ThemeMode | null;

type ThemeContextValue = {
  /** Aktivne boje (već razriješene light/dark). */
  theme: ThemeColors;
  /** Trenutni efektivni mod. */
  mode: ThemeMode;
  /** Korisnički override; null = prati sistem. */
  override: ThemeOverride;
  /** Postavi override (null da se vrati na sistemski). */
  setOverride: (override: ThemeOverride) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
  /** Početni override (npr. učitan iz baze pri startu). */
  initialOverride?: ThemeOverride;
  /** Poziva se kad se override promijeni (za perzistenciju u bazu). */
  onOverrideChange?: (override: ThemeOverride) => void;
};

export function ThemeProvider({
  children,
  initialOverride = null,
  onOverrideChange,
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [override, setOverrideState] = useState<ThemeOverride>(initialOverride);

  const setOverride = useCallback(
    (next: ThemeOverride) => {
      setOverrideState(next);
      onOverrideChange?.(next);
    },
    [onOverrideChange],
  );

  const value = useMemo<ThemeContextValue>(() => {
    const mode: ThemeMode = override ?? (systemScheme === 'dark' ? 'dark' : 'light');
    return {
      theme: themes[mode],
      mode,
      override,
      setOverride,
    };
  }, [override, systemScheme, setOverride]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}
