import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button, EmptyState, Screen } from '@/components/ui';
import { vocabRepo } from '@/db/repositories';
import { buildQuestions, type QuizQuestion } from '@/features/quiz/buildQuiz';
import { QuizPlayer } from '@/features/quiz/QuizPlayer';

export default function VocabQuizScreen() {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);

  useEffect(() => {
    void (async () => {
      const entries = await vocabRepo.listAllVocab();
      setQuestions(
        buildQuestions(
          entries.map((e) => ({ id: e.id, prompt: e.word, answer: e.meaning })),
        ),
      );
    })();
  }, []);

  if (questions === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen options={{ title: 'Kviz: Vokabular' }} />
        <ActivityIndicator />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Kviz: Vokabular' }} />
        <EmptyState
          title="Premalo pojmova"
          hint="Dodaj barem 2 pojma u vokabular liste da pokreneš kviz."
        />
        <Button title="Nazad" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Kviz: Vokabular' }} />
      <QuizPlayer
        mode="vocab"
        questions={questions}
        promptKind="Šta znači"
        onDone={() => router.back()}
      />
    </>
  );
}
