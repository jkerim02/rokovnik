/** Oznake i redoslijed statusa knjige. */
import type { Book } from '@/db/schema';

export type BookStatus = NonNullable<Book['status']>;

export const STATUS_LABELS: Record<BookStatus, string> = {
  'za-citati': 'Za čitati',
  citam: 'Čitam',
  procitano: 'Pročitano',
};

export const STATUS_ORDER: BookStatus[] = ['citam', 'za-citati', 'procitano'];

export function statusLabel(status: Book['status']): string {
  return status ? STATUS_LABELS[status] : '—';
}
