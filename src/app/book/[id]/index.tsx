import {
  Stack,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Screen, Text } from '@/components/ui';
import { booksRepo, notesRepo } from '@/db/repositories';
import { BookCover } from '@/features/books/BookCover';
import { statusLabel } from '@/features/books/bookStatus';
import { useBook } from '@/features/books/useBooks';
import { NoteItem } from '@/features/notes/NoteItem';
import { useNotes } from '@/features/notes/useNotes';
import { useTheme } from '@/theme';
import { deleteCover } from '@/utils/imageResize';

export default function BookDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { book, loading, refresh } = useBook(id);
  const { notes, refresh: refreshNotes } = useNotes(id);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      void refreshNotes();
    }, [refresh, refreshNotes]),
  );

  function confirmDeleteNote(noteId: string) {
    Alert.alert('Obriši bilješku?', undefined, [
      { text: 'Odustani', style: 'cancel' },
      {
        text: 'Obriši',
        style: 'destructive',
        onPress: async () => {
          await notesRepo.deleteNote(noteId);
          await refreshNotes();
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

  if (!book) {
    return (
      <Screen>
        <Text variant="heading">Knjiga nije pronađena.</Text>
      </Screen>
    );
  }

  function confirmDelete() {
    if (!book) return;
    Alert.alert('Obriši knjigu?', `„${book.title}" će biti uklonjena.`, [
      { text: 'Odustani', style: 'cancel' },
      {
        text: 'Obriši',
        style: 'destructive',
        onPress: async () => {
          await booksRepo.deleteBook(book.id);
          await deleteCover(book.coverLocalPath);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen scroll>
      <Stack.Screen
        options={{
          title: book.title,
          headerRight: () => (
            <Pressable
              onPress={() => router.push(`/book/${book.id}/edit`)}
              hitSlop={12}
              style={{ paddingHorizontal: 12 }}>
              <Text variant="label" color={theme.accent}>
                Uredi
              </Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.header}>
        <BookCover uri={book.coverLocalPath} title={book.title} size={100} />
        <View style={styles.headerMeta}>
          <Text variant="title">{book.title}</Text>
          {book.author ? (
            <Text variant="muted" style={{ marginTop: 4 }}>
              {book.author}
            </Text>
          ) : null}
          <Text variant="label" color={theme.accent} style={{ marginTop: 8 }}>
            {statusLabel(book.status)}
          </Text>
        </View>
      </View>

      <Card style={{ marginTop: 16 }}>
        <DetailRow label="Izdavač" value={book.publisher} />
        <DetailRow label="Izdanje" value={book.edition} />
        <DetailRow
          label="Stranica"
          value={book.pages != null ? String(book.pages) : null}
        />
        {book.description ? (
          <View style={{ marginTop: 8 }}>
            <Text variant="label" color={theme.muted}>
              Opis
            </Text>
            <Text style={{ marginTop: 4 }}>{book.description}</Text>
          </View>
        ) : null}
      </Card>

      <View style={styles.sectionHead}>
        <Text variant="heading">Bilješke</Text>
        <Pressable onPress={() => router.push(`/book/${book.id}/note`)} hitSlop={10}>
          <Text variant="label" color={theme.accent}>
            + Dodaj
          </Text>
        </Pressable>
      </View>
      {notes.length === 0 ? (
        <Text variant="muted" style={{ marginTop: 4 }}>
          Još nema bilješki za ovu knjigu.
        </Text>
      ) : (
        <View style={{ gap: 10, marginTop: 4 }}>
          {notes.map((n) => (
            <NoteItem key={n.id} note={n} onPress={() => confirmDeleteNote(n.id)} />
          ))}
        </View>
      )}

      {/* Sesije čitanja se dodaju u narednom koraku. */}

      <Button
        title="Obriši knjigu"
        variant="danger"
        onPress={confirmDelete}
        style={{ marginTop: 24 }}
      />
    </Screen>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  const { theme } = useTheme();
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Text variant="label" color={theme.muted}>
        {label}
      </Text>
      <Text>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', gap: 16, alignItems: 'flex-start', marginTop: 8 },
  headerMeta: { flex: 1 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    gap: 12,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 6,
  },
});
