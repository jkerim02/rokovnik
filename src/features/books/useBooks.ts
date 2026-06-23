/** useBooks — učitava knjige iz lokalne baze, sa ručnim refresh-om. */
import { useCallback, useEffect, useState } from 'react';

import { booksRepo } from '@/db/repositories';
import type { Book } from '@/db/schema';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await booksRepo.listBooks();
    setBooks(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { books, loading, refresh };
}

export function useBook(id: string | undefined) {
  const [book, setBook] = useState<Book | undefined>();
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setBook(await booksRepo.getBook(id));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { book, loading, refresh };
}
