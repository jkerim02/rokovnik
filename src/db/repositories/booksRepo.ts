/**
 * booksRepo — CRUD za knjige (§2 Biblioteka).
 * Sve liste filtriraju soft-obrisane (deleted_at IS NULL).
 */
import { and, desc, eq, isNull } from 'drizzle-orm';

import { db } from '../client';
import { books, type Book, type NewBook } from '../schema';
import { insertMeta, softDeleteMeta, updateMeta } from './helpers';

export type BookInput = Omit<
  NewBook,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'dirty' | 'userId'
>;

export async function listBooks(): Promise<Book[]> {
  return db
    .select()
    .from(books)
    .where(isNull(books.deletedAt))
    .orderBy(desc(books.updatedAt));
}

export async function getBook(id: string): Promise<Book | undefined> {
  const rows = await db
    .select()
    .from(books)
    .where(and(eq(books.id, id), isNull(books.deletedAt)));
  return rows[0];
}

export async function createBook(input: BookInput): Promise<Book> {
  const row = { ...input, ...insertMeta() };
  await db.insert(books).values(row);
  const created = await getBook(row.id);
  if (!created) throw new Error('createBook: insert failed');
  return created;
}

export async function updateBook(
  id: string,
  patch: Partial<BookInput>,
): Promise<void> {
  await db
    .update(books)
    .set({ ...patch, ...updateMeta() })
    .where(eq(books.id, id));
}

export async function deleteBook(id: string): Promise<void> {
  await db.update(books).set(softDeleteMeta()).where(eq(books.id, id));
}

export async function listBooksByStatus(
  status: NonNullable<Book['status']>,
): Promise<Book[]> {
  return db
    .select()
    .from(books)
    .where(and(eq(books.status, status), isNull(books.deletedAt)))
    .orderBy(desc(books.updatedAt));
}
