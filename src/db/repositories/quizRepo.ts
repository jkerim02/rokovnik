/**
 * quizRepo — agregatne statistike kviza (quiz_stats), jedan red po modu.
 * Bilježi best_streak / total_correct / total_attempts (§6).
 */
import { eq } from 'drizzle-orm';

import { db } from '../client';
import { quizStats, type QuizStat } from '../schema';
import { newId, nowIso } from './helpers';

export type QuizMode = 'vocab' | 'notes';

async function ensureStat(mode: QuizMode): Promise<QuizStat> {
  const rows = await db
    .select()
    .from(quizStats)
    .where(eq(quizStats.mode, mode));
  if (rows[0]) return rows[0];

  const row = {
    id: newId(),
    mode,
    bestStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0,
    updatedAt: nowIso(),
    dirty: 1 as const,
  };
  await db.insert(quizStats).values(row);
  return row as QuizStat;
}

export async function getStat(mode: QuizMode): Promise<QuizStat> {
  return ensureStat(mode);
}

/**
 * Upiši rezultat odigrane runde: koliko tačnih od koliko pokušaja i
 * najbolji streak u toj rundi (best_streak se čuva kao maksimum dosad).
 */
export async function recordRound(
  mode: QuizMode,
  args: { correct: number; attempts: number; roundBestStreak: number },
): Promise<void> {
  const stat = await ensureStat(mode);
  await db
    .update(quizStats)
    .set({
      totalCorrect: stat.totalCorrect + args.correct,
      totalAttempts: stat.totalAttempts + args.attempts,
      bestStreak: Math.max(stat.bestStreak, args.roundBestStreak),
      updatedAt: nowIso(),
      dirty: 1,
    })
    .where(eq(quizStats.id, stat.id));
}
