/**
 * notesRepo — bilješke po stranici, vezane za knjigu (§2 Bilješke).
 */
import { and, asc, desc, eq, isNull } from 'drizzle-orm';

import { db } from '../client';
import { notes, type NewNote, type Note } from '../schema';
import { insertMeta, softDeleteMeta, updateMeta } from './helpers';

export type NoteInput = Omit<
  NewNote,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'dirty' | 'userId'
>;

/** Bilješke jedne knjige, sortirane po stranici pa po vremenu. */
export async function listNotesForBook(bookId: string): Promise<Note[]> {
  return db
    .select()
    .from(notes)
    .where(and(eq(notes.bookId, bookId), isNull(notes.deletedAt)))
    .orderBy(asc(notes.page), asc(notes.createdAt));
}

/** Sve bilješke određene kategorije (npr. svi citati — koristi kviz). */
export async function listNotesByCategory(
  category: NonNullable<Note['category']>,
): Promise<Note[]> {
  return db
    .select()
    .from(notes)
    .where(and(eq(notes.category, category), isNull(notes.deletedAt)))
    .orderBy(desc(notes.createdAt));
}

export async function getNote(id: string): Promise<Note | undefined> {
  const rows = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), isNull(notes.deletedAt)));
  return rows[0];
}

export async function createNote(input: NoteInput): Promise<Note> {
  const row = { ...input, ...insertMeta() };
  await db.insert(notes).values(row);
  const created = await getNote(row.id);
  if (!created) throw new Error('createNote: insert failed');
  return created;
}

export async function updateNote(
  id: string,
  patch: Partial<NoteInput>,
): Promise<void> {
  await db
    .update(notes)
    .set({ ...patch, ...updateMeta() })
    .where(eq(notes.id, id));
}

export async function deleteNote(id: string): Promise<void> {
  await db.update(notes).set(softDeleteMeta()).where(eq(notes.id, id));
}
