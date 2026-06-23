/**
 * timerStore — aktivna sesija čitanja (§3).
 *
 * Ključno: tajmer NE zavisi od setInterval. Čuva se `startTime` (wall-clock
 * ISO timestamp). Proteklo vrijeme se uvijek računa kao now - startTime, pa
 * preživljava pozadinu/zaključavanje/restart aplikacije. Persistuje se u
 * AsyncStorage da aktivna sesija preživi i potpuno zatvaranje app-a.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ActiveTimer = {
  bookId: string;
  bookTitle: string;
  startTime: string; // ISO 8601
};

type TimerState = {
  active: ActiveTimer | null;
  start: (bookId: string, bookTitle: string) => void;
  /** Zaustavi i vrati podatke sesije (start/kraj/trajanje u minutama). */
  stop: () => { startTime: string; endTime: string; durationMinutes: number } | null;
  cancel: () => void;
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      active: null,
      start: (bookId, bookTitle) => {
        if (get().active) return; // samo jedna aktivna sesija
        set({ active: { bookId, bookTitle, startTime: new Date().toISOString() } });
      },
      stop: () => {
        const active = get().active;
        if (!active) return null;
        const endTime = new Date().toISOString();
        const durationMs =
          new Date(endTime).getTime() - new Date(active.startTime).getTime();
        const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
        set({ active: null });
        return { startTime: active.startTime, endTime, durationMinutes };
      },
      cancel: () => set({ active: null }),
    }),
    {
      name: 'usputnik-active-timer',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/** Proteklo vrijeme (sekunde) za dati startTime — računa se iz wall-clocka. */
export function elapsedSeconds(startTime: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));
}

/** Format mm:ss ili h:mm:ss. */
export function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
