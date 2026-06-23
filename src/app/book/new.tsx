import { Stack, router } from 'expo-router';

import { Screen } from '@/components/ui';
import { booksRepo } from '@/db/repositories';
import { BookForm } from '@/features/books/BookForm';

export default function NewBookScreen() {
  return (
    <Screen scroll>
      <Stack.Screen options={{ title: 'Nova knjiga' }} />
      <BookForm
        submitLabel="Sačuvaj knjigu"
        onSubmit={async (input) => {
          const book = await booksRepo.createBook(input);
          // Zamijeni create ekran detaljem nove knjige.
          router.replace(`/book/${book.id}`);
        }}
      />
    </Screen>
  );
}
