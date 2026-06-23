/** useNotes — bilješke jedne knjige iz lokalne baze. */
import { useCallback, useEffect, useState } from 'react';

import { notesRepo } from '@/db/repositories';
import type { Note } from '@/db/schema';

export function useNotes(bookId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!bookId) {
      setLoading(false);
      return;
    }
    setNotes(await notesRepo.listNotesForBook(bookId));
    setLoading(false);
  }, [bookId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { notes, loading, refresh };
}
