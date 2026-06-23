import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, EmptyState, Field, Screen, Text } from '@/components/ui';
import { dictRepo } from '@/db/repositories';
import type { DictionaryEntry } from '@/db/schema';
import { useTheme } from '@/theme';

export default function RjecnikScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setResults(await dictRepo.searchDictEntries(q));
    setSearched(true);
  }, []);

  // Osvježi rezultate kad se vratimo (npr. nakon ručnog dodavanja).
  useFocusEffect(
    useCallback(() => {
      if (query.trim()) void runSearch(query);
    }, [query, runSearch]),
  );

  return (
    <Screen padded={false}>
      <View style={styles.searchBar}>
        <Field
          placeholder="Pretraži pojam ili definiciju…"
          value={query}
          onChangeText={runSearch}
          autoCorrect={false}
          autoCapitalize="none"
          style={{ marginBottom: 0 }}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title={searched ? 'Nema rezultata' : 'Rječnik'}
            hint={
              searched
                ? 'Pokušaj drugi pojam ili dodaj odrednicu ručno.'
                : 'Upiši pojam za pretragu. Ručno dodane odrednice odmah su pretražive.'
            }
          />
        }
        renderItem={({ item }) => (
          <Card>
            <View style={styles.entryHead}>
              <Text variant="heading">{item.term}</Text>
              {item.pos ? (
                <Text variant="muted" style={styles.pos}>
                  {item.pos}
                </Text>
              ) : null}
            </View>
            <Text style={{ marginTop: 4 }}>{item.definition}</Text>
            {item.exampleTerm ? (
              <Text variant="muted" style={{ marginTop: 6, fontStyle: 'italic' }}>
                {item.exampleTerm}
                {item.exampleDefinition ? ` — ${item.exampleDefinition}` : ''}
              </Text>
            ) : null}
          </Card>
        )}
      />

      <View style={[styles.footer, { borderTopColor: theme.line }]}>
        <Button
          title="+ Dodaj odrednicu ručno"
          variant="secondary"
          onPress={() => router.push('/dict/new')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBar: { paddingHorizontal: 16, paddingTop: 12 },
  list: { padding: 16, gap: 10, flexGrow: 1 },
  entryHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  pos: { fontStyle: 'italic' },
  footer: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
