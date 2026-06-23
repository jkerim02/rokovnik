import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Screen, Text } from '@/components/ui';
import { quizRepo } from '@/db/repositories';
import type { QuizStat } from '@/db/schema';
import { useTheme } from '@/theme';

export default function UcenjeScreen() {
  const { theme } = useTheme();
  const [vocabStat, setVocabStat] = useState<QuizStat | null>(null);
  const [notesStat, setNotesStat] = useState<QuizStat | null>(null);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        setVocabStat(await quizRepo.getStat('vocab'));
        setNotesStat(await quizRepo.getStat('notes'));
      })();
    }, []),
  );

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginBottom: 4 }}>
        Učenje
      </Text>
      <Text variant="muted" style={{ marginBottom: 16 }}>
        Odaberi kviz.
      </Text>

      <QuizCard
        title="Vokabular"
        subtitle="Riječ → pogodi značenje"
        stat={vocabStat}
        accent={theme.accent}
        onPress={() => router.push('/quiz/vocab')}
      />
      <View style={{ height: 12 }} />
      <QuizCard
        title="Citati"
        subtitle="Citat → pogodi knjigu"
        stat={notesStat}
        accent={theme.accent}
        onPress={() => router.push('/quiz/notes')}
      />
    </Screen>
  );
}

function QuizCard({
  title,
  subtitle,
  stat,
  accent,
  onPress,
}: {
  title: string;
  subtitle: string;
  stat: QuizStat | null;
  accent: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const acc =
    stat && stat.totalAttempts > 0
      ? Math.round((stat.totalCorrect / stat.totalAttempts) * 100)
      : null;
  return (
    <Card onPress={onPress}>
      <Text variant="heading">{title}</Text>
      <Text variant="muted" style={{ marginTop: 2 }}>
        {subtitle}
      </Text>
      <View style={styles.stats}>
        <Stat label="Najbolji niz" value={stat ? String(stat.bestStreak) : '0'} accent={accent} />
        <Stat label="Tačnost" value={acc != null ? `${acc}%` : '—'} accent={accent} />
        <Stat
          label="Odigrano"
          value={stat ? String(stat.totalAttempts) : '0'}
          accent={theme.muted}
        />
      </View>
    </Card>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  const { theme } = useTheme();
  return (
    <View>
      <Text variant="heading" color={accent}>
        {value}
      </Text>
      <Text variant="muted" color={theme.muted}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: 28, marginTop: 14 },
});
