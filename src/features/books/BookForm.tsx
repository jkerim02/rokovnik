/**
 * BookForm — dijeljena forma za kreiranje i uređivanje knjige.
 * Uključuje odabir naslovnice (galerija/kamera), status i osnovna polja.
 */
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Field, Text } from '@/components/ui';
import type { BookInput } from '@/db/repositories/booksRepo';
import type { Book } from '@/db/schema';
import { useTheme } from '@/theme';
import {
  deleteCover,
  pickCoverFromCamera,
  pickCoverFromLibrary,
} from '@/utils/imageResize';
import { BookCover } from './BookCover';
import { STATUS_LABELS, STATUS_ORDER, type BookStatus } from './bookStatus';

type Props = {
  initial?: Book;
  submitLabel: string;
  onSubmit: (input: BookInput) => Promise<void>;
};

export function BookForm({ initial, submitLabel, onSubmit }: Props) {
  const { theme } = useTheme();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [publisher, setPublisher] = useState(initial?.publisher ?? '');
  const [edition, setEdition] = useState(initial?.edition ?? '');
  const [pages, setPages] = useState(
    initial?.pages != null ? String(initial.pages) : '',
  );
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState<BookStatus>(
    (initial?.status as BookStatus) ?? 'za-citati',
  );
  const [cover, setCover] = useState<string | null>(
    initial?.coverLocalPath ?? null,
  );
  const [saving, setSaving] = useState(false);

  async function handlePickCover(from: 'library' | 'camera') {
    const path =
      from === 'library'
        ? await pickCoverFromLibrary()
        : await pickCoverFromCamera();
    if (path) {
      // Ako je postojala druga lokalno biranja u ovoj sesiji, očisti je.
      if (cover && cover !== initial?.coverLocalPath) await deleteCover(cover);
      setCover(path);
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert('Naslov je obavezan');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        author: author.trim() || null,
        publisher: publisher.trim() || null,
        edition: edition.trim() || null,
        pages: pages.trim() ? Number(pages) : null,
        description: description.trim() || null,
        status,
        coverLocalPath: cover,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <View>
      <Card style={styles.coverCard}>
        <BookCover uri={cover} title={title} size={84} />
        <View style={styles.coverActions}>
          <Button
            title="Galerija"
            variant="secondary"
            onPress={() => handlePickCover('library')}
          />
          <Button
            title="Kamera"
            variant="secondary"
            onPress={() => handlePickCover('camera')}
          />
        </View>
      </Card>

      <Field label="Naslov *" value={title} onChangeText={setTitle} />
      <Field label="Autor" value={author} onChangeText={setAuthor} />
      <Field label="Izdavač" value={publisher} onChangeText={setPublisher} />
      <Field label="Izdanje" value={edition} onChangeText={setEdition} />
      <Field
        label="Broj stranica"
        value={pages}
        onChangeText={setPages}
        keyboardType="number-pad"
      />
      <Field
        label="Opis"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={{ minHeight: 70, textAlignVertical: 'top' }}
      />

      <Text variant="label" color={theme.muted} style={styles.statusLabel}>
        Status
      </Text>
      <View style={styles.statusRow}>
        {STATUS_ORDER.map((s) => {
          const selected = status === s;
          return (
            <Pressable
              key={s}
              onPress={() => setStatus(s)}
              style={[
                styles.statusChip,
                {
                  borderColor: selected ? theme.accent : theme.line,
                  backgroundColor: selected ? theme.accent : 'transparent',
                },
              ]}>
              <Text
                variant="label"
                color={selected ? theme.accentInk : theme.ink}>
                {STATUS_LABELS[s]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        title={submitLabel}
        onPress={handleSubmit}
        loading={saving}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  coverCard: { flexDirection: 'row', gap: 16, alignItems: 'center', marginBottom: 16 },
  coverActions: { flex: 1, gap: 8 },
  statusLabel: { marginBottom: 8 },
  statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
