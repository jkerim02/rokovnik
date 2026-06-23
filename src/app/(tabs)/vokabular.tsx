import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Card, EmptyState, Field, Screen, Text } from '@/components/ui';
import { vocabRepo } from '@/db/repositories';
import { useDecks } from '@/features/vocab/useVocab';
import { useTheme } from '@/theme';

export default function VokabularScreen() {
  const { theme } = useTheme();
  const { decks, loading, refresh } = useDecks();
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  async function createDeck() {
    if (!newName.trim()) return;
    await vocabRepo.createDeck({ name: newName.trim(), bookId: null });
    setNewName('');
    setAdding(false);
    await refresh();
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={decks}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          adding ? (
            <Card>
              <Field
                label="Naziv liste"
                value={newName}
                onChangeText={setNewName}
                autoFocus
                onSubmitEditing={createDeck}
                style={{ marginBottom: 8 }}
              />
              <View style={styles.addActions}>
                <Text
                  variant="label"
                  color={theme.muted}
                  onPress={() => {
                    setAdding(false);
                    setNewName('');
                  }}>
                  Odustani
                </Text>
                <Text variant="label" color={theme.accent} onPress={createDeck}>
                  Sačuvaj
                </Text>
              </View>
            </Card>
          ) : (
            <Pressable
              onPress={() => setAdding(true)}
              style={[styles.addBtn, { borderColor: theme.line }]}>
              <Text variant="label" color={theme.accent}>
                + Nova lista
              </Text>
            </Pressable>
          )
        }
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              title="Nema lista"
              hint="Napravi prvu vokabular listu (deck) dugmetom gore."
            />
          )
        }
        renderItem={({ item }) => (
          <Card onPress={() => router.push(`/deck/${item.id}`)}>
            <Text variant="heading">{item.name}</Text>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10, flexGrow: 1 },
  addBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
    paddingVertical: 16,
    alignItems: 'center',
  },
  addActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 18 },
});
