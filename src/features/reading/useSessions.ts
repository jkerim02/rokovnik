/** useSessions — sesije čitanja jedne knjige. */
import { useCallback, useEffect, useState } from 'react';

import { sessionsRepo } from '@/db/repositories';
import type { ReadingSession } from '@/db/schema';

export function useBookSessions(bookId: string | undefined) {
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!bookId) {
      setLoading(false);
      return;
    }
    setSessions(await sessionsRepo.listSessionsForBook(bookId));
    setLoading(false);
  }, [bookId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { sessions, loading, refresh };
}
