/** NoteForm — dijeljena forma za dodavanje/uređivanje bilješke. */
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button, Field, Text } from '@/components/ui';
import type { NoteInput } from '@/db/repositories/notesRepo';
import type { Note } from '@/db/schema';
import { useTheme, type NoteCategory } from '@/theme';
import { CATEGORY_LABELS, CATEGORY_ORDER, categoryColor } from './noteCategory';

type Props = {
  initial?: Note;
  submitLabel: string;
  onSubmit: (input: Omit<NoteInput, 'bookId'>) => Promise<void>;
};

export function NoteForm({ initial, submitLabel, onSubmit }: Props) {
  const { theme } = useTheme();
  const [text, setText] = useState(initial?.text ?? '');
  const [page, setPage] = useState(
    initial?.page != null ? String(initial.page) : '',
  );
  const [category, setCategory] = useState<NoteCategory>(
    (initial?.category as NoteCategory) ?? 'citat',
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) {
      Alert.alert('Tekst bilješke je obavezan');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        text: text.trim(),
        page: page.trim() ? Number(page) : null,
        category,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <View>
      <Text variant="label" color={theme.muted} style={styles.label}>
        Kategorija
      </Text>
      <View style={styles.catRow}>
        {CATEGORY_ORDER.map((c) => {
          const selected = category === c;
          return (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[
                styles.chip,
                {
                  borderColor: selected ? categoryColor(c) : theme.line,
                  backgroundColor: selected ? categoryColor(c) : 'transparent',
                },
              ]}>
              <Text variant="label" color={selected ? '#fff' : theme.ink}>
                {CATEGORY_LABELS[c]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Field
        label="Stranica"
        value={page}
        onChangeText={setPage}
        keyboardType="number-pad"
        style={{ marginTop: 14 }}
      />
      <Field
        label="Tekst"
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={5}
        style={{ minHeight: 110, textAlignVertical: 'top' }}
      />

      <Button title={submitLabel} onPress={handleSubmit} loading={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 8 },
  catRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
