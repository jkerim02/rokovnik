import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Button, Field, Screen, Text } from '@/components/ui';
import { sessionsRepo } from '@/db/repositories';
import { useTheme } from '@/theme';

export default function AddSessionScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [minutes, setMinutes] = useState('');
  const [pages, setPages] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    const mins = Number(minutes);
    if (!minutes.trim() || Number.isNaN(mins) || mins <= 0) {
      Alert.alert('Unesi trajanje u minutama (> 0)');
      return;
    }
    setSaving(true);
    try {
      // Sastavi start/end iz datuma + trajanja (manualni unos).
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(start.getTime() + mins * 60000);
      await sessionsRepo.createSession({
        bookId: id,
        source: 'manual',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        durationMinutes: mins,
        pagesRead: pages.trim() ? Number(pages) : null,
        note: note.trim() || null,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: 'Dodaj sesiju ručno' }} />
      <Field label="Datum (YYYY-MM-DD)" value={date} onChangeText={setDate} autoCapitalize="none" />
      <Field
        label="Trajanje (minuta) *"
        value={minutes}
        onChangeText={setMinutes}
        keyboardType="number-pad"
      />
      <Field
        label="Pročitano stranica"
        value={pages}
        onChangeText={setPages}
        keyboardType="number-pad"
      />
      <Field label="Bilješka" value={note} onChangeText={setNote} />
      <Text variant="muted" style={{ marginBottom: 12 }} color={theme.muted}>
        Koristi ovo kad zaboraviš pokrenuti tajmer ili logiraš naknadno.
      </Text>
      <Button title="Sačuvaj sesiju" onPress={save} loading={saving} />
    </Screen>
  );
}
