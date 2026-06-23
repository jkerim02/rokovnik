import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { Screen } from '@/components/ui';
import { booksRepo } from '@/db/repositories';
import { BookForm } from '@/features/books/BookForm';
import { useBook } from '@/features/books/useBooks';

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { book, loading } = useBook(id);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!book) {
    router.back();
    return null;
  }

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: 'Uredi knjigu' }} />
      <BookForm
        initial={book}
        submitLabel="Sačuvaj izmjene"
        onSubmit={async (input) => {
          await booksRepo.updateBook(book.id, input);
          router.back();
        }}
      />
    </Screen>
  );
}
