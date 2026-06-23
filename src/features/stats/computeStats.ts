/**
 * computeStats — čista logika statistike čitanja (§3).
 * Radi nad već agregiranim podacima iz sessionsRepo (minute po danu/knjizi).
 */
import {
  differenceInCalendarDays,
  isAfter,
  parseISO,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';

export const PERIOD_LABELS: Record<Period, string> = {
  day: 'Dan',
  week: 'Sedmica',
  month: 'Mjesec',
  year: 'Godina',
  all: 'Sve',
};

export const PERIOD_ORDER: Period[] = ['day', 'week', 'month', 'year', 'all'];

function periodStart(period: Period, now = new Date()): Date | null {
  switch (period) {
    case 'day':
      return startOfDay(now);
    case 'week':
      return subWeeks(now, 1);
    case 'month':
      return subMonths(now, 1);
    case 'year':
      return subYears(now, 1);
    case 'all':
      return null;
  }
}

/** Zbroj minuta u zadatom periodu (po danima YYYY-MM-DD). */
export function minutesInPeriod(
  perDay: { day: string; minutes: number }[],
  period: Period,
  now = new Date(),
): number {
  const start = periodStart(period, now);
  return perDay.reduce((sum, d) => {
    if (!d.day) return sum;
    const date = parseISO(d.day);
    if (start && !isAfter(date, subDays(start, 1))) return sum;
    return sum + d.minutes;
  }, 0);
}

/**
 * Reading streak — broj uzastopnih dana (zaključno sa danas ili jučer) sa
 * barem jednom sesijom. Ako danas nema sesije ali jučer ima, streak i dalje
 * vrijedi (dan još traje).
 */
export function readingStreak(
  perDay: { day: string; minutes: number }[],
  now = new Date(),
): number {
  const days = new Set(
    perDay.filter((d) => d.day && d.minutes > 0).map((d) => d.day),
  );
  if (days.size === 0) return 0;

  const today = startOfDay(now);
  // Početna referentna tačka: danas ako postoji, inače jučer.
  let cursor = today;
  const iso = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`;

  if (!days.has(iso(today))) {
    const yesterday = subDays(today, 1);
    if (!days.has(iso(yesterday))) return 0;
    cursor = yesterday;
  }

  let streak = 0;
  while (days.has(iso(cursor))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}min`;
}

/** Dani od prvog do posljednjeg dana sa sesijom (za uvid u raspon). */
export function daysSpan(perDay: { day: string }[]): number {
  const valid = perDay.filter((d) => d.day).map((d) => parseISO(d.day));
  if (valid.length < 2) return valid.length;
  const sorted = valid.sort((a, b) => a.getTime() - b.getTime());
  return differenceInCalendarDays(sorted[sorted.length - 1], sorted[0]) + 1;
}
