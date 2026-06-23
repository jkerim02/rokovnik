import { Stack, router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/ui';
import { notesRepo } from '@/db/repositories';
import { NoteForm } from '@/features/notes/NoteForm';

export default function AddNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: 'Nova bilješka' }} />
      <NoteForm
        submitLabel="Sačuvaj bilješku"
        onSubmit={async (input) => {
          await notesRepo.createNote({ ...input, bookId: id });
          router.back();
        }}
      />
    </Screen>
  );
}
