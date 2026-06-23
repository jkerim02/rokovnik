import {
  Stack,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Field, Screen, Text } from '@/components/ui';
import { vocabRepo } from '@/db/repositories';
import { useDeck } from '@/features/vocab/useVocab';
import { useTheme } from '@/theme';

export default function DeckScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { deck, entries, loading, refresh } = useDeck(id);

  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  async function addWord() {
    if (!word.trim() || !meaning.trim()) {
      Alert.alert('Riječ i značenje su obavezni');
      return;
    }
    setSaving(true);
    try {
      await vocabRepo.createVocab({
        deckId: id,
        source: 'custom',
        word: word.trim(),
        meaning: meaning.trim(),
      });
      setWord('');
      setMeaning('');
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(entryId: string) {
    Alert.alert('Obriši pojam?', undefined, [
      { text: 'Odustani', style: 'cancel' },
      {
        text: 'Obriši',
        style: 'destructive',
        onPress: async () => {
          await vocabRepo.deleteVocab(entryId);
          await refresh();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: deck?.name ?? 'Lista' }} />

      <Card style={{ marginBottom: 16 }}>
        <Field label="Riječ" value={word} onChangeText={setWord} style={{ marginBottom: 8 }} />
        <Field
          label="Značenje"
          value={meaning}
          onChangeText={setMeaning}
          style={{ marginBottom: 12 }}
        />
        <Button title="Dodaj pojam" onPress={addWord} loading={saving} />
      </Card>

      {entries.length === 0 ? (
        <Text variant="muted">Lista je prazna. Dodaj prvi pojam gore.</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {entries.map((e) => (
            <Card key={e.id} onPress={() => confirmDelete(e.id)}>
              <View style={styles.row}>
                <Text variant="heading">{e.word}</Text>
                <Text color={theme.muted}>{e.meaning}</Text>
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' },
});
