/**
 * useElapsed — vraća proteklo vrijeme (sekunde) za aktivni startTime.
 * Prikaz se osvježava svake sekunde, ali vrijednost se UVIJEK računa iz
 * wall-clocka (now - startTime), pa je tačno i nakon pozadine/zaključavanja.
 */
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { elapsedSeconds } from '@/state/timerStore';

export function useElapsed(startTime: string | null | undefined): number {
  const [seconds, setSeconds] = useState(() =>
    startTime ? elapsedSeconds(startTime) : 0,
  );

  useEffect(() => {
    if (!startTime) {
      setSeconds(0);
      return;
    }
    const tick = () => setSeconds(elapsedSeconds(startTime));
    tick();
    const interval = setInterval(tick, 1000);
    // Pri povratku iz pozadine odmah preračunaj (interval je tamo pauziran).
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') tick();
    });
    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [startTime]);

  return seconds;
}
