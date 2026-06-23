/**
 * dictRepo — rječnici + odrednice (§2 Rječnik).
 *
 * Referentni podatak (bez user_id/dirty/soft-delete). U v1.0 podržava
 * ručno dodavanje odrednica i LIKE pretragu. FTS5 indeks za velike
 * uvezene rječnike dolazi sa data-pipeline-om u Fazi 3 (§8).
 */
import { and, asc, eq, like, or } from 'drizzle-orm';

import { db } from '../client';
import {
  dictionaries,
  dictionaryEntries,
  type Dictionary,
  type DictionaryEntry,
} from '../schema';
import { newId } from './helpers';

// ---- dictionaries ----
export async function listDictionaries(): Promise<Dictionary[]> {
  return db.select().from(dictionaries).orderBy(asc(dictionaries.name));
}

export async function createDictionary(input: {
  name: string;
  langFrom?: string | null;
  langTo?: string | null;
}): Promise<Dictionary> {
  const row = { id: newId(), ...input };
  await db.insert(dictionaries).values(row);
  return row as Dictionary;
}

/** Vrati postojeći rječnik po imenu ili ga kreira (za ručne odrednice). */
export async function ensureDictionary(name: string): Promise<Dictionary> {
  const existing = await db
    .select()
    .from(dictionaries)
    .where(eq(dictionaries.name, name));
  if (existing[0]) return existing[0];
  return createDictionary({ name });
}

// ---- dictionary_entries ----
export type DictEntryInput = {
  dictionaryId: string;
  term: string;
  definition: string;
  pos?: string | null;
  exampleTerm?: string | null;
  exampleDefinition?: string | null;
};

export async function createDictEntry(
  input: DictEntryInput,
): Promise<DictionaryEntry> {
  const row = { id: newId(), ...input };
  await db.insert(dictionaryEntries).values(row);
  return row as DictionaryEntry;
}

export async function getDictEntry(
  id: string,
): Promise<DictionaryEntry | undefined> {
  const rows = await db
    .select()
    .from(dictionaryEntries)
    .where(eq(dictionaryEntries.id, id));
  return rows[0];
}

/**
 * Pretraga odrednica po pojmu ILI definiciji (LIKE, case-insensitive).
 * Opciono ograničeno na jedan rječnik.
 */
export async function searchDictEntries(
  query: string,
  dictionaryId?: string,
): Promise<DictionaryEntry[]> {
  const q = `%${query.trim()}%`;
  if (!query.trim()) return [];
  const match = or(
    like(dictionaryEntries.term, q),
    like(dictionaryEntries.definition, q),
  );
  const where = dictionaryId
    ? and(eq(dictionaryEntries.dictionaryId, dictionaryId), match)
    : match;
  return db
    .select()
    .from(dictionaryEntries)
    .where(where)
    .orderBy(asc(dictionaryEntries.term))
    .limit(50);
}
