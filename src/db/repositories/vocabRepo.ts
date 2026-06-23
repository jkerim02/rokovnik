/**
 * vocabRepo — decks + vocab_entries (§2 Vokabular).
 * Deck može biti vezan za knjigu (book_id) ili samostalan.
 */
import { and, asc, eq, isNull } from 'drizzle-orm';

import { db } from '../client';
import {
  decks,
  vocabEntries,
  type Deck,
  type NewDeck,
  type NewVocabEntry,
  type VocabEntry,
} from '../schema';
import { insertMeta, softDeleteMeta, updateMeta } from './helpers';

export type DeckInput = Omit<
  NewDeck,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'dirty' | 'userId'
>;
export type VocabInput = Omit<
  NewVocabEntry,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'dirty' | 'userId'
>;

// ---- decks ----
export async function listDecks(): Promise<Deck[]> {
  return db
    .select()
    .from(decks)
    .where(isNull(decks.deletedAt))
    .orderBy(asc(decks.name));
}

export async function getDeck(id: string): Promise<Deck | undefined> {
  const rows = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, id), isNull(decks.deletedAt)));
  return rows[0];
}

export async function createDeck(input: DeckInput): Promise<Deck> {
  const row = { ...input, ...insertMeta() };
  await db.insert(decks).values(row);
  const created = await getDeck(row.id);
  if (!created) throw new Error('createDeck: insert failed');
  return created;
}

export async function updateDeck(
  id: string,
  patch: Partial<DeckInput>,
): Promise<void> {
  await db
    .update(decks)
    .set({ ...patch, ...updateMeta() })
    .where(eq(decks.id, id));
}

export async function deleteDeck(id: string): Promise<void> {
  await db.update(decks).set(softDeleteMeta()).where(eq(decks.id, id));
}

// ---- vocab_entries ----
export async function listVocabForDeck(deckId: string): Promise<VocabEntry[]> {
  return db
    .select()
    .from(vocabEntries)
    .where(and(eq(vocabEntries.deckId, deckId), isNull(vocabEntries.deletedAt)))
    .orderBy(asc(vocabEntries.word));
}

export async function listAllVocab(): Promise<VocabEntry[]> {
  return db
    .select()
    .from(vocabEntries)
    .where(isNull(vocabEntries.deletedAt))
    .orderBy(asc(vocabEntries.word));
}

export async function getVocab(id: string): Promise<VocabEntry | undefined> {
  const rows = await db
    .select()
    .from(vocabEntries)
    .where(and(eq(vocabEntries.id, id), isNull(vocabEntries.deletedAt)));
  return rows[0];
}

export async function createVocab(input: VocabInput): Promise<VocabEntry> {
  const row = { ...input, ...insertMeta() };
  await db.insert(vocabEntries).values(row);
  const created = await getVocab(row.id);
  if (!created) throw new Error('createVocab: insert failed');
  return created;
}

export async function updateVocab(
  id: string,
  patch: Partial<VocabInput>,
): Promise<void> {
  await db
    .update(vocabEntries)
    .set({ ...patch, ...updateMeta() })
    .where(eq(vocabEntries.id, id));
}

export async function deleteVocab(id: string): Promise<void> {
  await db
    .update(vocabEntries)
    .set(softDeleteMeta())
    .where(eq(vocabEntries.id, id));
}
