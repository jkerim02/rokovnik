/**
 * Tema — dizajn tokeni (Usputnik)
 *
 * Paleta: crna–bijela–zelena (§2 arhitekture).
 * - Iste ključeve dijele light i dark (bg, surface, surfaceAlt, ink, muted, line, accent, accentInk).
 * - `category` — suptilne tačka-boje za kategorije bilješki (Citat/Misao/Pitanje/Razmišljanje).
 * - `error` (crvena) — koristi se ISKLJUČIVO za grešku u kvizu, nigdje drugdje.
 *
 * Komponente NE koriste hardkodirane boje — uvijek `const { theme } = useTheme()`.
 */

export type ThemeColors = {
  /** Pozadina ekrana */
  bg: string;
  /** Površina kartica/panela */
  surface: string;
  /** Alternativna površina (npr. zaglavlja, uvučeni paneli) */
  surfaceAlt: string;
  /** Primarni tekst */
  ink: string;
  /** Sekundarni/utišani tekst */
  muted: string;
  /** Linije, ivice, separatori, perforacije */
  line: string;
  /** Akcent (zelena) — primarne akcije, aktivni tab */
  accent: string;
  /** Tekst/ikona na akcent pozadini */
  accentInk: string;
};

/** Boje kategorija bilješki — iste u oba moda (suptilne tačke). */
export const categoryColors = {
  citat: '#3E7D5A', // zelena nijansa
  misao: '#C9A227', // toplo žuta
  pitanje: '#3F6FB0', // plava
  misljenje: '#8A5BB0', // ljubičasta
} as const;

export type NoteCategory = keyof typeof categoryColors;

/** Crvena — SAMO za grešku u kvizu. */
export const errorRed = '#C0392B';

export const lightTheme: ThemeColors = {
  bg: '#F7F7F4',
  surface: '#FFFFFF',
  surfaceAlt: '#EFEFEA',
  ink: '#1A1A1A',
  muted: '#6B6B66',
  line: '#D9D9D2',
  accent: '#2E7D4F',
  accentInk: '#FFFFFF',
};

export const darkTheme: ThemeColors = {
  bg: '#121311',
  surface: '#1C1E1B',
  surfaceAlt: '#262925',
  ink: '#F2F2EE',
  muted: '#9A9A93',
  line: '#34372F',
  accent: '#4FAE78',
  accentInk: '#0E0F0D',
};

export type ThemeMode = 'light' | 'dark';

export const themes: Record<ThemeMode, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
};
