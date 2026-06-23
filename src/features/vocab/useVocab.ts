/** Hooks za vokabular: liste (decks) i pojmovi unutar deck-a. */
import { useCallback, useEffect, useState } from 'react';

import { vocabRepo } from '@/db/repositories';
import type { Deck, VocabEntry } from '@/db/schema';

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setDecks(await vocabRepo.listDecks());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { decks, loading, refresh };
}

export function useDeck(deckId: string | undefined) {
  const [deck, setDeck] = useState<Deck | undefined>();
  const [entries, setEntries] = useState<VocabEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!deckId) {
      setLoading(false);
      return;
    }
    const [d, e] = await Promise.all([
      vocabRepo.getDeck(deckId),
      vocabRepo.listVocabForDeck(deckId),
    ]);
    setDeck(d);
    setEntries(e);
    setLoading(false);
  }, [deckId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { deck, entries, loading, refresh };
}
