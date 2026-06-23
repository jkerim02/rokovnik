/**
 * Drizzle šema — SQLite (lokalni izvor istine za UI).
 *
 * Mapira §6 arhitekture 1:1. Konvencije:
 *  - id: text, UUIDv4 generisan na klijentu
 *  - user_id: text not null default 'local' (Faza 2: backfill stvarnim uuid-em, RLS)
 *  - created_at/updated_at/deleted_at: ISO 8601 text (sortabilno; mapira na Postgres timestamptz)
 *  - dirty: integer 0/1, lokalni "nesinhronizovano" flag (u v1.0 se piše, ne čita)
 *
 * Rječnik (dictionaries / dictionary_entries) je referentni podatak —
 * NEMA user_id/dirty (sync ide samo Supabase → telefon u Fazi 2).
 */
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const LOCAL_USER = "'local'";

/** Zajedničke sync kolone za korisničke tabele. */
const syncColumns = {
  userId: text('user_id').notNull().default(sql`${sql.raw(LOCAL_USER)}`),
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  deletedAt: text('deleted_at'),
  dirty: integer('dirty').notNull().default(1),
};

// ---- books ----
export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  ...syncColumns,
  title: text('title').notNull(),
  author: text('author'),
  publisher: text('publisher'),
  edition: text('edition'),
  pages: integer('pages'),
  description: text('description'),
  startDate: text('start_date'), // ISO date
  endDate: text('end_date'),
  status: text('status', { enum: ['za-citati', 'citam', 'procitano'] }),
  coverLocalPath: text('cover_local_path'),
  coverRemoteUrl: text('cover_remote_url'), // popunjava se tek u Fazi 2
});

// ---- notes ----
export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  ...syncColumns,
  bookId: text('book_id').references(() => books.id),
  page: integer('page'),
  category: text('category', {
    enum: ['citat', 'misao', 'pitanje', 'misljenje'],
  }),
  text: text('text').notNull(),
});

// ---- decks ----
export const decks = sqliteTable('decks', {
  id: text('id').primaryKey(),
  ...syncColumns,
  name: text('name').notNull(),
  bookId: text('book_id').references(() => books.id), // nullable
});

// ---- vocab_entries ----
export const vocabEntries = sqliteTable('vocab_entries', {
  id: text('id').primaryKey(),
  ...syncColumns,
  deckId: text('deck_id').references(() => decks.id),
  source: text('source', { enum: ['dict', 'custom'] }),
  dictEntryId: text('dict_entry_id'), // -> dictionary_entries.id (nullable)
  word: text('word').notNull(),
  meaning: text('meaning').notNull(),
  pos: text('pos'),
  note: text('note'),
});

// ---- dictionaries (referentni podatak; bez user_id/dirty) ----
export const dictionaries = sqliteTable('dictionaries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  langFrom: text('lang_from'),
  langTo: text('lang_to'), // nullable za monolingvalne
});

// ---- dictionary_entries (referentni podatak; bez user_id/dirty) ----
export const dictionaryEntries = sqliteTable('dictionary_entries', {
  id: text('id').primaryKey(),
  dictionaryId: text('dictionary_id').references(() => dictionaries.id),
  term: text('term').notNull(),
  definition: text('definition').notNull(),
  pos: text('pos'),
  exampleTerm: text('example_term'),
  exampleDefinition: text('example_definition'),
});

// ---- reading_sessions ----
export const readingSessions = sqliteTable('reading_sessions', {
  id: text('id').primaryKey(),
  ...syncColumns,
  bookId: text('book_id').references(() => books.id),
  source: text('source', { enum: ['timer', 'manual'] }),
  startTime: text('start_time'),
  endTime: text('end_time'),
  durationMinutes: integer('duration_minutes'),
  pagesRead: integer('pages_read'),
  note: text('note'),
});

// ---- quiz_stats (jedan red po (user_id, mode)) ----
export const quizStats = sqliteTable('quiz_stats', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().default(sql`${sql.raw(LOCAL_USER)}`),
  mode: text('mode', { enum: ['vocab', 'notes'] }),
  bestStreak: integer('best_streak').notNull().default(0),
  totalCorrect: integer('total_correct').notNull().default(0),
  totalAttempts: integer('total_attempts').notNull().default(0),
  updatedAt: text('updated_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  dirty: integer('dirty').notNull().default(1),
});

// ---- user_settings ----
export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().default(sql`${sql.raw(LOCAL_USER)}`),
  themeOverride: text('theme_override', { enum: ['light', 'dark'] }), // null = sistem
  lastSyncedAt: text('last_synced_at'),
  updatedAt: text('updated_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  dirty: integer('dirty').notNull().default(1),
});

// ---- Tipovi (inferirani iz šeme) ----
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type Deck = typeof decks.$inferSelect;
export type NewDeck = typeof decks.$inferInsert;
export type VocabEntry = typeof vocabEntries.$inferSelect;
export type NewVocabEntry = typeof vocabEntries.$inferInsert;
export type Dictionary = typeof dictionaries.$inferSelect;
export type DictionaryEntry = typeof dictionaryEntries.$inferSelect;
export type ReadingSession = typeof readingSessions.$inferSelect;
export type NewReadingSession = typeof readingSessions.$inferInsert;
export type QuizStat = typeof quizStats.$inferSelect;
export type UserSetting = typeof userSettings.$inferSelect;
