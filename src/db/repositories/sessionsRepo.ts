/**
 * sessionsRepo — sesije čitanja (§3). Oba izvora (timer/manual) pišu ovdje;
 * statistika se ne grana po `source`. Sadrži i agregacione upite za §3 statistiku.
 */
import { and, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '../client';
import {
  readingSessions,
  type NewReadingSession,
  type ReadingSession,
} from '../schema';
import { insertMeta, softDeleteMeta, updateMeta } from './helpers';

export type SessionInput = Omit<
  NewReadingSession,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'dirty' | 'userId'
>;

export async function listSessions(): Promise<ReadingSession[]> {
  return db
    .select()
    .from(readingSessions)
    .where(isNull(readingSessions.deletedAt))
    .orderBy(desc(readingSessions.startTime));
}

export async function listSessionsForBook(
  bookId: string,
): Promise<ReadingSession[]> {
  return db
    .select()
    .from(readingSessions)
    .where(
      and(eq(readingSessions.bookId, bookId), isNull(readingSessions.deletedAt)),
    )
    .orderBy(desc(readingSessions.startTime));
}

export async function createSession(
  input: SessionInput,
): Promise<ReadingSession> {
  const row = { ...input, ...insertMeta() };
  await db.insert(readingSessions).values(row);
  const rows = await db
    .select()
    .from(readingSessions)
    .where(eq(readingSessions.id, row.id));
  if (!rows[0]) throw new Error('createSession: insert failed');
  return rows[0];
}

export async function updateSession(
  id: string,
  patch: Partial<SessionInput>,
): Promise<void> {
  await db
    .update(readingSessions)
    .set({ ...patch, ...updateMeta() })
    .where(eq(readingSessions.id, id));
}

export async function deleteSession(id: string): Promise<void> {
  await db
    .update(readingSessions)
    .set(softDeleteMeta())
    .where(eq(readingSessions.id, id));
}

// ---- Agregacije za statistiku (§3) ----

/** Ukupno minuta čitanja (sve sesije). */
export async function totalMinutes(): Promise<number> {
  const rows = await db
    .select({
      total: sql<number>`coalesce(sum(${readingSessions.durationMinutes}), 0)`,
    })
    .from(readingSessions)
    .where(isNull(readingSessions.deletedAt));
  return rows[0]?.total ?? 0;
}

/** Minute po knjizi: koja je knjiga "pojela" najviše vremena. */
export async function minutesPerBook(): Promise<
  { bookId: string | null; minutes: number }[]
> {
  return db
    .select({
      bookId: readingSessions.bookId,
      minutes: sql<number>`coalesce(sum(${readingSessions.durationMinutes}), 0)`,
    })
    .from(readingSessions)
    .where(isNull(readingSessions.deletedAt))
    .groupBy(readingSessions.bookId)
    .orderBy(desc(sql`sum(${readingSessions.durationMinutes})`));
}

/**
 * Minute grupisane po danu (YYYY-MM-DD, lokalno po start_time).
 * Koristi se za period-statistiku i reading streak.
 */
export async function minutesPerDay(): Promise<
  { day: string; minutes: number }[]
> {
  return db
    .select({
      day: sql<string>`date(${readingSessions.startTime})`,
      minutes: sql<number>`coalesce(sum(${readingSessions.durationMinutes}), 0)`,
    })
    .from(readingSessions)
    .where(
      and(
        isNull(readingSessions.deletedAt),
        sql`${readingSessions.startTime} is not null`,
      ),
    )
    .groupBy(sql`date(${readingSessions.startTime})`)
    .orderBy(desc(sql`date(${readingSessions.startTime})`));
}
