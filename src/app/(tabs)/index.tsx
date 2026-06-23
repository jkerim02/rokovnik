import { Stack, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Card, EmptyState, Screen, Text } from '@/components/ui';
import { BookCover } from '@/features/books/BookCover';
import { statusLabel } from '@/features/books/bookStatus';
import { useBooks } from '@/features/books/useBooks';
import { useTheme } from '@/theme';

export default function BibliotekaScreen() {
  const { theme } = useTheme();
  const { books, loading, refresh } = useBooks();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <Screen padded={false}>
      <Stack.Screen
        options={{
          title: 'Biblioteka',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={() => router.push('/stats')}
                hitSlop={12}
                style={{ paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 18 }}>📊</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/settings')}
                hitSlop={12}
                style={{ paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 18 }}>⚙️</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <FlatList
        data={books}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              title="Još nema knjiga"
              hint="Dodaj prvu knjigu dugmetom + dolje."
            />
          )
        }
        renderItem={({ item }) => (
          <Card onPress={() => router.push(`/book/${item.id}`)} style={styles.row}>
            <BookCover uri={item.coverLocalPath} title={item.title} />
            <View style={styles.meta}>
              <Text variant="heading" numberOfLines={2}>
                {item.title}
              </Text>
              {item.author ? (
                <Text variant="muted" numberOfLines={1} style={{ marginTop: 2 }}>
                  {item.author}
                </Text>
              ) : null}
              <Text
                variant="label"
                color={theme.accent}
                style={{ marginTop: 6 }}>
                {statusLabel(item.status)}
              </Text>
            </View>
          </Card>
        )}
      />

      <Pressable
        onPress={() => router.push('/book/new')}
        style={[styles.fab, { backgroundColor: theme.accent }]}>
        <Text style={{ fontSize: 28, lineHeight: 30 }} color={theme.accentInk}>
          +
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  meta: { flex: 1 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
