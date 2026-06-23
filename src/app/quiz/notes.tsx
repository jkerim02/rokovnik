import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button, EmptyState, Screen } from '@/components/ui';
import { booksRepo, notesRepo } from '@/db/repositories';
import { buildQuestions, type QuizQuestion } from '@/features/quiz/buildQuiz';
import { QuizPlayer } from '@/features/quiz/QuizPlayer';

export default function NotesQuizScreen() {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);

  useEffect(() => {
    void (async () => {
      const [citati, books] = await Promise.all([
        notesRepo.listNotesByCategory('citat'),
        booksRepo.listBooks(),
      ]);
      const titleById = new Map(books.map((b) => [b.id, b.title]));
      const items = citati
        .filter((n) => n.bookId && titleById.has(n.bookId))
        .map((n) => ({
          id: n.id,
          prompt: n.text,
          answer: titleById.get(n.bookId as string) as string,
        }));
      setQuestions(buildQuestions(items));
    })();
  }, []);

  if (questions === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen options={{ title: 'Kviz: Citati' }} />
        <ActivityIndicator />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Kviz: Citati' }} />
        <EmptyState
          title="Premalo citata"
          hint="Dodaj citate (kategorija Citat) za barem 2 različite knjige."
        />
        <Button title="Nazad" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Kviz: Citati' }} />
      <QuizPlayer
        mode="notes"
        questions={questions}
        promptKind="Iz koje je knjige citat"
        onDone={() => router.back()}
      />
    </>
  );
}
