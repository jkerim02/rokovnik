/** Kategorije bilješki — oznake i tačka-boje (§2, §17). */
import { categoryColors, type NoteCategory } from '@/theme';
import type { Note } from '@/db/schema';

export const CATEGORY_LABELS: Record<NoteCategory, string> = {
  citat: 'Citat',
  misao: 'Misao',
  pitanje: 'Pitanje',
  misljenje: 'Razmišljanje',
};

export const CATEGORY_ORDER: NoteCategory[] = [
  'citat',
  'misao',
  'pitanje',
  'misljenje',
];

export function categoryColor(category: Note['category']): string {
  return category ? categoryColors[category] : categoryColors.misao;
}

export function categoryLabel(category: Note['category']): string {
  return category ? CATEGORY_LABELS[category] : '—';
}
