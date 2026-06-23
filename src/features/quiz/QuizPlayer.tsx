/**
 * QuizPlayer — odigrava set pitanja, prati streak, crveno SAMO za grešku (§17),
 * na kraju upisuje rezultat u quiz_stats i prikazuje sažetak.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Screen, Text } from '@/components/ui';
import { quizRepo } from '@/db/repositories';
import type { QuizMode } from '@/db/repositories/quizRepo';
import { errorRed, useTheme } from '@/theme';
import type { QuizQuestion } from './buildQuiz';

type Props = {
  mode: QuizMode;
  questions: QuizQuestion[];
  promptKind: string; // npr. "Šta znači" ili "Iz koje knjige je citat"
  onDone: () => void;
};

export function QuizPlayer({ mode, questions, promptKind, onDone }: Props) {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];

  function pick(optionIndex: number) {
    if (picked !== null) return;
    setPicked(optionIndex);
    const isRight = optionIndex === q.correctIndex;
    if (isRight) {
      setCorrect((c) => c + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  }

  async function next() {
    if (index + 1 >= questions.length) {
      await quizRepo.recordRound(mode, {
        correct,
        attempts: questions.length,
        roundBestStreak: bestStreak,
      });
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  if (finished) {
    return (
      <Screen scroll>
        <Card style={styles.summary}>
          <Text variant="title">Gotovo!</Text>
          <Text variant="heading" style={{ marginTop: 12 }}>
            {correct} / {questions.length} tačnih
          </Text>
          <Text variant="muted" style={{ marginTop: 4 }}>
            Najbolji niz: {bestStreak}
          </Text>
        </Card>
        <Button title="Završi" onPress={onDone} style={{ marginTop: 20 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text variant="muted">
        Pitanje {index + 1} / {questions.length} · niz {streak}
      </Text>

      <Card style={styles.promptCard}>
        <Text variant="muted">{promptKind}</Text>
        <Text variant="heading" style={{ marginTop: 8 }}>
          {q.prompt}
        </Text>
      </Card>

      <View style={{ gap: 10, marginTop: 16 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isPicked = i === picked;
          let bg = theme.surface;
          let border = theme.line;
          if (picked !== null) {
            if (isCorrect) {
              bg = theme.accent;
              border = theme.accent;
            } else if (isPicked) {
              bg = errorRed; // crvena samo za pogrešan odabir
              border = errorRed;
            }
          }
          const fg =
            picked !== null && (isCorrect || isPicked) ? '#fff' : theme.ink;
          return (
            <Pressable
              key={i}
              onPress={() => pick(i)}
              style={[styles.option, { backgroundColor: bg, borderColor: border }]}>
              <Text color={fg}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>

      {picked !== null ? (
        <Button
          title={index + 1 >= questions.length ? 'Vidi rezultat' : 'Sljedeće'}
          onPress={next}
          style={{ marginTop: 20 }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  promptCard: { marginTop: 16 },
  summary: { alignItems: 'center', paddingVertical: 28 },
  option: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
